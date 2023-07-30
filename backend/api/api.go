package api

import (
	mymiddleware "github.com/Volomn/mock_code/backend/api/middleware"
	"github.com/Volomn/mock_code/backend/api/routers/auth"
	"github.com/Volomn/mock_code/backend/api/routers/challenge"
	"github.com/Volomn/mock_code/backend/api/routers/leaderboard"
	"github.com/Volomn/mock_code/backend/api/routers/submission"
	"github.com/Volomn/mock_code/backend/app"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
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
	router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		// AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		// AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		// ExposedHeaders:   []string{"Link"},
		// AllowCredentials: false,
		// MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	router.Use(mymiddleware.ApplicationMiddleware(app))
	router.Use(jwtauth.Verifier(tokenAuth))

	router.Mount("/auth", auth.GetAuthRouter())
	router.Mount("/challenges", challenge.GetChallengeRouter())
	router.Mount("/submissions", submission.GetSubmissionRouter())
	router.Mount("/leaderboard", leaderboard.GetLeaderboardRouter())
	return router
}
