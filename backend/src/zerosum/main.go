package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"zerosum/repository"
)

func main() {
	_ = gin.Default()
	err := repository.InitTestDB()
	fmt.Print(err)
}