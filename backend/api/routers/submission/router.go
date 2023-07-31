package submission

import (
	"net/http"

	"github.com/Volomn/mock_code/backend/api/middleware"
	"github.com/go-chi/chi/v5"
)

func GetSubmissionRouter() chi.Router {
	var router = chi.NewRouter()
	router.Post("/", middleware.AuthenticationMiddleware(middleware.AuthorizationMiddleWare(true, false)(http.HandlerFunc(SubmitSolution))).(http.HandlerFunc))
	router.Get("/", middleware.AuthenticationMiddleware(middleware.AuthorizationMiddleWare(true, false)(http.HandlerFunc(FetchSolutions))).(http.HandlerFunc))
	return router
}
