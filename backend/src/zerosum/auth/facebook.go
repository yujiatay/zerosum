package auth

import (
	"encoding/json"
	"fmt"
	"github.com/graph-gophers/graphql-go/errors"
	"log"
	"net/http"
)

func (a *auth) FbLoginHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	accessToken := r.Form.Get("access-token")
	if err := a.verifyFbToken(accessToken); err != nil {
		log.Print(err)
		http.Error(w, err.Error(), 500)
		return
	}
	// Fb profile-from-token API
	res, err := http.Get(fmt.Sprintf("graph.facebook.com/me?%s", accessToken))
	if err != nil {
		log.Print(err)
		http.Error(w, err.Error(), 500)
		return
	}
	var fbUser FbUser
	json.NewDecoder(res.Body).Decode(&fbUser)
	// TODO: check if user is in db, if no, create entry
	signedToken, err := a.generateSignedUserToken(user)
	if err != nil {
		log.Print(err)
		http.Error(w, err.Error(), 500)
		return
	}
	w.Write([]byte(signedToken))
}

func (a *auth) verifyFbToken(token string) (err error) {
	// Fb token verification API
	res, err := http.Get(fmt.Sprintf("graph.facebook.com/debug_token?input_token=%s&access_token=%s",
		token, a.fbAccessToken))
	if err != nil {
		return
	}
	var body map[string]interface{}
	json.NewDecoder(res.Body).Decode(&body)
	data := body["data"].(map[string]interface{})
	if data["app_id"].(string) != a.fbAppId {
		err = errors.Errorf("App ID mismatch")
	}
	return
}
