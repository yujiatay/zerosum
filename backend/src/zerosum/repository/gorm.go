package repository

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"zerosum/models"
)

// Global singleton instance
var db *gorm.DB

func InitTestDB() (err error) {
	db, err = gorm.Open("postgres", fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%d",
		"postgres", "password", "zerosum", "localhost", 5432))

	// Set up database tables
	db.AutoMigrate(&models.Poll{}, &models.Decision{}, &models.Choice{}, &models.User{})

	// Add foreign key constraints
	db.Model(models.Choice{}).AddForeignKey("poll_id", "poll(id)", "CASCADE", "RESTRICT")
	db.Model(models.Decision{}).AddForeignKey("poll_id", "poll(id)", "CASCADE", "RESTRICT")
	db.Model(models.Decision{}).AddForeignKey("choice_id", "choice(id)", "CASCADE", "RESTRICT")
	db.Model(models.Decision{}).AddForeignKey("user_id", "user(id)", "CASCADE", "RESTRICT")
	return
}

func CloseTestDB() {
	db.Close()
}

