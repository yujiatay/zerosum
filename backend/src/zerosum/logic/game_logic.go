package logic

import (
	"errors"
	"zerosum/models"
	"zerosum/push"
	"zerosum/repository"
)

var EXP_REQUIRED = []int{10, 15, 25, 50, 100, 200, 350, 600, 1000}

const (
	HOST_EXP = 10
	VOTE_EXP = 5
	WIN_EXP  = 10
)

type optionResult struct {
	Id         string
	Winner     bool
	TotalValue int32
	TotalVotes int32
}

/**
	DB UPDATES
 */
func allocateExp(userId string, exp int) (err error) {
	user, err := repository.QueryUser(models.User{Id: userId})
	if err == nil {
		user.Experience += exp
		err = repository.UpdateUser(user)
	}
	return
}

func allocateWinOrLoss(userId string, win bool) (err error) {
	user, err := repository.QueryUser(models.User{Id: userId})
	if err == nil {
		user.GamesPlayed += 1
		if win {
			user.GamesWon += 1
		}
		user.WinRate = float64(user.GamesWon) / float64(user.GamesPlayed)
		err = repository.UpdateUser(user)
	}
	return
}

func updateVoteResult(userId string, gameId string, win bool, change int32) (err error) {
	vote, err := repository.QueryVote(models.Vote{GameId: gameId, UserId: userId})
	if err == nil {
		vote.Resolved = true
		vote.Win = win
		vote.Change = change
		err = repository.UpdateVote(vote)
	}
	return
}

func updateGameResult(gameId string, optionResults []optionResult) (err error) {
	game, err := repository.QueryGame(models.Game{Id: gameId})

	for _, optionRes := range optionResults {
		option, internal_err := repository.QueryOption(models.Option{Id: optionRes.Id})
		if internal_err != nil {
			err = internal_err
			return
		}
		option.Resolved = true
		option.Winner = optionRes.Winner
		option.TotalValue = optionRes.TotalValue
		option.TotalVotes = optionRes.TotalVotes
		err = repository.UpdateOption(option)
	}

	if err == nil {
		game.Resolved = true
		err = repository.UpdateGame(game)
	}
	return
}

func AllocateMoney(userId string, money int32) (err error) {
	user, err := repository.QueryUser(models.User{Id: userId})
	if err == nil {
		user.MoneyTotal += money
		if user.MoneyTotal < 0 {
			err = errors.New("not enough money")
		}
		err = repository.UpdateUser(user)
	}
	return
}

func GetLevelInfo(exp int) (level int, progressToNext int, nextMilestone int) {
	level = 1
	for _, expRequired := range EXP_REQUIRED {
		if exp >= expRequired {
			exp = exp - expRequired
			level += 1
		} else {
			progressToNext = exp
			nextMilestone = expRequired
			break
		}
	}
	return
}

func getLevel(exp int) (level int) {
	level = 1
	for _, expRequired := range EXP_REQUIRED {
		if exp >= expRequired {
			exp = exp - expRequired
			level += 1
		} else {
			break
		}
	}
	return
}

func AllocateHostExp(userId string) (err error) {
	return allocateExp(userId, HOST_EXP)
}

func AllocateVoteExp(userId string) (err error) {
	return allocateExp(userId, VOTE_EXP)
}

func AllocateWinExp(userId string) (err error) {
	return allocateExp(userId, WIN_EXP)
}

func ResolveGame(gameId string) (err error) {

	// Get list of options for game
	options, err := repository.QueryGameOptions(models.Game{Id: gameId})
	optionTotal := make([]int32, len(options))
	optionCount := make([]int32, len(options))
	votes := make([][]models.Vote, len(options))

	// Calculate total amount for each option in game
	for i, option := range options {
		votes[i], err = repository.QueryOptionVotes(option)
		if err != nil {
			return
		}
		for _, vote := range votes[i] {
			optionTotal[i] += vote.Money
			optionCount[i] += 1
		}
	}

	// Get game mode
	game, err := repository.QueryGame(models.Game{Id: gameId})
	if err != nil {
		return
	}

	// Check winning option
	var winningOptions []int
	var losingOptions []int
	if game.GameMode == models.MAJORITY {
		winningOptions, losingOptions = resolveMajority(optionTotal)
	} else if game.GameMode == models.MINORITY {
		winningOptions, losingOptions = resolveMinority(optionTotal)
	}

	// Update Game Result
	optionResults := make([]optionResult, len(options))
	for _, index := range winningOptions {
		optionResults[index].Id = options[index].Id
		optionResults[index].Winner = true
		optionResults[index].TotalValue = optionTotal[index]
		optionResults[index].TotalVotes = optionCount[index]
	}
	for _, index := range losingOptions {
		optionResults[index].Id = options[index].Id
		optionResults[index].Winner = false
		optionResults[index].TotalValue = optionTotal[index]
		optionResults[index].TotalVotes = optionCount[index]
	}

	err = updateGameResult(gameId, optionResults)
	if err != nil {
		return
	}

	// If all winners or losers, no change
	if len(winningOptions) == 0 || len(losingOptions) == 0 {
		return
	}

	// Allocate money and exp, update vote results
	winPool := int32(0)
	losePool := int32(0)
	for _, index := range winningOptions {
		winPool += optionTotal[index]
	}
	for _, index := range losingOptions {
		losePool += optionTotal[index]
	}

	// TODO: Make this one big transaction to prevent corruption, for fun: move rounding error money to dev
	for _, index := range winningOptions {
		for _, vote := range votes[index] {
			moneyGained := vote.Money + (vote.Money/winPool)*losePool
			// Update Vote Result
			updateVoteResult(vote.UserId, vote.GameId, true, moneyGained)
			// Allocate money and exp, stats
			AllocateMoney(vote.UserId, moneyGained)
			AllocateWinExp(vote.UserId)
			allocateWinOrLoss(vote.UserId, true)
			// Verify Achievements
			verifyAchievements(vote.UserId)
			push.SendNotif("You have won!!!", vote.UserId)
		}
	}
	for _, index := range losingOptions {
		for _, vote := range votes[index] {
			_ = vote.Money
			// Update Vote Result
			updateVoteResult(vote.UserId, vote.GameId, false, -vote.Money)
			// Allocate stats
			allocateWinOrLoss(vote.UserId, false)
			// Verify Achievements
			verifyAchievements(vote.UserId)
			push.SendNotif("A game you participated in has ended!", vote.UserId)
		}
	}



	return
}

func resolveMajority(values []int32) (winners []int, losers []int) {
	max := values[0]
	for i, value := range values {
		if value > max {
			losers = append(losers, winners...)
			winners = []int{i}
			max = value
		} else if value == max {
			winners = append(winners, i)
		} else {
			losers = append(losers, i)
		}
	}
	return
}

func resolveMinority(values []int32) (winners []int, losers []int) {
	min := values[0]
	for i, value := range values {
		if value < min {
			losers = append(losers, winners...)
			winners = []int{i}
			min = value
		} else if value == min {
			winners = append(winners, i)
		} else {
			losers = append(losers, i)
		}
	}
	return
}
