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

var extractor = headerBearerExtractor{}

func keyFunc(token *jwt.Token) (interface{}, error) {
	return []byte(settings.secret), nil
}

// Handler function accepting a next argument (for use as negroni middleware)
func TokenAuthNegroniMiddleware(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	if err := extractAndValidateAuthToken(r); err != nil {
		log.Print(err)
		http.Error(w, "Error processing authorization token", http.StatusUnauthorized)
		return
	}
	next(w, r)
}

func extractAndValidateAuthToken(r *http.Request) (error) {
	token, err := request.ParseFromRequest(r, extractor, keyFunc, request.WithClaims(&jwt.StandardClaims{}))
	if err != nil {
		return fmt.Errorf("error parsing token: %+v", err)
	}
	if settings.signingMethod.Alg() != token.Header["alg"] {
		return fmt.Errorf("expected %s signing method but token specified %s",
			settings.signingMethod.Alg(), token.Header["alg"])
	}
	if !token.Valid {
		return fmt.Errorf("token is invalid")
	}

	newReq := r.WithContext(context.WithValue(r.Context(), "Id", token.Claims.(*jwt.StandardClaims).Id))
	*r = *newReq
	return nil
}
