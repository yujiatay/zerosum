package logic

import (
	"zerosum/models"
)

// Implements the Heap interface, Pop will give smallest "priority" as per `Less` definition
type TimedGameQueue []*models.Game

func (q TimedGameQueue) Len() int { return len(q) }

func (q TimedGameQueue) Less(i, j int) bool {
	// i is smaller (higher priority) than j if i ends before j
	return q[i].EndTime.Before(q[j].EndTime)
}

func (q TimedGameQueue) Swap(i, j int) {
	q[i], q[j] = q[j], q[i]
}

func (q *TimedGameQueue) Push(x interface{}) {
	item := x.(*models.Game)
	*q = append(*q, item)
}

func (q *TimedGameQueue) Pop() interface{} {
	old := *q
	n := len(old)
	item := old[n-1]
	*q = old[0 : n-1]
	return item
}
