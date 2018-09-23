package main

import (
	"github.com/gobuffalo/packr"
	"github.com/gorilla/mux"
	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"github.com/rs/cors"
	"github.com/urfave/negroni"
	"log"
	"net/http"
	"os"
	"zerosum/auth"
	"zerosum/repository"
	"zerosum/resolvers"
)

func readSchema() (string, error) {
	box := packr.NewBox("./models/schema")
	return box.MustString("schema.graphql")
}

func NewGqlHandler(rootResolver *resolvers.Resolver) (http.Handler, error) {
	s, err := readSchema()
	schema := graphql.MustParseSchema(s, rootResolver)
	handler := &relay.Handler{Schema: schema}
	return handler, err
}

func GetCorsMiddleware() (negroni.Handler) {
	return cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedHeaders: []string{"X-Requested-With", "Accept", "Content-Type", "Content-Length",
			"Accept-Encoding", "X-CSRF-Token", "Authorization"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
	})
}

func redirectTLSHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://" + r.Host + r.RequestURI, http.StatusMovedPermanently)
}

func main() {
	DEBUG := false
	if os.Getenv("DEBUG") == "TRUE" {
		DEBUG = true
	}
	err := repository.InitTestDB()
	if err != nil {
		log.Print(err)
	}
	rootResolver := resolvers.Resolver{}
	gqlHandler, err := NewGqlHandler(&rootResolver)
	if err != nil {
		log.Print(err)
	}
	auth.NewAuth(
		os.Getenv("ZEROSUM_SECRET"),
		os.Getenv("FACEBOOK_APP_ID"),
		os.Getenv("FACEBOOK_ACCESS_TOKEN"),
	)
	router := mux.NewRouter()
	authRouter := mux.NewRouter()
	router.HandleFunc("/api/login/facebook", auth.Auth.FbLoginHandler).Methods("POST")
	authRouter.Handle("/api/gql", gqlHandler)
	an := negroni.New(auth.Auth.GetJwtMiddleware(), negroni.Wrap(authRouter))
	if DEBUG {
		router.Handle("/noauth/gql", gqlHandler)
	}
	// Pass all endpoints through auth middleware and authRouter, except those directly registered
	// on `router`
	router.PathPrefix("/api").Handler(an)
	// Pass all routes through Classic and CORS middlewares before going to main router
	n := negroni.Classic()
	n.Use(GetCorsMiddleware())
	n.UseHandler(router)

	if DEBUG {
		n.Run(":80")
	} else {
		// Serve on HTTPS only
		sslCertPath := os.Getenv("SSL_CERT_PATH")
		sslKeyPath := os.Getenv("SSL_KEY_PATH")
		go func() {
			// Redirect HTTP -> HTTPS
			if err := http.ListenAndServe(":80", http.HandlerFunc(redirectTLSHandler)); err != nil {
				log.Fatal(err)
			}
		}()
		log.Fatal(http.ListenAndServeTLS(":443", sslCertPath, sslKeyPath, n))
	}
}
