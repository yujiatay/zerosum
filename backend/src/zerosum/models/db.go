package models

import (
	"time"
)

type VotingMode int
type GameMode int

const (
	NO_STAKES VotingMode = iota
	FIXED_STAKES
	FIXED_LIMIT
	NO_LIMIT
)
const (
	MAJORITY GameMode = iota
	MINORITY
)

type Poll struct {
	Id string `gorm:"primary_key"`
	UserId string // foreign key from user
	Body string
	StartTime time.Time
	EndTime time.Time
	VotingMode VotingMode
	GameMode GameMode
	MoneySum int //TODO: confirm if necessary
	Choices []Choice `gorm:"foreignkey:PollId"`
	Participants []User `gorm:"many2many:votes;foreignkey:PollId"`
}

type Choice struct {
	Id string `gorm:"primary_key"`
	Body string
	PollId string // foreign key from poll
	Users []User `gorm:"many2many:votes;foreignkey:ChoiceId"`
}

type Vote struct {
	PollId string `gorm:"primary_key"` //foreign key from poll
	UserId string `gorm:"primary_key"` // foreign key from user
	ChoiceId string // foreign key from choice
	Money int
}

type User struct {
	Id string `gorm:"primary_key"`
	MoneyTotal int
	PollsCreated []Poll `gorm:"foreignkey:UserId"`
}
