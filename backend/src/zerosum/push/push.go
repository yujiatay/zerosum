package push

import (
	"encoding/json"
	"github.com/SherClockHolmes/webpush-go"
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
	if err := updateSubscriptionInDb(userId, webpush.Subscription{Endpoint: "nil"}); err != nil {
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
		return err
	}
	if s.Endpoint == "nil" || s.Endpoint == "" {
		return nil // Unsubscribed user
	}
	_, err = webpush.SendNotification([]byte(body), &s, &webpush.Options{
		Subscriber:      settings.sub,
		VAPIDPrivateKey: settings.privateKey,
		HTTPClient:      settings.httpClient,
		Urgency:         webpush.UrgencyNormal,
	})
	if err != nil {
		return err
	}
	log.Printf("notified %s via push", userId)
	return nil
}
func getSubscriptionFromDb(userId string) (webpush.Subscription, error) {
	user, err := repository.QueryUser(models.User{Id: userId})
	return user.PushSubscription, err
}
func updateSubscriptionInDb(userId string, sub webpush.Subscription) error {
	user, err := repository.QueryUser(models.User{Id: userId})
	if err != nil {
		return err
	}
	user.PushSubscription = sub
	return repository.UpdateUser(user)
}