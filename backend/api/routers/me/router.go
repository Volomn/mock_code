package me

import (
	"net/http"

	"github.com/Volomn/mock_code/backend/api/middleware"
	"github.com/go-chi/chi/v5"
)

func GetMeRouter() chi.Router {
	var router = chi.NewRouter()
	router.Get("/", middleware.AuthenticationMiddleware(middleware.AuthorizationMiddleWare(true, false)(http.HandlerFunc(GetMe))).(http.HandlerFunc))
	return router
}
