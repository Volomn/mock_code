package repository

import (
	"errors"
	"strings"

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
	res := repo.db.Where(&domain.User{Email: strings.ToLower(email)}).First(&result)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return nil
	}
	return &result
}
