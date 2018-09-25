package logic

import (
	"errors"
	"zerosum/models"
	"zerosum/repository"
)

var EXP_REQUIRED = []int{10, 15, 25, 50, 100, 200, 350, 600, 1000}
const (
	HOST_EXP = 10
	VOTE_EXP = 5
	WIN_EXP = 10
)

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
	votes := make([][]models.Vote, len(options))

	// Calculate total amount for each option in game
	for i, option := range options {
		votes[i], err = repository.QueryOptionVotes(option)
		if err != nil {
			return
		}
		for _, vote := range votes[i] {
			optionTotal[i] += vote.Money
		}
	}

	// Get game mode
	game, err := repository.QueryGame(models.Game{Id: gameId})
	if err != nil {
		return
	}

	// Check winning option
	var winners []int
	var losers []int
	if game.GameMode == models.MAJORITY {
		winners, losers = resolveMajority(optionTotal)
	} else if game.GameMode == models.MINORITY {
		winners, losers = resolveMinority(optionTotal)
	}

	// TODO: Update GameResult
	// If all winners or losers, no change
	if len(winners) == 0 || len(losers) == 0 {
		return
	}

	winPool := int32(0)
	losePool := int32(0)
	for _, index := range winners {
		winPool += optionTotal[index]
	}
	for _, index := range losers {
		losePool += optionTotal[index]
	}

	// TODO: Make this one big transaction to prevent corruption, for fun: move rounding error money to dev
	for _, index := range winners {
		for _, vote := range votes[index] {
			moneyGained := vote.Money + (vote.Money / winPool) * losePool
			// TODO: Update Vote Result
			AllocateMoney(vote.UserId, moneyGained)
		}
	}
	for _, index := range losers {
		for _, vote := range votes[index] {
			_ = vote.Money
			// TODO: Update Vote Result
		}
	}

	return
}

func resolveMajority(values []int32) (winners []int, losers[]int) {
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

func resolveMinority(values []int32) (winners []int, losers[]int) {
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