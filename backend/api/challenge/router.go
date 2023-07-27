package challenge

import (
	"net/http"

	"github.com/Volomn/mock_code/backend/api/middleware"
	"github.com/go-chi/chi/v5"
)

func GetChallengeRouter() chi.Router {
	var router = chi.NewRouter()
	router.Post("/", middleware.AuthenticationMiddleware(middleware.AuthorizationMiddleWare(false, true)(http.HandlerFunc(AddChallenge))).(http.HandlerFunc))
	router.Post("/input", middleware.AuthenticationMiddleware(middleware.AuthorizationMiddleWare(false, true)(http.HandlerFunc(UploadInputFile))).(http.HandlerFunc))
	return router
}
