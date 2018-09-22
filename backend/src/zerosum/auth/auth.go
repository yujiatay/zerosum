package auth

import (
	"github.com/auth0/go-jwt-middleware"
	"github.com/dgrijalva/jwt-go"
	"github.com/urfave/negroni"
	"zerosum/models"
)

type auth struct {
	secret        string
	signingMethod jwt.SigningMethod
	fbAppId       string
	fbAccessToken string
}

var Auth auth

func (a *auth) generateSignedUserToken(user models.User) (string, error) {
	token := jwt.NewWithClaims(a.signingMethod, jwt.StandardClaims{
		Id: user.Id,
	})
	return token.SignedString([]byte(a.secret))
}

func (a *auth) GetJwtMiddleware() negroni.Handler {
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte(a.secret), nil
		},
		SigningMethod: a.signingMethod,
	})
	// Make it a negroni Handler
	return negroni.HandlerFunc(jwtMiddleware.HandlerWithNext)
}

func NewAuth(secret, fbAppId, fbAccessToken string) {
	Auth = auth{
		secret:        secret,
		signingMethod: jwt.SigningMethodHS256,
		fbAppId:       fbAppId,
		fbAccessToken: fbAccessToken,
	}
}

func GetClaims(token *jwt.Token) jwt.StandardClaims {
	return token.Claims.(jwt.StandardClaims)
}
