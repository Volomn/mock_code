package main

import (
	"fmt"
	"net/http"

	domain "github.com/Volomn/mock_code/api/domain/models"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/spf13/viper"
	"golang.org/x/exp/slog"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	viper.AutomaticEnv()

	dbHost := viper.GetString("DATABASE_HOST")
	dbPort := viper.GetInt("DATABASE_PORT")
	dbUser := viper.GetString("DATABASE_USER")
	dbPassword := viper.GetString("DATABASE_PASSWORD")
	dbName := viper.GetString("DATABASE_NAME")

	serverPORT := viper.GetInt("SERVER_PORT")

	slog.Info("Connecting to database", "port", dbPort, "host", dbHost, "user", dbUser, "name", dbName)
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d", dbHost, dbUser, dbPassword, dbName, dbPort)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&domain.User{}, &domain.Challenge{}, &domain.Submission{})

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})
	slog.Info(fmt.Sprintf("Starting server on port %d", serverPORT))
	http.ListenAndServe(fmt.Sprintf(":%d", serverPORT), r)
}
