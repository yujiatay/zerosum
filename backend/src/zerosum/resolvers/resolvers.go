package resolvers

import (
	"context"
	"errors"
	"os"
	"time"
	"zerosum/logic"
	"zerosum/models"
	"zerosum/repository"
)

type Resolver struct{}

type activeGameSearchQuery struct {
	Filter  string
	Joined  *bool
	Created *bool
	Limit   *int32
}

type completedGameSearchQuery struct {
	Created bool
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

func getIdFromCtx(ctx context.Context) (id string) {
	if os.Getenv("DEBUG") == "TRUE" {
		return "testuser"
	}
	return ctx.Value("Id").(string)
}

func (r *Resolver) USER(ctx context.Context, args *struct{ Id *string }) (*UserResolver, error) {
	// TODO: Add field restriction when Id != Id in ctx
	if args.Id == nil {
		user, err := repository.QueryUser(models.User{Id: getIdFromCtx(ctx)})
		return &UserResolver{user: &user}, err
	} else {
		user, err := repository.QueryUser(models.User{Id: *args.Id})
		return &UserResolver{user: &user}, err
	}
}

func (r *Resolver) PROFILE(ctx context.Context) (*UserResolver, error) {
	user, err := repository.QueryUser(models.User{Id: getIdFromCtx(ctx)})
	return &UserResolver{user: &user}, err
}

func (r *Resolver) GAME(ctx context.Context, args *struct{ Id string }) (*GameResolver, error) {
	game, err := repository.QueryGame(models.Game{Id: args.Id})
	return &GameResolver{game: &game}, err
}

func (r *Resolver) ACTIVEGAMES(ctx context.Context, args activeGameSearchQuery) (gameResolvers []*GameResolver, err error) {
	games, err := repository.SearchActiveGames(args.Filter, args.Joined, args.Created, getIdFromCtx(ctx), args.Limit)
	var gamesList []*GameResolver
	for index := range games {
		gamesList = append(gamesList, &GameResolver{game: &games[index]})
	}
	gameResolvers = gamesList
	return
}

func (r *Resolver) COMPLETEDGAMES(ctx context.Context, args completedGameSearchQuery) (gameResolvers []*GameResolver, err error) {
	games, err := repository.GetCompletedGames(getIdFromCtx(ctx), args.Created)
	var gamesList []*GameResolver
	for index := range games {
		gamesList = append(gamesList, &GameResolver{game: &games[index]})
	}
	gameResolvers = gamesList
	return
}

func (r *Resolver) GAMECOUNT(ctx context.Context) (total int32) {
	return repository.CountGames()
}

func (r *Resolver) LEADERBOARD(ctx context.Context, args *struct{ Limit int32 }) (userResolvers []*UserResolver, err error) {
	users, err := repository.QueryTopUsers(10, logic.LEADERBOARD_MIN_GAMES)
	var userList []*UserResolver
	for index := range users {
		ranking := int32(index) + 1
		userList = append(userList, &UserResolver{user: &users[index], ranking: &ranking})
	}
	userResolvers = userList
	return
}

func (r *Resolver) VOTE(ctx context.Context, args voteQuery) (*VoteResolver, error) {
	vote, err, _ := repository.QueryVote(models.Vote{GameId: args.GameId, UserId: getIdFromCtx(ctx)})
	return &VoteResolver{vote: &vote}, err
}

func (r *Resolver) VOTES(ctx context.Context, args userVoteQuery) (voteResolvers []*VoteResolver, err error) {
	votes, err := repository.QueryVotes(models.Vote{UserId: getIdFromCtx(ctx)}, args.Limit, args.After)
	var voteList []*VoteResolver
	for index := range votes {
		voteList = append(voteList, &VoteResolver{vote: &votes[index]})
	}
	voteResolvers = voteList
	return
}

func (r *Resolver) STOREHATS(ctx context.Context, args *struct{ Owned bool }) (hatResolvers []*HatResolver, err error) {
	hats, err := repository.QueryUserHats(getIdFromCtx(ctx), args.Owned, false)
	var hatList []*HatResolver
	for index := range hats {
		hatList = append(hatList, &HatResolver{hat: &hats[index], owned: args.Owned, achieved: false})
	}
	hatResolvers = hatList
	return
}

func (r *Resolver) ACHIEVEDHATS(ctx context.Context) (hatResolvers []*HatResolver, err error) {
	hats, err := repository.QueryUserHats(getIdFromCtx(ctx), true, true)
	var hatList []*HatResolver
	for index := range hats {
		hatList = append(hatList, &HatResolver{hat: &hats[index], owned: true, achieved: true})
	}
	hatResolvers = hatList
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
	if len(options) < 2 {
		err = errors.New("too few options")
		return
	}

	if args.Game.Topic == "" {
		err = errors.New("empty topic")
		return
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
	if args.Vote.Amount <= 0 {
		err = errors.New("invalid amount specified")
		return
	}
	
	err = logic.AllocateMoney(getIdFromCtx(ctx), -args.Vote.Amount)
	if err != nil {
		return
	}
	err = logic.AllocateVoteExp(getIdFromCtx(ctx))
	if err == nil {
		err = repository.CreateVote(newVote)
		vote, err, _ := repository.QueryVote(newVote)
		if err == nil {
			voteRes := VoteResolver{vote: &vote}
			voteResolver = &voteRes
		}
	}
	return
}

func (r *Resolver) BuyHat(ctx context.Context, args *struct{ Id string }) (hatResolver *HatResolver, err error) {

	desiredHat, err := repository.QueryHat(models.Hat{Id: args.Id})
	err = logic.AllocateMoney(getIdFromCtx(ctx), -desiredHat.Price)
	if err != nil {
		return
	}
	err = repository.UpdateHatOwnership(models.HatOwnership{HatId: desiredHat.Id, UserId: getIdFromCtx(ctx), Owned: true})
	if err == nil {
		hatResolver = &HatResolver{hat: &desiredHat, owned: true, achieved: false}
	}
	return
}

func (r *Resolver) ValidateResult(ctx context.Context, args *struct{ GameId string }) (success bool, err error) {
	game, err := repository.QueryGame(models.Game{Id: args.GameId})
	if err != nil {
		success = false
		return
	}

	// Is creator
	if game.UserId == getIdFromCtx(ctx) {
		game.Validated = true
		err = repository.UpdateGame(game)
	}

	if err != nil {
		success = false
		return
	}

	// Is voter
	vote, internalErr, recordNotFound := repository.QueryVote(models.Vote{UserId: getIdFromCtx(ctx), GameId: game.Id})
	if internalErr != nil && !recordNotFound {
		err = internalErr
		success = false
		return
	}

	// Result not validated by user yet
	if !recordNotFound {
		vote.Validated = true
		err = repository.UpdateVote(vote)
	}

	if err != nil {
		success = false
		return
	}

	return
}
