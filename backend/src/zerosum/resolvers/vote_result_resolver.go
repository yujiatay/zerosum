package resolvers

import (
	"context"
)

type VoteResultResolver struct {
	win bool
	change int32
}

func (v *VoteResultResolver) WIN(ctx context.Context) *bool {
	return &v.win
}

func (v *VoteResultResolver) NETCHANGE(ctx context.Context) *int32 {
	return &v.change
}
