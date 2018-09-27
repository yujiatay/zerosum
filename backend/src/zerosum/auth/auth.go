package auth

import (
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"time"
	"zerosum/models"
)

type authSettings struct {
	secret        string
	signingMethod jwt.SigningMethod
	fbAppId       string
	fbAccessToken string
	httpClient    *http.Client
}

var settings authSettings

func generateSignedUserToken(user models.User) (string, error) {
	token := jwt.NewWithClaims(settings.signingMethod, jwt.StandardClaims{
		Id: user.Id,
	})
	return token.SignedString([]byte(settings.secret))
}

func InitAuthWithSettings(secret, fbAppId, fbAccessToken string) {
	settings = authSettings{
		secret:        secret,
		signingMethod: jwt.SigningMethodHS256,
		fbAppId:       fbAppId,
		fbAccessToken: fbAccessToken,
		httpClient: &http.Client{
			Timeout: time.Second * 10,
		},
	}
}
