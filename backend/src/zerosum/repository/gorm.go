package repository

import (
	"errors"
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"zerosum/models"
)

// Global singleton instance
var db *gorm.DB

/* DATABASE CONFIG*/
func InitTestDB() (err error) {
	db, err = gorm.Open("postgres", fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%d",
		"postgres", "password", "zerosum", "localhost", 5432))

	// Set up database tables
	db.AutoMigrate(&models.Poll{}, &models.Vote{}, &models.Choice{}, &models.User{})

	// Add foreign key constraints
	db.Model(models.Choice{}).AddForeignKey("poll_id", "poll(id)", "CASCADE", "RESTRICT")
	db.Model(models.Poll{}).AddForeignKey("user_id", "user(id)", "CASCADE", "RESTRICT")
	db.Model(models.Vote{}).AddForeignKey("poll_id", "poll(id)", "CASCADE", "RESTRICT")
	db.Model(models.Vote{}).AddForeignKey("choice_id", "choice(id)", "CASCADE", "RESTRICT")
	db.Model(models.Vote{}).AddForeignKey("user_id", "user(id)", "CASCADE", "RESTRICT")
	return
}

func CloseTestDB() {
	db.Close()
}

/* POLL CRUD */
func CreatePoll(poll models.Poll) (err error) {
	// Check if alr exists
	if !db.NewRecord(poll) {
		err = errors.New("poll exists")
		return
	}
	res := db.Create(&poll)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func QueryPoll(desiredPoll models.Poll) (poll models.Poll, err error) {
	res := db.Where(desiredPoll).First(&poll)
	if res.RecordNotFound() {
		err = errors.New("no poll found")
	} else if res.Error != nil {
		err = res.Error
	}

	return
}

func QueryPolls(desiredPolls models.Poll) (polls []models.Poll, err error) {
	res := db.Where(desiredPolls).Find(&polls)
	if res.RecordNotFound() {
		err = errors.New("no poll found")
	} else if res.Error != nil {
		err = res.Error
	}

	return
}

func UpdatePoll(poll models.Poll) (err error) {
	// Check if exists
	if db.NewRecord(poll) {
		err = errors.New("poll does not exist")
		return
	}
	res:= db.Model(&models.Poll{}).Updates(poll)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func DeletePoll(poll models.Poll) (err error) {
	// Check if exists
	if db.NewRecord(poll) {
		err = errors.New("poll does not exist")
		return
	}
	res:= db.Delete(&poll)
	if res.Error != nil {
		err = res.Error
	}

	return
}

/* USER CRUD */
func CreateUser(user models.User) (err error) {
	// Check if alr exists
	if !db.NewRecord(user) {
		err = errors.New("user exists")
		return
	}
	res := db.Create(&user)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func UpdateUser(user models.User) (err error) {
	// Check if exists
	if db.NewRecord(user) {
		err = errors.New("user does not exist")
		return
	}
	res:= db.Model(&models.User{}).Updates(user)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func DeleteUser(user models.User) (err error) {
	// Check if exists
	if db.NewRecord(user) {
		err = errors.New("user does not exist")
		return
	}
	res:= db.Delete(&user)
	if res.Error != nil {
		err = res.Error
	}

	return
}

/* DECISION CRUD */
func CreateDecision(decision models.Vote) (err error) {
	// Check if alr exists
	if !db.NewRecord(decision) {
		err = errors.New("decision exists")
		return
	}
	res := db.Create(&decision)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func UpdateDecision(decision models.Vote) (err error) {
	// Check if exists
	if db.NewRecord(decision) {
		err = errors.New("decision does not exist")
		return
	}
	res:= db.Model(&models.Vote{}).Updates(decision)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func DeleteDecision(decision models.Vote) (err error) {
	// Check if exists
	if db.NewRecord(decision) {
		err = errors.New("decision does not exist")
		return
	}
	res:= db.Delete(&decision)
	if res.Error != nil {
		err = res.Error
	}

	return
}
