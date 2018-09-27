package resolvers

import (
	"context"
	"github.com/graph-gophers/graphql-go"
	"zerosum/logic"
	"zerosum/models"
	"zerosum/repository"
)

type UserResolver struct {
	user *models.User
	ranking *int32
}

func (u *UserResolver) ID(ctx context.Context) graphql.ID {
	return graphql.ID(u.user.Id)
}

func (u *UserResolver) NAME(ctx context.Context) *string {
	return &u.user.Name
}

func (u *UserResolver) IMG(ctx context.Context) *string {
	return &u.user.Picture
}

func (u *UserResolver) MONEY(ctx context.Context) *int32 {
	money := int32(u.user.MoneyTotal)
	return &money
}

func (u *UserResolver) WINRATE(ctx context.Context) *float64 {
	winRate := float64(u.user.WinRate)
	return &winRate
}

func (u *UserResolver) LEVEL(ctx context.Context) *int32 {
	level, _, _ := logic.GetLevelInfo(u.user.Experience)
	retLevel := int32(level)
	return &retLevel
}

func (u *UserResolver) EXPPROGRESS(ctx context.Context) *float64 {
	_, progress, milestone := logic.GetLevelInfo(u.user.Experience)
	retProgress := float64(progress) / float64(milestone)
	return &retProgress
}

func (u *UserResolver) RANKING(ctx context.Context) *int32 {
	// If ranking already calculated (from leaderboard)
	if u.ranking != nil {
		return u.ranking
	}

	// If fail requirement, return nil
	if u.user.GamesPlayed <= int32(logic.LEADERBOARD_MIN_GAMES) {
		return nil
	}

	// Find user from rank list
	users, err := repository.QueryRankedUsers(logic.LEADERBOARD_MIN_GAMES)
	if err != nil {
		return nil
	}
	desiredUserId := getIdFromCtx(ctx)
	for i, user := range users {
		if desiredUserId == user.Id {
			ranking := int32(i) + 1
			return &ranking
		}
	}
	return nil
}