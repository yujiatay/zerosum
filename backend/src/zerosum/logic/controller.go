package logic

import (
	"container/heap"
	"time"
	"zerosum/models"
)

type GameController struct {
	incomingGames  chan *models.Game
	finishedGames  chan *models.Game
	queue          TimedGameQueue
	nextEndingGame *models.Game
	timer          *time.Timer
}

var Controller *GameController

func init() {
	Controller = &GameController{
		incomingGames: make(chan *models.Game, 100),
		finishedGames: make(chan *models.Game, 100),
		queue:         make(TimedGameQueue, 0),
	}
	go Controller.gameLoop()
}

func (c *GameController) AddGame(game *models.Game) {
	c.incomingGames <- game
}

func (c *GameController) consumeIncoming(game *models.Game) {
	if c.nextEndingGame == nil {
		c.nextEndingGame = game
		c.setTimer(game)
	} else if game.EndTime.Before(c.nextEndingGame.EndTime) {
		// Add nextEndingGame back to the queue only if timer can be stopped (i.e. returns true) otherwise
		// it means timer has (just) fired and nextEndingGame is not in the finishedGames chan
		// Note: timer is never stopped unless there are no more games in the queue, at which
		// point nextEndingGame will be nil, therefore if false is returned, only possibility is timer just fired, but
		// the finished game is not yet processed (i.e. in the finishedGames chan)
		if c.timer.Stop() {
			heap.Push(&c.queue, c.nextEndingGame)
		}
		c.nextEndingGame = game
		c.setTimer(game)
	} else {
		heap.Push(&c.queue, game)
	}
}

func (c *GameController) setTimer(game *models.Game) {
	if !game.EndTime.After(time.Now()) {
		c.finishedGames <- game
	} else {
		c.timer = time.AfterFunc(game.EndTime.Sub(time.Now()), func() {
			c.finishedGames <- game
		})
	}
}

func (c *GameController) gameLoop() {
	for {
		select {
		case game := <-c.incomingGames:
			c.consumeIncoming(game)
		case game := <-c.finishedGames:
			// Schedule the next game, if it has not already been updated
			if game == c.nextEndingGame {
				if c.queue.Len() > 0 {
					c.nextEndingGame = heap.Pop(&c.queue).(*models.Game)
					c.setTimer(c.nextEndingGame)
				} else {
					// If there're no more games to process, nextEndingGame should be set to nil
					c.nextEndingGame = nil
				}
			}
			go ResolveGame(game.Id)
		}
	}
}
