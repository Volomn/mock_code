package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/Volomn/mock_code/backend/api"
	"github.com/Volomn/mock_code/backend/app"
	"github.com/Volomn/mock_code/backend/infra"
	"github.com/go-chi/chi/v5"
	"github.com/spf13/viper"
	"golang.org/x/exp/slog"
	"gorm.io/gorm"
)

func DatabaseMiddleware(db *gorm.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := context.WithValue(r.Context(), "db", db)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}

}

func main() {
	viper.AutomaticEnv()
	serverPORT := viper.GetInt("SERVER_PORT")

	// get database connection
	db := infra.GetDb()

	// create models
	infra.AutoMigrateDB(db)

	// get application
	app := app.NewApplication(db)

	// get api router
	apiRouter := api.GetApiRouter(app)

	mainRouter := chi.NewRouter()

	// add datbase middleware
	mainRouter.Use(DatabaseMiddleware(db))

	// mount api router on path /api
	mainRouter.Mount("/api", apiRouter)

	slog.Info(fmt.Sprintf("Starting server on port %d", serverPORT))
	http.ListenAndServe(fmt.Sprintf(":%d", serverPORT), mainRouter)
}
