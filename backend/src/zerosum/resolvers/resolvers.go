package resolvers

import (
	"context"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"os"
	"time"
	"zerosum/auth"
	"zerosum/models"
	"zerosum/repository"
)

type Resolver struct{}

func getIdFromCtx(ctx context.Context) (id string) {
	if os.Getenv("DEBUG") == "TRUE" {
		return "testuser"
	}
	return auth.GetClaims(ctx.Value("user").(*jwt.Token)).Id
}

type gameSearchQuery struct {
	Filter string
	Limit  *int32
	After  *int32
}

type voteQuery struct {
	GameId string
}

type userVoteQuery struct {
	Limit *int32
	After *int32
}

type userInput struct {
	// TODO: Cfm user input fields
}

type gameInput struct {
	Topic      string
	Duration   int32
	GameMode   models.GameMode
	Stakes models.Stakes
	Options    []string
}

type voteInput struct {
	GameId   string
	OptionId string
	Amount   int32
}

func (r *Resolver) GetUser(ctx context.Context, args *struct{ Id string }) (userResolver *UserResolver, err error) {
	// TODO: Add field restriction when Id != Id in ctx
	user, err := repository.QueryUser(models.User{Id: args.Id})
	*userResolver = UserResolver{user: &user}
	return
}

func (r *Resolver) GetGame(ctx context.Context, args *struct{ Id string }) (gameResolver *GameResolver, err error) {
	game, err := repository.QueryGame(models.Game{Id: args.Id})
	*gameResolver = GameResolver{game: &game}
	return
}

func (r *Resolver) GetGames(ctx context.Context, args gameSearchQuery) (gameResolvers *[]*GameResolver, err error) {
	games, err := repository.SearchGames(args.Filter, args.Limit, args.After)
	for _, game := range games {
		*gameResolvers = append(*gameResolvers, &GameResolver{game: &game})
	}
	return
}

func (r *Resolver) GetVote(ctx context.Context, args voteQuery) (voteResolver *VoteResolver, err error) {
	_, err = repository.QueryVote(models.Vote{GameId: args.GameId, UserId: getIdFromCtx(ctx)})
	*voteResolver = VoteResolver{}
	return
}

func (r *Resolver) GetVotes(ctx context.Context, args userVoteQuery) (voteResolvers *[]*VoteResolver, err error) {
	votes, err := repository.QueryVotes(models.Vote{UserId: getIdFromCtx(ctx)}, args.Limit, args.After)
	for _, vote := range votes {
		*voteResolvers = append(*voteResolvers, &VoteResolver{vote: &vote})
	}
	return
}

func (r *Resolver) CreateUser(ctx context.Context, args *struct{ User userInput }) (userResolver *UserResolver, err error) {
	// TODO: Cfm new user flow
	return
}

func (r *Resolver) UpdateUser(ctx context.Context, args *struct{ User userInput }) (userResolver *UserResolver, err error) {
	// TODO: Set User Deets
	return
}

func (r *Resolver) DeleteUser(ctx context.Context) (success bool) {
	err := repository.DeleteUser(models.User{Id: getIdFromCtx(ctx)})
	if err != nil {
		success = false
	} else {
		success = true
	}
	return
}

func (r *Resolver) AddGame(ctx context.Context, args *struct{ Game gameInput }) (gameResolver *GameResolver, err error) {
	var options []models.Option

	for _, option := range args.Game.Options {
		options = append(options, models.Option{Body: option})
	}

	newGame := models.Game{
		Topic: args.Game.Topic,
		UserId: getIdFromCtx(ctx),
		StartTime: time.Now(),
		EndTime: time.Now().Add(time.Minute * time.Duration(args.Game.Duration)),
		Stakes: args.Game.Stakes,
		GameMode: args.Game.GameMode,
		Options: options,
	}
	err = repository.CreateGame(newGame)
	if err == nil {
		game, err := repository.QueryGame(newGame)
		if err == nil {
			*gameResolver = GameResolver{game: &game}
		}
	}
	return
}

func (r *Resolver) AddVote(ctx context.Context, args *struct{ Vote voteInput }) (voteResolver *VoteResolver, err error) {
	// TODO: Add validation for money left and correct choice Id
	newVote := models.Vote{
		GameId: args.Vote.GameId,
		UserId: getIdFromCtx(ctx),
		OptionId: args.Vote.OptionId,
		Money: args.Vote.Amount,
	}

	err = repository.CreateVote(newVote)
	if err == nil {
		vote, err := repository.QueryVote(newVote)
		if err == nil {
			*voteResolver = VoteResolver{vote: &vote}
		}
	}
	return
}
