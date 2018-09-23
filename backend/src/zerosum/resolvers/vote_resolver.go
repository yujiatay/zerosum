package resolvers

import (
	"context"
	"zerosum/models"
)

type VoteResolver struct {
	//TODO: implement Vote rresolver
	vote *models.Vote
}

func (v *VoteResolver) GAME(ctx context.Context) (gameResolver *GameResolver) {
	return nil
}

func (v *VoteResolver) OPTION(ctx context.Context) (gameResolver *OptionResolver) {
	return nil
}

func (v *VoteResolver) MONEY(ctx context.Context) *int32 {
	return nil
}

func (v *VoteResolver) RESULT(ctx context.Context) (voteResultResolver *VoteResultResolver) {
	return nil
}