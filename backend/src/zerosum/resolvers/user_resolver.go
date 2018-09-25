package resolvers

import (
	"context"
	"github.com/graph-gophers/graphql-go"
	"zerosum/logic"
	"zerosum/models"
)
type UserResolver struct {
	user *models.User
}

func (u *UserResolver) ID(ctx context.Context) graphql.ID {
	return graphql.ID(u.user.Id)
}

func (u *UserResolver) NAME(ctx context.Context) *string {
	return &u.user.Name
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

func (u *UserResolver) GAMESCREATED(ctx context.Context) *[]*GameResolver {
	// TODO: search games created
	return nil
}

func (u *UserResolver) GAMESPARTICIPATED(ctx context.Context) *[]*GameResolver {
	// TODO: search games participated
	return nil
}

// Other deets
	