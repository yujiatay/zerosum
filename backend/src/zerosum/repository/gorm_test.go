package repository

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"os"
	"testing"
	"time"
	"zerosum/models"
)

var testDb *gorm.DB

func TestMain(m *testing.M) {
	var err error
	errCode := 1
	testDb, err = gorm.Open("postgres", fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%d sslmode=disable",
		"postgres", "password", "zerosumtest", "localhost", 5432))
	if err == nil {
		// Set up database tables
		testDb.AutoMigrate(&models.Poll{}, &models.Vote{}, &models.Choice{}, &models.User{})

		// Add foreign key constraints
		testDb.Model(models.Choice{}).AddForeignKey("poll_id", "polls(id)", "CASCADE", "RESTRICT")
		testDb.Model(models.Vote{}).AddForeignKey("poll_id", "polls(id)", "CASCADE", "RESTRICT")
		testDb.Model(models.Vote{}).AddForeignKey("choice_id", "choices(id)", "CASCADE", "RESTRICT")
		testDb.Model(models.Vote{}).AddForeignKey("user_id", "users(id)", "CASCADE", "RESTRICT")

		// Run tests
		errCode = m.Run()
	}
	// Clean up db
	testDb.DropTable(&models.Vote{}, &models.User{}, &models.Choice{}, &models.Poll{})
	testDb.Close()
	os.Exit(errCode)
}

func TestSchema(t *testing.T) {

	// Test poll creation
	res := testDb.Create(&models.Poll{Id: "100", Body: "Is this correct?", StartTime: time.Now(), EndTime: time.Now()})
	if res.Error != nil {
		t.Errorf(fmt.Sprintf("Failed to create poll: %+v", res.Error))
		return
	}

	// Test choice creation under poll
	res = testDb.Create(&models.Choice{Id: "123", Body: "Yes", PollId: "100"})
	if res.Error != nil {
		t.Errorf(fmt.Sprintf("Failed to create choice: %+v", res.Error))
		return
	}

	res = testDb.Create(&models.Choice{Id: "124", Body: "No", PollId: "100"})
	if res.Error != nil {
		t.Errorf(fmt.Sprintf("Failed to create choice: %+v", res.Error))
		return
	}

	// Test invalid choice creation
	res = testDb.Create(&models.Choice{Id: "123", Body: "Yes"})
	if res.Error == nil {
		t.Errorf("Poll constraint for choice failed")
		return
	}
	res = testDb.Create(&models.Choice{Id: "123", Body: "Yes", PollId: "105"})
	if res.Error == nil {
		t.Errorf("Poll constraint for choice failed")
		return
	}

	// Test user creation
	res = testDb.Create(&models.User{Id: "123", MoneyTotal: 100})
	if res.Error != nil {
		t.Errorf(fmt.Sprintf("Failed to create user: %+v", res.Error))
		return
	}

	// Test invalid decision making
	res = testDb.Create(&models.Vote{PollId: "100"})
	if res.Error == nil {
		t.Errorf("Constraint for decision failed")
		return
	}
	res = testDb.Create(&models.Vote{ChoiceId: "123"})
	if res.Error == nil {
		t.Errorf("Constraint for decision failed")
		return
	}
	res = testDb.Create(&models.Vote{UserId: "123"})
	if res.Error == nil {
		t.Errorf("Constraint for decision failed")
		return
	}
	res = testDb.Create(&models.Vote{PollId: "100", ChoiceId: "123"})
	if res.Error == nil {
		t.Errorf("Constraint for decision failed")
		return
	}
	res = testDb.Create(&models.Vote{PollId: "100", ChoiceId: "123"})
	if res.Error == nil {
		t.Errorf("Constraint for decision failed")
		return
	}
	res = testDb.Create(&models.Vote{PollId: "101", ChoiceId: "113", UserId: "103"})
	if res.Error == nil {
		t.Errorf("Constraint for decision failed")
		return
	}

	// Test valid & duplicate decision
	res = testDb.Create(&models.Vote{PollId: "100", ChoiceId: "123", UserId: "123"})
	if res.Error != nil {
		t.Errorf(fmt.Sprintf("Error creating decision: %+v", res.Error))
		return
	}
	res = testDb.Create(&models.Vote{PollId: "100", ChoiceId: "123", UserId: "123"})
	if res.Error == nil {
		t.Errorf("Did not detect duplicate decision")
		return
	}
	res = testDb.Create(&models.Vote{PollId: "100", ChoiceId: "124", UserId: "123"})
	if res.Error == nil {
		t.Errorf("Did not detect change of decision")
		return
	}
}
