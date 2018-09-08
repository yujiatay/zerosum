package models

import (
	"time"
)

type Poll struct {
	Id string `gorm:"primary_key"`
	Body string
	StartTime time.Time
	EndTime time.Time
	MoneySum int //TODO: confirm if necessary
	Choices []Choice `gorm:"foreignkey:PollId"`
	Users []User `gorm:"many2many:decisions;foreignkey:PollId"`
}

type Choice struct {
	Id string `gorm:"primary_key"`
	Body string
	PollId string // foreign key from poll
	Users []User `gorm:"many2many:decisions;foreignkey:ChoiceId"`
}

type Decision struct {
	PollId string `gorm:"primary_key"` //foreign key from poll
	UserId string `gorm:"primary_key"` // foreign key from user
	ChoiceId string // foreign key from choice
	Money int
}

type User struct {
	Id string `gorm:"primary_key"`
	MoneyTotal int
}
