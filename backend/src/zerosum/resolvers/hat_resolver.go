package resolvers

import (
	"context"
	"github.com/graph-gophers/graphql-go"
	"zerosum/models"
)

type HatResolver struct {
	hat      *models.Hat
	owned    bool
	achieved bool
}

func (h *HatResolver) ID(ctx context.Context) graphql.ID {
	return graphql.ID(h.hat.Id)
}

func (h *HatResolver) NAME(ctx context.Context) string {
	return h.hat.Name
}

func (h *HatResolver) PRICE(ctx context.Context) int32 {
	return h.hat.Price
}

func (h *HatResolver) IMG(ctx context.Context) string {
	if h.achieved || h.owned {
		return h.hat.ImgLink
	} else {
		return h.hat.StoreLink
	}
}
