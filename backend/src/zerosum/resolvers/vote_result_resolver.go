package resolvers

import (
	"context"
)

type VoteResultResolver struct {
	win bool
	change int
}

func (v *VoteResultResolver) WIN(ctx context.Context) *bool {
	return nil
}

func (v *VoteResultResolver) NETCHANGE(ctx context.Context) *int32 {
	return nil
}
