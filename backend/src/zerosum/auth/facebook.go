package auth

import (
	"encoding/json"
	"fmt"
	"github.com/graph-gophers/graphql-go/errors"
	"log"
	"net/http"
	"zerosum/models"
	"zerosum/repository"
)

type fbProfile struct {
	Name string                 `json:"name"`
	Id   string                 `json:"id"`
	Err  map[string]interface{} `json:"error"`
}
type fbVerificationResponse struct {
	Data map[string]interface{} `json:"data"`
	Err  map[string]interface{} `json:"error"`
}

type fbLoginRequest struct {
	AccessToken string `json:"accessToken"`
	UserID      string `json:"userID"`
}

func (a *auth) FbLoginHandler(w http.ResponseWriter, r *http.Request) {
	var loginRequest fbLoginRequest
	json.NewDecoder(r.Body).Decode(&loginRequest)
	if err := a.verifyFbToken(loginRequest); err != nil {
		log.Print(err)
		http.Error(w, err.Error(), 500)
		return
	}
	profile, err := a.getFbProfile(loginRequest.AccessToken)
	if err != nil {
		log.Print(err)
		http.Error(w, err.Error(), 500)
		return
	}

	user, err := repository.GetOrCreateUser(models.User{FbId: profile.Id})

	signedToken, err := a.generateSignedUserToken(user)
	log.Printf("Issuing token: %s", signedToken)
	if err != nil {
		log.Print(err)
		http.Error(w, err.Error(), 500)
		return
	}
	w.Write([]byte(signedToken))
}

func (a *auth) getFbProfile(token string) (profile fbProfile, err error) {
	res, err := a.httpClient.Get(fmt.Sprintf("https://graph.facebook.com/me?access_token=%s", token))
	if err != nil {
		return
	}
	json.NewDecoder(res.Body).Decode(&profile)
	//fmt.Println(profile)
	if profile.Err != nil {
		err = errors.Errorf(profile.Err["message"].(string))
	}
	return
}
func (a *auth) verifyFbToken(loginRequest fbLoginRequest) (err error) {
	// Fb token verification API
	res, err := a.httpClient.Get(fmt.Sprintf("https://graph.facebook.com/debug_token?input_token=%s&access_token=%s",
		loginRequest.AccessToken, a.fbAccessToken))
	if err != nil {
		return
	}
	var body fbVerificationResponse
	json.NewDecoder(res.Body).Decode(&body)
	//fmt.Printf("%+v\n", body)
	if body.Err != nil {
		err = errors.Errorf(body.Err["message"].(string))
		return
	}
	if !body.Data["is_valid"].(bool) {
		err = errors.Errorf("Invalid token")
		return
	}
	if body.Data["app_id"].(string) != a.fbAppId {
		err = errors.Errorf("App ID mismatch")
		return
	}
	if body.Data["user_id"].(string) != loginRequest.UserID {
		err = errors.Errorf("User ID mismatch")
	}
	return
}
