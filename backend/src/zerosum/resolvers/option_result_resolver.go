package resolvers

import (
	"context"
	"zerosum/models"
)

type OptionResultResolver struct {
	votes []models.Vote
	option models.Option
	winner bool
}

func (o *OptionResultResolver) OPTION(ctx context.Context) *OptionResolver {
	return &OptionResolver{option: &o.option}
}

func (o *OptionResultResolver) VOTECOUNT(ctx context.Context) *int32 {
	numVotes := int32(len(o.votes))
	return &numVotes
}

func (o *OptionResultResolver) TOTALVALUE(ctx context.Context) *int32 {
	sum := int32(0)
	for _, vote := range o.votes {
		sum += int32(vote.Money)
	}
	return &sum
}

func (o *OptionResultResolver) WINNER(ctx context.Context) *bool {
	return &o.winner
}