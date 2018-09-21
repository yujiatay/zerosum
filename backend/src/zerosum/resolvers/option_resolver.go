package resolvers

import (
	"context"
	"zerosum/models"
)

type OptionResolver struct {
	option *models.Option
}

func (o *OptionResolver) ID(ctx context.Context) string {
	return o.option.Id
}

func (o * OptionResolver) BODY(ctx context.Context) *string {
	return &o.option.Body
}
