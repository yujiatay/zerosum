package logic

import (
	"log"
	"zerosum/models"
	"zerosum/repository"
)

const (
	// WIN or LOSS milestones
	LOSE_TEN_GAMES = "68318501-2b9d-41fe-8aec-457163f2121a"
	WIN_TEN_GAMES = "3a0d9247-e558-4d02-a0d1-4ea66a2bde9e"
	// PLAY milestones
	PLAYED_FIVE_GAMES = "d811d69b-c254-499a-9dc6-67d541c31fc2"
	PLAYED_TWENTYFIVE_GAMES = "0dc19301-ef2b-4975-b840-78da53c62121"
	PLAYED_FIFTY_GAMES = "86df153f-723e-4088-b818-4ddc9285810a"
	// LEVEL milestones
	LEVEL_TWO = "fc8aa29b-157b-4746-a5f8-b1fb13bc2e1b"
	LEVEL_THREE = "d24a813c-1944-4f1b-81bd-552b5ba3f091"
	LEVEL_FOUR = "b1886421-99a9-4f31-b5cb-cb13089a7b79"
	LEVEL_FIVE = "c4d55ad2-e7ee-4746-9527-c2ff464fd9ef"
	LEVEL_SIX = "697b03ab-022f-4696-944d-6a2c2e4136f5"
	LEVEL_SEVEN = "dbccc788-95cb-46af-8494-4bb619f13329"
	LEVEL_EIGHT = "44ee2e3c-0abc-4235-9e29-762fb112f7fa"
	LEVEL_NINE= "d827fafa-aa69-4d45-99ab-c6c904351e41"
	LEVEL_TEN = "16096a17-df27-40bf-ba79-29b782174a73"
)

var STORE_HATS = []models.Hat{
	{
		Id: "39e60f15-1962-4b62-9428-67794c5b7439",
		Name: "ZS Hatto",
		Price: 99999,
		StoreLink: "https://i.imgur.com/iKvRYK5.png",
		ImgLink: "https://i.imgur.com/ytRqB5d.png",
	},
	{
		Id: "ffc985ae-11d9-4963-a197-d67a5a452f30",
		Name: "MADga Hat",
		Price: 7000,
		StoreLink: "https://i.imgur.com/iKvRYK5.png",
		ImgLink: "https://i.imgur.com/CRDPpBK.png",
	},
	{
		Id: "afe06e11-850a-4131-9476-436ae4247ff2",
		Name: "HattaDroid",
		Price: 7000,
		StoreLink: "https://i.imgur.com/iKvRYK5.png",
		ImgLink: "https://i.imgur.com/ZIIUjRp.png",
	},
	{
		Id: "8155ff19-9e1c-4e90-8d4b-bd9143d1d384",
		Name: "HattaDie",
		Price: 5000,
		StoreLink: "https://i.imgur.com/iKvRYK5.png",
		ImgLink: "https://i.imgur.com/X5i9vq5.png",
	},
	{
		Id: "f8078387-6726-422b-83cc-6d139be7a795",
		Name: "Atta Boi",
		Price: 1000,
		StoreLink: "https://i.imgur.com/iKvRYK5.png",
		ImgLink: "https://i.imgur.com/cYG3qVJ.png",
	},
}

var ACHIEVE_HATS = []models.Hat{
	// WIN or LOSS milestones
	{
		Id: "68318501-2b9d-41fe-8aec-457163f2121a",
		Name: "CAP 1.0",
		ImgLink: "https://i.imgur.com/LnZ7H4R.png",
		Achieve: true,
	},
	{
		Id: "3a0d9247-e558-4d02-a0d1-4ea66a2bde9e",
		Name: "CAP 5.0",
		ImgLink: "https://i.imgur.com/qXEvJhX.png",
		Achieve: true,
	},
	// PLAY milestones
	{
		Id: "d811d69b-c254-499a-9dc6-67d541c31fc2",
		Name: "Link to the Pink",
		ImgLink: "https://i.imgur.com/N2KV3xl.png",
		Achieve: true,
	},
	{
		Id: "0dc19301-ef2b-4975-b840-78da53c62121",
		Name: "Link to the Stars",
		ImgLink: "https://i.imgur.com/SCzQnaG.png",
		Achieve: true,
	},
	{
		Id: "86df153f-723e-4088-b818-4ddc9285810a",
		Name: "CAPtain",
		ImgLink: "https://i.imgur.com/8l6hfqk.png",
		Achieve: true,
	},
	// LEVEL milestones
	{
		Id: "fc8aa29b-157b-4746-a5f8-b1fb13bc2e1b",
		Name: "Green Wiz",
		ImgLink: "https://i.imgur.com/cor28l1.png",
		Achieve: true,
	},
	{
		Id: "d24a813c-1944-4f1b-81bd-552b5ba3f091",
		Name: "Blue Wiz",
		ImgLink: "https://i.imgur.com/JTTlu6A.png",
		Achieve: true,
	},
	{
		Id: "b1886421-99a9-4f31-b5cb-cb13089a7b79",
		Name: "Red Wiz",
		ImgLink: "https://i.imgur.com/udiRpX4.png",
		Achieve: true,
	},
	{
		Id: "c4d55ad2-e7ee-4746-9527-c2ff464fd9ef",
		Name: "Pink Wiz",
		ImgLink: "https://i.imgur.com/FZaETmU.png",
		Achieve: true,
	},
	{
		Id: "697b03ab-022f-4696-944d-6a2c2e4136f5",
		Name: "Orange Wiz",
		ImgLink: "https://i.imgur.com/pJSaHk9.png",
		Achieve: true,
	},
	{
		Id: "dbccc788-95cb-46af-8494-4bb619f13329",
		Name: "Grey Wiz",
		ImgLink: "https://i.imgur.com/c6MmTZA.png",
		Achieve: true,
	},
	{
		Id: "44ee2e3c-0abc-4235-9e29-762fb112f7fa",
		Name: "Pinkaboo",
		ImgLink: "https://i.imgur.com/Z6XXvBb.png",
		Achieve: true,
	},
	{
		Id: "d827fafa-aa69-4d45-99ab-c6c904351e41",
		Name: "Blueaboo",
		ImgLink: "https://i.imgur.com/BK32Pcm.png",
		Achieve: true,
	},
	{
		Id: "16096a17-df27-40bf-ba79-29b782174a73",
		Name: "ZerioSum",
		ImgLink: "https://i.imgur.com/307sCg4.png",
		Achieve: true,
	},
}

