package resolvers

import (
	"context"
	"time"
	"zerosum/models"
	"zerosum/repository"
)

type Resolver struct{}

func getIdFromCtx(ctx context.Context) (id string) {
	// TODO: Implement this
	return
}

type gameSearchQuery struct {
	Filter string
	Limit  *int
	After  *int
}

type voteQuery struct {
	GameId string
}

type userVoteQuery struct {
	Limit *int
	After *int
}

type userInput struct {
}

type optionInput struct {
	Body string
}

type gameInput struct {
	Topic      string
	Duration   int
	GameMode   models.GameMode
	Stakes models.Stakes
	Options    []optionInput
}

type voteInput struct {
	GameId   string
	OptionId string
	Amount   int
}

func (r *Resolver) GetUser(ctx context.Context, args *struct{ id string }) (user models.User, err error) {
	// TODO: Add field restriction when id != id in ctx
	user, err = repository.QueryUser(models.User{Id: args.id})
	return
}

func (r *Resolver) GetGame(ctx context.Context, args *struct{ id string }) (game models.Game, err error) {
	game, err = repository.QueryGame(models.Game{Id: args.id})
	return
}

func (r *Resolver) GetGames(ctx context.Context, args gameSearchQuery) (game []models.Game, err error) {
	game, err = repository.SearchGames(args.Filter, args.Limit, args.After)
	return
}

func (r *Resolver) GetVote(ctx context.Context, args voteQuery) (vote models.Vote, err error) {
	vote, err = repository.QueryVote(models.Vote{GameId: args.GameId, UserId: getIdFromCtx(ctx)})
	return
}

func (r *Resolver) GetVotes(ctx context.Context, args userVoteQuery) (votes []models.Vote, err error) {
	votes, err = repository.QueryVotes(models.Vote{UserId: getIdFromCtx(ctx)}, args.Limit, args.After)
	return
}

func (r *Resolver) AddUser(ctx context.Context, args *struct{ user userInput }) (user models.User, err error) {
	// TODO: Cfm new user flow
	return
}

func (r *Resolver) UpdateUser(ctx context.Context, args *struct{ user userInput }) (user models.User, err error) {
	// TODO: Set User Deets
	return
}

func (r *Resolver) DeleteUser(ctx context.Context, args *struct{ id string }) (success bool) {
	err := repository.DeleteUser(models.User{Id: args.id})
	if err != nil {
		success = false
	} else {
		success = true
	}
	return
}

func (r *Resolver) AddGame(ctx context.Context, args *struct{ game gameInput }) (game models.Game, err error) {
	var options []models.Option

	for _, option := range args.game.Options {
		options = append(options, models.Option{Body: option.Body})
	}

	newGame := models.Game{
		Topic: args.game.Topic,
		UserId: getIdFromCtx(ctx),
		StartTime: time.Now(),
		EndTime: time.Now().Add(time.Minute * time.Duration(args.game.Duration)),
		Stakes: args.game.Stakes,
		Options: options,

	}
	err = repository.CreateGame(newGame)
	if err == nil {
		game, err = repository.QueryGame(newGame)
	}
	return
}

func (r *Resolver) AddVote(ctx context.Context, args *struct{ vote voteInput }) (vote models.Vote	, err error) {
	// TODO: Add validation for money left and correct choice id
	newVote := models.Vote{
		GameId: args.vote.GameId,
		UserId: getIdFromCtx(ctx),
		OptionId: args.vote.OptionId,
		Money: args.vote.Amount,
	}

	err = repository.CreateVote(newVote)
	if err == nil {
		vote, err = repository.QueryVote(newVote)
	}
	return
}
