package resolvers

import (
	"context"
)

type OptionResultResolver struct {
	voteCount int32
	totalValue int32
	winner bool
}

func (o *OptionResultResolver) VOTECOUNT(ctx context.Context) *int32 {
	return &o.voteCount
}

func (o *OptionResultResolver) TOTALVALUE(ctx context.Context) *int32 {
	return &o.totalValue
}

func (o *OptionResultResolver) WINNER(ctx context.Context) *bool {
	return &o.winner
}