package auth

import (
	"context"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"os"
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

func InitAuthWithSettings(secret, fbAppId, fbAccessToken string, httpClient *http.Client) {
	settings = authSettings{
		secret:        secret,
		signingMethod: jwt.SigningMethodHS256,
		fbAppId:       fbAppId,
		fbAccessToken: fbAccessToken,
		httpClient:    httpClient,
	}
}
func GetIdFromCtx(ctx context.Context) (id string) {
	if os.Getenv("DEBUG") == "TRUE" {
		return "testuser"
	}
	return ctx.Value("Id").(string)
}
