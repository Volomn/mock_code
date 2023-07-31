package leaderboard

import (
	"github.com/go-chi/chi/v5"
)

func GetLeaderboardRouter() chi.Router {
	var router = chi.NewRouter()
	router.Get("/", GetLeaderboard)
	return router
}
