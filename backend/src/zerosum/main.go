package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"github.com/urfave/negroni"
	"io/ioutil"
	"log"
	"net/http"
	"zerosum/repository"
)

func getSchema(path string) (string, error) {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func main() {
	_ = gin.Default()
	err := repository.InitTestDB()
	fmt.Print(err)
	s, err := getSchema("schema/schema.graphql")
	rootResolver := resolver.resolver // TODO: Add resolver path here
	schema := graphql.MustParseSchema(s, &rootResolver)
	apiHandler := relay.Handler{Schema: schema}
	mux := http.NewServeMux()
	mux.Handle("/query", &apiHandler)
	n := negroni.Classic()
	n.UseHandler(mux)
	log.Fatal(http.ListenAndServe("localhost:8080", n))
}
