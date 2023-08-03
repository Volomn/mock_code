package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/Volomn/mock_code/backend/api"
	"github.com/Volomn/mock_code/backend/app"
	"github.com/Volomn/mock_code/backend/infra"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/spf13/viper"
	"github.com/urfave/cli"
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
	mainRouter.Use(cors.Handler(cors.Options{AllowedOrigins: []string{"*"}}))

	// mount api router on path /api
	mainRouter.Mount("/api", apiRouter)

	// initialize cli app
	cliApp := &cli.App{
		Commands: []cli.Command{
			{
				Name:    "create",
				Aliases: []string{"c"},
				Usage:   "Create mock code resource",
				Subcommands: []cli.Command{
					{
						Name:  "admin",
						Usage: "Create a new admin user",
						Flags: []cli.Flag{
							&cli.StringFlag{
								Name:     "fn",
								Usage:    "First Name",
								Required: true,
							},
							&cli.StringFlag{
								Name:     "ln",
								Usage:    "Last Name",
								Required: true,
							},
							&cli.StringFlag{
								Name:     "email",
								Usage:    "Email Address",
								Required: true,
							},
							&cli.StringFlag{
								Name:     "pw",
								Usage:    "Password",
								Required: true,
							},
						},
						Action: func(cCtx *cli.Context) error {
							firstName := cCtx.String("fn")
							lastName := cCtx.String("ln")
							email := cCtx.String("email")
							pw := cCtx.String("pw")
							_, err := app.CreateAdmin(firstName, lastName, email, pw)
							return err
						},
					},
				},
			},
			{
				Name:    "serve",
				Aliases: []string{"s"},
				Usage:   "Serve mock code api",
				Action: func(cCtx *cli.Context) error {
					slog.Info(fmt.Sprintf("Starting server on port %d", serverPORT))
					http.ListenAndServe(fmt.Sprintf(":%d", serverPORT), mainRouter)
					return nil
				},
			},
		},
	}

	if err := cliApp.Run(os.Args); err != nil {
		slog.Error(err.Error())
	}

}
