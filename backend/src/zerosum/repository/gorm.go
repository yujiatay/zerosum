package repository

import (
	"errors"
	"fmt"
	"github.com/SherClockHolmes/webpush-go"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"time"
	"zerosum/models"
)

// Global singleton instance
var db *gorm.DB

/* DATABASE CONFIG*/
func InitTestDB() (err error) {
	db, err = gorm.Open("postgres", fmt.Sprintf(
		"user=%s password=%s dbname=%s host=%s port=%d sslmode=disable",
		"postgres", "password", "zerosum", "localhost", 5432))

	// Set up database tables
	db.AutoMigrate(&models.Game{}, &models.Option{}, &models.User{}, &models.Hat{}, &models.Vote{}, &models.HatOwnership{})

	// Add foreign key constraints
	db.Model(models.Game{}).AddForeignKey("user_id", "users(id)", "CASCADE", "RESTRICT")
	db.Model(models.Option{}).AddForeignKey("game_id", "games(id)", "CASCADE", "RESTRICT")
	db.Model(models.Vote{}).AddForeignKey("option_id", "options(id)", "CASCADE", "RESTRICT")
	db.Model(models.Vote{}).AddForeignKey("user_id", "users(id)", "CASCADE", "RESTRICT")
	db.Model(models.Vote{}).AddForeignKey("game_id", "games(id)", "CASCADE", "RESTRICT")
	db.Model(models.HatOwnership{}).AddForeignKey("user_id", "users(id)", "CASCADE", "RESTRICT")
	db.Model(models.HatOwnership{}).AddForeignKey("hat_id", "hats(id)", "CASCADE", "RESTRICT")
	return
}

func CloseTestDB() {
	db.Close()
}

/* POLL CRUD */
func CreateGame(game models.Game) (createdGame models.Game, err error) {
	// Check if alr exists
	if !db.NewRecord(game) {
		err = errors.New("game exists")
		return
	}

	res := db.Create(&game)
	if res.Error != nil {
		err = res.Error
	}
	createdGame = game
	return
}

func QueryGame(desiredGame models.Game) (game models.Game, err error) {
	res := db.Where(desiredGame).First(&game)
	if res.RecordNotFound() {
		err = errors.New("no game found")
	} else if res.Error != nil {
		err = res.Error
	}

	return
}

func SearchActiveGames(searchString string, joined *bool, created *bool, userId string, limit *int32) (games []models.Game, err error) {

	if joined == nil && created == nil {
		err = errors.New("created and joined are both not specified")
	}

	// Get games that fit the search query
	interm := db.Order("end_time asc").Where("topic LIKE ? AND end_time > ?", fmt.Sprintf("%%%s%%", searchString), time.Now())
	var candidateActiveGames []models.Game

	// Get games according to created flag, or all valid games if nil
	if created != nil {
		switch *created {
		case true:
			res := interm.Where("user_id = ?", userId).Find(&candidateActiveGames)
			if res.Error != nil {
				err = res.Error
			}
		case false:
			res := interm.Where("user_id <> ?", userId).Find(&candidateActiveGames)
			if res.Error != nil {
				err = res.Error
			}
		}
	} else {
		res := interm.Find(&candidateActiveGames)
		if res.Error != nil {
			err = res.Error
		}
	}

	if err != nil {
		return
	}


	// Filter to limit and joined
	var activeGames []models.Game

	gamesLeft := int32(-1)
	if limit != nil {
		gamesLeft = *limit
	}

	for _, game := range candidateActiveGames {
		if gamesLeft == 0 {
			break
		}
		//  Filter by joined if needed, else just add till limit
		if joined != nil {
			_, internalErr, recordNotFound := QueryVote(models.Vote{UserId: userId, GameId: game.Id})
			if internalErr != nil && !recordNotFound {
				err = internalErr
				return
			}
			if !recordNotFound && *joined {
				activeGames = append(activeGames, game)
				gamesLeft -= 1
			} else if recordNotFound && !*joined {
				activeGames = append(activeGames, game)
				gamesLeft -= 1
			}
		} else {
			activeGames = append(activeGames, game)
			gamesLeft -= 1
		}
	}
	games = activeGames
	return
}

