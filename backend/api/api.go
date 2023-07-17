package api

import (
	"context"
	"net/http"

	"github.com/Volomn/mock_code/backend/api/auth"
	"github.com/Volomn/mock_code/backend/app"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

func ApplicationMiddleware(app *app.Application) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := context.WithValue(r.Context(), "app", app)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}

}

func GetApiRouter(app *app.Application) chi.Router {
	// create api router
	router := chi.NewRouter()

	router.Use(middleware.RequestID)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.URLFormat)
	router.Use(render.SetContentType(render.ContentTypeJSON))
	router.Use(ApplicationMiddleware(app))

	router.Mount("/auth", auth.GetAuthRouter())
	return router
}
