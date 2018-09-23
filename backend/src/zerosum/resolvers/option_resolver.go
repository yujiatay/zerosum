package resolvers

import (
	"context"
	"github.com/graph-gophers/graphql-go"
	"zerosum/models"
)

type OptionResolver struct {
	option *models.Option
}

func (o *OptionResolver) ID(ctx context.Context) graphql.ID {
	return graphql.ID(o.option.Id)
}

func (o * OptionResolver) BODY(ctx context.Context) *string {
	return &o.option.Body
}
