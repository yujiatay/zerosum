package push

import (
	"encoding/json"
	"github.com/SherClockHolmes/webpush-go"
	"io/ioutil"
	"log"
	"net/http"
	"zerosum/models"
	"zerosum/repository"
)

type pushSettings struct {
	privateKey string
	sub        string // Contact email for subscriptions
	httpClient *http.Client
}

var settings pushSettings

var emptySubscription = webpush.Subscription{Endpoint: "nil"}

func InitPushWithSettings(privKey string, httpClient *http.Client) {
	settings = pushSettings{
		privateKey: privKey,
		sub:        "mailto:guowei@u.nus.edu",
		httpClient: httpClient,
	}
}

func SubscriptionHandler(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("Id").(string)
	sub := webpush.Subscription{}
	if err := json.NewDecoder(r.Body).Decode(&sub); err != nil {
		log.Print(err)
		http.Error(w, err.Error(), 500)
		return
	}
	if err := updateSubscriptionInDb(userId, sub); err != nil {
		log.Print(err)
		http.Error(w, err.Error(), 500)
		return
	} else {
		log.Printf("user %s has subscribed to push notifications", userId)
	}
}

func UnsubscriptionHandler(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value("Id").(string)
	if err := updateSubscriptionInDb(userId, emptySubscription); err != nil {
		log.Print(err)
		http.Error(w, err.Error(), 500)
		return
	} else {
		log.Printf("user %s has unsubscribed from push notifications", userId)
	}
}

func SendNotif(body string, userId string) (error) {
	s, err := getSubscriptionFromDb(userId)
	if err != nil {
		return err // Likely new user/denied permissions
	}
	if s.Endpoint == "" || s.Endpoint == "nil" {
		return nil // Unsubscribed user
	}
	log.Printf("Endpoint: %s", s.Endpoint)
	log.Printf("auth key: %s", s.Keys.Auth)
	log.Printf("pc2dh key: %s", s.Keys.P256dh)
	log.Printf("Priv key: %s", settings.privateKey)
	log.Printf("Sub: %s", settings.sub)
	resp, err := webpush.SendNotification([]byte(body), &s, &webpush.Options{
		Subscriber:      settings.sub,
		VAPIDPrivateKey: settings.privateKey,
		HTTPClient:      settings.httpClient,
		Urgency:         webpush.UrgencyNormal,
	})
	if err != nil {
		return err
	}
	log.Printf("%s, %d", resp.Status, resp.StatusCode)
	bodyString, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	} else {
		log.Printf(string(bodyString))
	}
	log.Printf("notified %s via push", userId)
	return nil
}
func getSubscriptionFromDb(userId string) (webpush.Subscription, error) {
	user, err := repository.QueryUser(models.User{Id: userId})
	if err != nil {
		return emptySubscription, err
	}
	return GetSubscriptionFromJson(user.PushSubscriptionJson)
}
func updateSubscriptionInDb(userId string, sub webpush.Subscription) error {
	user, err := repository.QueryUser(models.User{Id: userId})
	if err != nil {
		return err
	}
	user.PushSubscriptionJson, err = json.Marshal(sub)
	if err != nil {
		return err
	}
	return repository.UpdateUser(user)
}

func GetSubscriptionFromJson(subJson []byte) (sub webpush.Subscription, err error) {
	err = json.Unmarshal(subJson, &sub)
	return
}
