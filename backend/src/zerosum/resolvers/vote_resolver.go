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

func (v *VoteResolver) RESOLVED(ctx context.Context) *bool {
	return &v.vote.Resolved
}

func (v *VoteResolver) RESULT(ctx context.Context) *VoteResultResolver {
	if v.vote.Resolved == false {
		return nil
	} else {
		return &VoteResultResolver{	v.vote.Win, v.vote.Change}
	}

}