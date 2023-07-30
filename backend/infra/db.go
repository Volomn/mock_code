package infra

import (
	"fmt"

	domain "github.com/Volomn/mock_code/backend/domain/models"
	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func GetDb() *gorm.DB {
	dbHost := viper.GetString("DATABASE_HOST")
	dbPort := viper.GetInt("DATABASE_PORT")
	dbUser := viper.GetString("DATABASE_USER")
	dbPassword := viper.GetString("DATABASE_PASSWORD")
	dbName := viper.GetString("DATABASE_NAME")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d", dbHost, dbUser, dbPassword, dbName, dbPort)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	return db
}

func AutoMigrateDB(db *gorm.DB) {
	db.AutoMigrate(&domain.User{}, &domain.Challenge{}, &domain.Submission{}, &domain.Admin{})
}
