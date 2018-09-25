package logic

import (
	"container/heap"
	"time"
	"zerosum/models"
)

type GameController struct {
	incomingGames  chan *models.Game
	queue          TimedGameQueue
	nextEndingGame *models.Game
	timer          *time.Timer
}

var Controller *GameController

func init() {
	Controller = &GameController{
		incomingGames: make(chan *models.Game, 100),
		queue:         make(TimedGameQueue, 1),
	}
	go Controller.consumeIncoming()
}

func (c *GameController) AddGame(game *models.Game) {
	c.incomingGames <- game
}

func (c *GameController) consumeIncoming() {
	for game := range c.incomingGames {
		if c.nextEndingGame == nil {
			c.nextEndingGame = game
			c.setTimer(game.EndTime)
		} else if game.EndTime.Before(c.nextEndingGame.EndTime) {
			if c.timer.Stop() {
				// Only push if timer can be stopped, if false is returned nextEndingGame will already have been
				// processed
				heap.Push(&c.queue, c.nextEndingGame)
			}
			c.nextEndingGame = game
			c.setTimer(game.EndTime)
		} else {
			heap.Push(&c.queue, game)
		}
	}
}

func (c *GameController) setTimer(stopAt time.Time) {
	c.timer = time.AfterFunc(stopAt.Sub(time.Now()), func() {
		ResolveGame(c.nextEndingGame.Id)
	})
}
