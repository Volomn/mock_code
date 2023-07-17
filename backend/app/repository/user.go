package repository

import (
	domain "github.com/Volomn/mock_code/backend/domain/models"
	"gorm.io/gorm"
)

type UserRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (repo *UserRepo) SaveUser(user *domain.User) {
	repo.db.Save(&user)
}

func (repo *UserRepo) GetUserByEmail(email string) *domain.User {
	var result domain.User
	repo.db.Where(&domain.User{Email: email}).First(&result)
	return &result
}
