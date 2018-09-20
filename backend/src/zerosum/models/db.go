package models

import "time"

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
	MoneySum     int //TODO: confirm if necessary
	Options      []Option `gorm:"foreignkey:GameId"`
	Participants []User   `gorm:"many2many:votes;foreignkey:GameId"`
}

type Option struct {
	Id     string `gorm:"primary_key"`
	Body   string
	GameId string // foreign key from game
	Users  []User `gorm:"many2many:votes;foreignkey:OptionId"`
}

type User struct {
	Id                string `gorm:"primary_key"`
	MoneyTotal        int
	GamesCreated      []Game `gorm:"foreignkey:UserId"`
	GamesParticipated []Game `gorm:"foreignkey:UserId"`
	FbId              string `gorm:"unique_index"`
}

type Vote struct {
	GameId   string `gorm:"primary_key"` //foreign key from game
	UserId   string `gorm:"primary_key"` // foreign key from user
	OptionId string                      // foreign key from option
	Money    int
}
