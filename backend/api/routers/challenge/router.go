package challenge

import (
	"net/http"

	"github.com/Volomn/mock_code/backend/api/middleware"
	"github.com/go-chi/chi/v5"
)

func GetChallengeRouter() chi.Router {
	var router = chi.NewRouter()
	router.Post("/", middleware.AuthenticationMiddleware(middleware.AuthorizationMiddleWare(false, true)(http.HandlerFunc(AddChallenge))).(http.HandlerFunc))
	router.Get("/", FetchChallenges)
	router.Get("/{challengeId}", GetChallenge)
	router.Post("/{challengeId}/input", middleware.AuthenticationMiddleware(middleware.AuthorizationMiddleWare(false, true)(http.HandlerFunc(UploadInputFile))).(http.HandlerFunc))
	router.Post("/{challengeId}/open", middleware.AuthenticationMiddleware(middleware.AuthorizationMiddleWare(false, true)(http.HandlerFunc(OpenChallenge))).(http.HandlerFunc))
	return router
}
