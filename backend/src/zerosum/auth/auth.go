package auth

import (
	"context"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
	"log"
	"net/http"
	"strings"
	"time"
	"zerosum/models"
)

type auth struct {
	secret        string
	signingMethod jwt.SigningMethod
	fbAppId       string
	fbAccessToken string
	httpClient    *http.Client
}

var Auth auth

func (a *auth) generateSignedUserToken(user models.User) (string, error) {
	token := jwt.NewWithClaims(a.signingMethod, jwt.StandardClaims{
		Id: user.Id,
	})
	return token.SignedString([]byte(a.secret))
}

func NewAuth(secret, fbAppId, fbAccessToken string) {
	Auth = auth{
		secret:        secret,
		signingMethod: jwt.SigningMethodHS256,
		fbAppId:       fbAppId,
		fbAccessToken: fbAccessToken,
		httpClient: &http.Client{
			Timeout: time.Second * 10,
		},
	}
}

type HeaderBearerExtractor struct{}

func (e HeaderBearerExtractor) ExtractToken(r *http.Request) (string, error) {
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

func (a *auth) JWTMiddleware(w http.ResponseWriter, r *http.Request) {
	extractor := HeaderBearerExtractor{}
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		return []byte(a.secret), nil
	}
	token, err := request.ParseFromRequest(r, extractor, keyFunc, request.WithClaims(&jwt.StandardClaims{}))
	if err != nil {
		log.Printf("error parsing token: %+v", err)
		return
	}
	if a.signingMethod.Alg() != token.Header["alg"] {
		log.Printf("expected %s signing method but token specified %s",
			a.signingMethod.Alg(), token.Header["alg"])
		return
	}
	if !token.Valid {
		log.Print("token is invalid")
		return
	}

	newReq := r.WithContext(context.WithValue(r.Context(), "Id", token.Claims.(jwt.StandardClaims).Id))
	*r = *newReq
}
