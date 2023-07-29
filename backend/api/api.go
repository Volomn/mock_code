package api

import (
	mymiddleware "github.com/Volomn/mock_code/backend/api/middleware"
	"github.com/Volomn/mock_code/backend/api/routers/auth"
	"github.com/Volomn/mock_code/backend/api/routers/challenge"
	"github.com/Volomn/mock_code/backend/app"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"github.com/spf13/viper"
)

func GetApiRouter(app *app.Application) chi.Router {
	// create api router
	router := chi.NewRouter()
	tokenAuth := jwtauth.New("HS256", []byte(viper.GetString("AUTH_SECRET_KEY")), nil)

	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.URLFormat)
	router.Use(render.SetContentType(render.ContentTypeJSON))

	router.Use(mymiddleware.ApplicationMiddleware(app))
	router.Use(jwtauth.Verifier(tokenAuth))

	router.Mount("/auth", auth.GetAuthRouter())
	router.Mount("/challenges", challenge.GetChallengeRouter())
	return router
}
