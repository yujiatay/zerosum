package resolvers

import (
	"context"
	"os"
	"time"
	"zerosum/logic"
	"zerosum/models"
	"zerosum/repository"
)

type Resolver struct{}

func getIdFromCtx(ctx context.Context) (id string) {
	if os.Getenv("DEBUG") == "TRUE" {
		return "testuser"
	}
	return ctx.Value("Id").(string)
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

//type userInput struct {
//
//}

type gameInput struct {
	Topic    string
	Duration int32
	GameMode models.GameMode
	Stakes   models.Stakes
	Options  []string
}

type voteInput struct {
	GameId   string
	OptionId string
	Amount   int32
}

func (r *Resolver) GetUser(ctx context.Context, args *struct{ Id string }) (*UserResolver, error) {
	// TODO: Add field restriction when Id != Id in ctx
	user, err := repository.QueryUser(models.User{Id: args.Id})
	return &UserResolver{user: &user}, err
}

func (r *Resolver) GetProfile(ctx context.Context) (*UserResolver, error) {
	user, err := repository.QueryUser(models.User{Id: getIdFromCtx(ctx)})
	return &UserResolver{user: &user}, err
}

func (r *Resolver) GetGame(ctx context.Context, args *struct{ Id string }) (*GameResolver, error) {
	game, err := repository.QueryGame(models.Game{Id: args.Id})
	return &GameResolver{game: &game}, err
}

func (r *Resolver) GetGames(ctx context.Context, args gameSearchQuery) (gameResolvers *[]*GameResolver, err error) {
	games, err := repository.SearchGames(args.Filter, args.Limit, args.After)
	var gamesList []*GameResolver
	for index := range games {
		gamesList = append(gamesList, &GameResolver{game: &games[index]})
	}
	gameResolvers = &gamesList
	return
}

func (r *Resolver) GetLeaderboard(ctx context.Context, args *struct{ Limit int32 }) (userResolvers *[]*UserResolver, err error) {
	users, err := repository.QueryTopUsers(10, 9)
	var userList []*UserResolver
	for index := range users {
		userList = append(userList, &UserResolver{user: &users[index]})
	}
	userResolvers = &userList
	return
}

func (r *Resolver) GetVote(ctx context.Context, args voteQuery) (*VoteResolver, error) {
	vote, err := repository.QueryVote(models.Vote{GameId: args.GameId, UserId: getIdFromCtx(ctx)})
	return &VoteResolver{vote: &vote}, err
}

func (r *Resolver) GetVotes(ctx context.Context, args userVoteQuery) (voteResolvers *[]*VoteResolver, err error) {
	votes, err := repository.QueryVotes(models.Vote{UserId: getIdFromCtx(ctx)}, args.Limit, args.After)
	var voteList []*VoteResolver
	for _, vote := range votes {
		voteList = append(voteList, &VoteResolver{vote: &vote})
	}
	voteResolvers = &voteList
	return
}

//func (r *Resolver) UpdateUser(ctx context.Context, args *struct{ User userInput }) (*UserResolver, error) {
//
//	return nil, nil
//}

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
		Topic:     args.Game.Topic,
		UserId:    getIdFromCtx(ctx),
		StartTime: time.Now(),
		EndTime:   time.Now().Add(time.Minute * time.Duration(args.Game.Duration)),
		Stakes:    args.Game.Stakes,
		GameMode:  args.Game.GameMode,
		Options:   options,
	}

	err = logic.AllocateHostExp(getIdFromCtx(ctx))
	if err == nil {
		game, err := repository.CreateGame(newGame)
		logic.Controller.AddGame(&game)
		if err == nil {
			gameRes := GameResolver{game: &game}
			gameResolver = &gameRes
		}
	}
	return
}

func (r *Resolver) AddVote(ctx context.Context, args *struct{ Vote voteInput }) (voteResolver *VoteResolver, err error) {
	newVote := models.Vote{
		GameId:   args.Vote.GameId,
		UserId:   getIdFromCtx(ctx),
		OptionId: args.Vote.OptionId,
		Money:    args.Vote.Amount,
	}

	// TODO: Add validation for correct choice Id
	err = logic.AllocateMoney(getIdFromCtx(ctx), -args.Vote.Amount)
	err = logic.AllocateVoteExp(getIdFromCtx(ctx))
	if err == nil {
		err = repository.CreateVote(newVote)
		vote, err := repository.QueryVote(newVote)
		if err == nil {
			voteRes := VoteResolver{vote: &vote}
			voteResolver = &voteRes
		}
	}
	return
}
