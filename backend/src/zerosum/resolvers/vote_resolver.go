package resolvers

import (
	"context"
	"zerosum/models"
	"zerosum/repository"
)

type VoteResolver struct {
	vote *models.Vote
}

func (v *VoteResolver) GAME(ctx context.Context) (gameResolver *GameResolver) {
	game, err := repository.QueryGame(models.Game{
		Id: v.vote.GameId,
	})

	if err == nil {
		gameResolver = &GameResolver{&game}
	}
	return
}

func (v *VoteResolver) OPTION(ctx context.Context) (optionResolver *OptionResolver) {
	option, err := repository.QueryOption(models.Option{
		Id: v.vote.OptionId,
	})

	if err == nil {
		optionResolver = &OptionResolver{&option}
	}
	return
}

func (v *VoteResolver) MONEY(ctx context.Context) *int32 {
	return &v.vote.Money
}

func (v *VoteResolver) RESULT(ctx context.Context) (voteResultResolver *VoteResultResolver) {
	// TODO: implement result
	return nil
}