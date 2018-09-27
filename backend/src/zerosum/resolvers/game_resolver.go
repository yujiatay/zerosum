package resolvers

import (
	"context"
	"github.com/graph-gophers/graphql-go"
	"zerosum/auth"
	"zerosum/models"
	"zerosum/repository"
)

type GameResolver struct {
	game *models.Game
}

func (g *GameResolver) ID(ctx context.Context) graphql.ID {
	return graphql.ID(g.game.Id)
}

func (g *GameResolver) OWNER(ctx context.Context) (userResolver *UserResolver) {

	user, err := repository.QueryUser(models.User{
		Id: g.game.UserId,
	})

	if err == nil {
		userResolver = &UserResolver{&user}
	}
	return
}

func (g *GameResolver) TOPIC(ctx context.Context) *string {
	return &g.game.Topic
}

func (g *GameResolver) STARTTIME(ctx context.Context) *graphql.Time {
	return &graphql.Time{Time: g.game.StartTime}
}

func (g *GameResolver) ENDTIME(ctx context.Context) *graphql.Time {
	return &graphql.Time{Time: g.game.EndTime}
}

func (g *GameResolver) TOTALMONEY(ctx context.Context) *int32 {
	votes, err := repository.QueryAllGameVotes(*g.game)
	sum := int32(0)
	if err == nil {
		for _, vote := range votes {
			sum += vote.Money
		}
	}
	return &sum
}

func (g *GameResolver) GAMEMODE(ctx context.Context) *models.GameMode{
	return &g.game.GameMode
}

func (g *GameResolver) STAKES(ctx context.Context) *models.Stakes{
	return &g.game.Stakes
}

func (g *GameResolver) OPTIONS(ctx context.Context) *[]*OptionResolver{
	options, err := repository.QueryGameOptions(*g.game)
	if err == nil {
		var optionResolvers []*OptionResolver
		for index := range options {
			optionResolvers = append(optionResolvers, &OptionResolver{option: &options[index]})
		}
		return &optionResolvers
	}
	return nil
}

//func (g *GameResolver) PARTICIPANTS(ctx context.Context) *[]*UserResolver{
//
//	return nil
//}

func (g *GameResolver) VOTED(ctx context.Context) *bool {
	voted := repository.CheckVoted(auth.GetIdFromCtx(ctx), g.game.Id)
	return &voted
}

func (g *GameResolver) RESOLVED(ctx context.Context) *bool {
	return &g.game.Resolved
}