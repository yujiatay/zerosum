package auth

import (
	"context"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
	"log"
	"net/http"
	"strings"
)

type headerBearerExtractor struct{}

func (e headerBearerExtractor) ExtractToken(r *http.Request) (string, error) {
	header := r.Header.Get("Authorization")
	if header == "" {
		return "", request.ErrNoTokenInRequest
	}
	headerParts := strings.Split(header, " ")
	if len(headerParts) != 2 || strings.ToLower(headerParts[0]) != "bearer" {
		return "", fmt.Errorf("authorization header format must be Bearer {token}")
	}

	return headerParts[1], nil
}

func JWTMiddleware(w http.ResponseWriter, r *http.Request) {
	extractor := headerBearerExtractor{}
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		return []byte(settings.secret), nil
	}
	token, err := request.ParseFromRequest(r, extractor, keyFunc, request.WithClaims(&jwt.StandardClaims{}))
	if err != nil {
		log.Printf("error parsing token: %+v", err)
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}
	if settings.signingMethod.Alg() != token.Header["alg"] {
		log.Printf("expected %s signing method but token specified %s",
			settings.signingMethod.Alg(), token.Header["alg"])
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}
	if !token.Valid {
		log.Print("token is invalid")
		http.Error(w, "invalid token", http.StatusUnauthorized)
		return
	}

	newReq := r.WithContext(context.WithValue(r.Context(), "Id", token.Claims.(*jwt.StandardClaims).Id))
	*r = *newReq
}
