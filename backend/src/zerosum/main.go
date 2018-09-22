package main

import (
	"github.com/gorilla/mux"
	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"github.com/rs/cors"
	"github.com/urfave/negroni"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"zerosum/auth"
	"zerosum/repository"
	"zerosum/resolvers"
)

func readSchema(path string) (string, error) {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func NewGqlHandler(schemaPath string, rootResolver *resolvers.Resolver) (http.Handler, error) {
	s, err := readSchema(schemaPath)
	schema := graphql.MustParseSchema(s, rootResolver)
	handler := &relay.Handler{Schema: schema}
	return handler, err
}

const SCHEMA_PATH = "models/schema/schema.graphql"

func main() {
	err := repository.InitTestDB()
	if err != nil {
		log.Print(err)
	}
	rootResolver := resolvers.Resolver{}
	gqlHandler, err := NewGqlHandler(SCHEMA_PATH, &rootResolver)
	if err != nil {
		log.Print(err)
	}
	auth.NewAuth(
		os.Getenv("ZEROSUM_SECRET"),
		os.Getenv("FACEBOOK_APP_ID"),
		os.Getenv("FACEBOOK_ACCESS_TOKEN"),
	)
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedHeaders: []string{"X-Requested-With", "Accept", "Content-Type", "Content-Length",
			"Accept-Encoding", "X-CSRF-Token", "Authorization"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
	})
	router := mux.NewRouter()
	authRouter := mux.NewRouter()
	router.HandleFunc("/api/login/facebook", auth.Auth.FbLoginHandler).Methods("POST")
	authRouter.Handle("/api/gql", gqlHandler)
	an := negroni.New(auth.Auth.GetJwtMiddleware(), negroni.Wrap(authRouter))
	// Pass all "/api"-prefixed endpoints through auth middleware and authRouter, except those directly registered
	// on `router`
	router.PathPrefix("/api").Handler(an)
	// Pass all routes through Classic and CORS middlewares before going to main router
	n := negroni.Classic()
	n.Use(corsMiddleware)
	n.UseHandler(router)
	n.Run(":8080")
}
