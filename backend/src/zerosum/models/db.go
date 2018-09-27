package models

import (
	"github.com/SherClockHolmes/webpush-go"
	"github.com/jinzhu/gorm"
	"github.com/segmentio/ksuid"
	"time"
)

type Stakes string
type GameMode string

const (
	NO_STAKES    Stakes = "NO_STAKES"
	FIXED_STAKES Stakes = "FIXED_STAKES"
	FIXED_LIMIT  Stakes = "FIXED_LIMIT"
	NO_LIMIT     Stakes = "NO_LIMIT"
)
const (
	MAJORITY GameMode = "MAJORITY"
	MINORITY GameMode = "MINORITY"
)

type Game struct {
	Id           string `gorm:"primary_key"`
	UserId       string // foreign key from user
	Topic        string
	StartTime    time.Time
	EndTime      time.Time
	Stakes       Stakes
	GameMode     GameMode
	Options      []Option `gorm:"foreignkey:GameId"`
	Participants []User   `gorm:"many2many:votes;"`
	Resolved     bool
}

type Option struct {
	Id     string `gorm:"primary_key"`
	Body   string
	GameId string // foreign key from game
	Users  []User `gorm:"many2many:votes;"`
	// Computed values after completion, stored to reduce computation
	Resolved   bool
	Winner     bool
	TotalValue int32
	TotalVotes int32
}

type User struct {
	Id               string `gorm:"primary_key"`
	CreatedAt        time.Time
	Name             string
	MoneyTotal       int32
	Hats             []Hat  `gorm:"many2many:hat_ownerships;"`
	GamesCreate      []Game `gorm:"foreignkey:UserId"`
	FbId             string `gorm:"unique_index"`
	GamesPlayed      int32
	GamesWon         int32
	WinRate          float64
	Experience       int
	PushSubscription webpush.Subscription
}

type Hat struct {
	Id          string `gorm:"primary_key"`
	Name        string
	Price       int32
	StoreLink   string
	ImgLink     string
	Achievement bool
}

type HatOwnership struct {
	HatId  string `gorm:"primary_key"` //foreign key from hat
	UserId string `gorm:"primary_key"` // foreign key from user
	Owned  bool
}

type Vote struct {
	GameId   string `gorm:"primary_key"` //foreign key from game
	UserId   string `gorm:"primary_key"` // foreign key from user
	OptionId string                      // foreign key from option
	Money    int32
	Resolved bool
	// Computed values after completion, stored to reduce computation
	Win    bool
	Change int32
}

func (user *User) BeforeCreate(scope *gorm.Scope) error {
	scope.SetColumn("Id", ksuid.New().String())
	return nil
}

func (user *Game) BeforeCreate(scope *gorm.Scope) error {
	scope.SetColumn("Id", ksuid.New().String())
	return nil
}

func (user *Option) BeforeCreate(scope *gorm.Scope) error {
	scope.SetColumn("Id", ksuid.New().String())
	return nil
}
