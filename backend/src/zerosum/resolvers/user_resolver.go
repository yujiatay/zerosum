package resolvers

import (
	"context"
	"zerosum/models"
)
type UserResolver struct {
	user *models.User
}

func (u *UserResolver) ID(ctx context.Context) string {
	return u.user.Id
}

func (u *UserResolver) MONEY(ctx context.Context) int {
	return u.user.MoneyTotal
}

func (u *UserResolver) GAMESCREATED(ctx context.Context) *[]*GameResolver {
	// TODO: search games created
	return
}

func (u *UserResolver) GAMESPARTICIPATED(ctx context.Context) *[]*GameResolver {
	// TODO: search games participated
	return
}

// Other deets
	