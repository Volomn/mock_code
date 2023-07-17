package main

import (
	"fmt"
	"net/http"

	"github.com/Volomn/mock_code/backend/api"
	"github.com/Volomn/mock_code/backend/app"
	"github.com/Volomn/mock_code/backend/infra"
	"github.com/go-chi/chi/v5"
	"github.com/spf13/viper"
	"golang.org/x/exp/slog"
)

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

	// mount api router on path /api
	mainRouter.Mount("/api", apiRouter)

	slog.Info(fmt.Sprintf("Starting server on port %d", serverPORT))
	http.ListenAndServe(fmt.Sprintf(":%d", serverPORT), mainRouter)
}