func SetUpHats() (err error) {
	// Ensures hats are in db and ensures that all users have relations to hats
	for _, storeHat := range STORE_HATS {
		_, err = repository.TryCreateHat(storeHat)
		if err != nil {
			return
		}
	}
	for _, achieveHat := range ACHIEVE_HATS {
		_, err = repository.TryCreateHat(achieveHat)
		if err != nil {
			return
		}
	}
	for _, user := range repository.QueryAllUsers() {
		err = FormHatRelations(user.Id)
		if err != nil {
			return
		}
	}
	return
}

func FormHatRelations(userId string) (err error) {
	// Ensures relations to hats for user
	for _, storeHat := range STORE_HATS {
		_, err = repository.TryCreateHatOwnership(models.HatOwnership{HatId: storeHat.Id, UserId: userId})
		if err != nil {
			return
		}
	}
	for _, achieveHat := range ACHIEVE_HATS {
		_, err = repository.TryCreateHatOwnership(models.HatOwnership{HatId: achieveHat.Id, UserId: userId})
		if err != nil {
			return
		}
	}
	return
}

func validateOrAward(hatId string, userId string) {
	hatOwnership, err := repository.QueryHatOwnership(models.HatOwnership{UserId: userId, HatId: hatId})
	if err != nil {
		log.Print("Critical error: hat ownership inconsistent")
	}
	hatOwnership.Owned = true
	repository.UpdateHatOwnership(hatOwnership)
	return
}

func verifyAchievements(userId string) {
	user, err := repository.QueryUser(models.User{Id: userId})
	if err != nil {
		log.Print("failed to get user while allocating achievements")
	}
	// WIN or LOSS milestones
	if user.GamesPlayed - user.GamesWon >= 10 {
		validateOrAward(LOSE_TEN_GAMES, user.Id)
	}
	if user.GamesWon >= 10 {
		validateOrAward(WIN_TEN_GAMES, user.Id)
	}

	// PLAY milestones
	switch {
	case user.GamesPlayed >= 50:
		validateOrAward(PLAYED_FIFTY_GAMES, user.Id)
		fallthrough
	case user.GamesPlayed >= 25:
		validateOrAward(PLAYED_TWENTYFIVE_GAMES, user.Id)
		fallthrough
	case user.GamesPlayed >= 5:
		validateOrAward(PLAYED_FIVE_GAMES, user.Id)
	}

	// LEVEL milestones
	switch {
	case getLevel(user.Experience) >= 10:
		validateOrAward(LEVEL_TEN, user.Id)
		fallthrough
	case getLevel(user.Experience) >= 9:
		validateOrAward(LEVEL_NINE, user.Id)
		fallthrough
	case getLevel(user.Experience) >= 8:
		validateOrAward(LEVEL_EIGHT, user.Id)
		fallthrough
	case getLevel(user.Experience) >= 7:
		validateOrAward(LEVEL_SEVEN, user.Id)
		fallthrough
	case getLevel(user.Experience) >= 6:
		validateOrAward(LEVEL_SIX, user.Id)
		fallthrough
	case getLevel(user.Experience) >= 5:
		validateOrAward(LEVEL_FIVE, user.Id)
		fallthrough
	case getLevel(user.Experience) >= 4:
		validateOrAward(LEVEL_FOUR, user.Id)
		fallthrough
	case getLevel(user.Experience) >= 3:
		validateOrAward(LEVEL_THREE, user.Id)
		fallthrough
	case getLevel(user.Experience) >= 2:
		validateOrAward(LEVEL_TWO, user.Id)
	}
}