func GetCompletedGames(userId string, created bool) (games []models.Game, err error) {

	interm := db.Order("end_time asc")
	// Get games that are completed and fit the created requirement
	if created {
		interm = interm.Where("user_id = ? AND validated = ? AND resolved = ?", userId, false, true)
	} else {
		interm = interm.Where("user_id <> ? AND resolved = ?", userId, true)
	}
	var candidateCompletedGames []models.Game
	res := interm.Find(&candidateCompletedGames)
	if res.Error != nil {
		err = res.Error
	}

	// If games were not created by user, ensure that they are joined by user and not validated
	if created {
		games = candidateCompletedGames
		return
	} else {
		var validGames []models.Game
		for _, game := range candidateCompletedGames {
			vote, internalErr, recordNotFound := QueryVote(models.Vote{UserId: userId, GameId: game.Id})
			if internalErr != nil && !recordNotFound {
				err = internalErr
				return
			}
			// Result not validated by user yet
			if !recordNotFound && !vote.Validated {
				validGames = append(validGames, game)
			}
		}
		games = validGames
		return
	}
}

func CountGames() (total int32) {
	db.Model(&models.Game{}).Where("end_time > ?", time.Now()).Count(&total)
	return
}

func UpdateGame(game models.Game) (err error) {
	// Check if exists
	if db.NewRecord(game) {
		err = errors.New("game does not exist")
		return
	}
	res := db.Model(&models.Game{}).Updates(game)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func DeleteGame(game models.Game) (err error) {
	// Check if exists
	if db.NewRecord(game) {
		err = errors.New("game does not exist")
		return
	}
	res := db.Delete(&game)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func QueryGameOptions(desiredGame models.Game) (options []models.Option, err error) {
	err = db.Model(&desiredGame).Association("Options").Find(&options).Error
	return
}

func QueryOption(desiredOption models.Option) (option models.Option, err error) {
	res := db.Where(desiredOption).First(&option)
	if res.RecordNotFound() {
		err = errors.New("no option found")
	} else if res.Error != nil {
		err = res.Error
	}

	return
}

func UpdateOption(option models.Option) (err error) {
	// Check if exists
	if db.NewRecord(option) {
		err = errors.New("option does not exist")
		return
	}
	res := db.Model(&models.Option{}).Updates(option)
	if res.Error != nil {
		err = res.Error
	}

	return
}

/* USER CRUD */
func GetOrCreateUser(desiredUser models.User) (user models.User, err error) {
	// Check if alr exists
	err = db.Where("fb_id = ?", desiredUser.FbId).Attrs(models.User{
		FbId:             desiredUser.FbId,
		MoneyTotal:       int32(2000),
		WinRate:          0,
		GamesPlayed:      0,
		GamesWon:         0,
		Experience:       0,
		Name:             "HatMatter",
		PushSubscription: webpush.Subscription{Endpoint: "nil"},
	}).FirstOrCreate(&user).Error
	return
}

func QueryUser(desiredUser models.User) (user models.User, err error) {
	res := db.Where(desiredUser).First(&user)
	if res.RecordNotFound() {
		err = errors.New("no user found")
	} else if res.Error != nil {
		err = res.Error
	}

	return
}

func QueryAllUsers() (users []models.User) {
	db.Find(&users)
	return
}

func QueryTopUsers(limit int, minGames int) (users []models.User, err error) {
	err = db.Where("games_played > ?", minGames).Order("win_rate desc").Limit(limit).Find(&users).Error
	return
}

func QueryRankedUsers(minGames int) (users []models.User, err error) {
	err = db.Where("games_played > ?", minGames).Order("win_rate desc").Find(&users).Error
	return
}

func UpdateUser(user models.User) (err error) {
	// Check if exists
	if db.NewRecord(user) {
		err = errors.New("user does not exist")
		return
	}
	res := db.Model(&models.User{}).Updates(user)
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
	res := db.Delete(&user)
	if res.Error != nil {
		err = res.Error
	}

	return
}

/* VOTE CRUD */
func CreateVote(vote models.Vote) (err error) {
	// Check if alr exists
	var foundVote models.Vote
	if !db.Where("user_id = ? AND game_id = ?", vote.UserId, vote.GameId).First(&foundVote).RecordNotFound() {
		err = errors.New("vote exists")
		return
	}
	res := db.Create(&vote)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func QueryVote(desiredVote models.Vote) (vote models.Vote, err error, recordNotFound bool) {
	res := db.Where(desiredVote).First(&vote)
	if res.RecordNotFound() {
		err = errors.New("no vote found")
		recordNotFound = true
	} else if res.Error != nil {
		err = res.Error
	}

	return
}

func QueryVotes(desiredVote models.Vote, limit *int32, after *int32) (votes []models.Vote, err error) {

	offset := *after
	if after == nil {
		offset = 0
	}

	interm := db.Offset(offset)
	if limit != nil {
		interm = interm.Limit(limit)
	}

	res := interm.Where(desiredVote).Find(&votes)
	if res.Error != nil {
		err = res.Error
	}
	return
}

func QueryAllGameVotes(desiredGame models.Game) (votes []models.Vote, err error) {
	err = db.Where("game_id = ?", desiredGame.Id).Find(&votes).Error
	return
}

func QueryOptionVotes(desiredOption models.Option) (votes []models.Vote, err error) {
	err = db.Where("option_id = ?", desiredOption.Id).Find(&votes).Error
	return
}

func UpdateVote(vote models.Vote) (err error) {
	// Check if exists
	if db.NewRecord(vote) {
		err = errors.New("vote does not exist")
		return
	}
	res := db.Model(&models.Vote{}).Updates(vote)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func DeleteVote(vote models.Vote) (err error) {
	// Check if exists
	if db.NewRecord(vote) {
		err = errors.New("vote does not exist")
		return
	}
	res := db.Delete(&vote)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func CheckVoted(userId string, gameId string) bool {
	var vote models.Vote
	return !db.Where("user_id = ? AND game_id = ?", userId, gameId).First(&vote).RecordNotFound()
}

/* HAT_CRUD */

func TryCreateHat(hat models.Hat) (exists bool, err error) {
	// Check if alr exists
	var foundHat models.Hat
	if !db.Where("id = ?", hat.Id).First(&foundHat).RecordNotFound() {
		exists = true
		return
	}

	res := db.Create(&hat)
	if res.Error != nil {
		err = res.Error
	}
	return
}

func QueryHat(desiredHat models.Hat) (hat models.Hat, err error) {
	res := db.Where(desiredHat).First(&hat)
	if res.RecordNotFound() {
		err = errors.New("no hat found")
	} else if res.Error != nil {
		err = res.Error
	}

	return
}

/* HAT_OWNERSHIP CRUD */
func TryCreateHatOwnership(hatOwnership models.HatOwnership) (exists bool, err error) {
	// Check if alr exists
	var foundOwnership models.HatOwnership
	if !db.Where("hat_id = ? AND user_id = ?", hatOwnership.HatId, hatOwnership.UserId).First(&foundOwnership).RecordNotFound() {
		exists = true
		return
	}
	res := db.Create(&hatOwnership)
	if res.Error != nil {
		err = res.Error
	}

	return
}

func QueryHatOwnership(desiredHatOwnership models.HatOwnership) (hatOwnership models.HatOwnership, err error) {
	res := db.Where(desiredHatOwnership).First(&hatOwnership)
	if res.RecordNotFound() {
		err = errors.New("no ownership found")
	} else if res.Error != nil {
		err = res.Error
	}

	return
}

func QueryUserHats(userId string, owned bool, achievement bool) (hats []models.Hat, err error) {
	var validHatOwnerships []models.HatOwnership
	err = db.Where("user_id = ? AND owned = ?", userId, owned).Find(&validHatOwnerships).Error
	if err != nil {
		return
	}

	for _, hatOwnership := range validHatOwnerships {
		desiredHat, internalErr := QueryHat(models.Hat{Id: hatOwnership.HatId})
		if internalErr != nil {
			err = internalErr
			return
		}
		if desiredHat.Achievement == achievement {
			hats = append(hats, desiredHat)
		}
	}
	return
}

func UpdateHatOwnership(hatOwnership models.HatOwnership) (err error) {
	// Check if exists
	var foundOwnership models.HatOwnership
	if db.Where("hat_id = ? AND user_id = ?", hatOwnership.HatId, hatOwnership.UserId).First(&foundOwnership).RecordNotFound() {
		err = errors.New("no ownership found")
		return
	}
	res := db.Model(&models.HatOwnership{}).Updates(hatOwnership)
	if res.Error != nil {
		err = res.Error
	}

	return
}
