package repository

import (
	"errors"
	"strings"

	domain "github.com/Volomn/mock_code/backend/domain/models"
	"gorm.io/gorm"
)

type AdminRepo struct {
	db *gorm.DB
}

func NewAdminRepository(db *gorm.DB) *AdminRepo {
	return &AdminRepo{db: db}
}

func (repo *AdminRepo) SaveAdmin(admin *domain.Admin) {
	repo.db.Save(&admin)
}

func (repo *AdminRepo) GetAdminByEmail(email string) *domain.Admin {
	var admin domain.Admin
	res := repo.db.Where(&domain.Admin{Email: strings.ToLower(email)}).First(&admin)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return nil
	}
	return &admin
}

func (repo *AdminRepo) GetById(id uint) *domain.Admin {
	admin := domain.Admin{ID: id}
	res := repo.db.First(&admin)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return nil
	}
	return &admin
}
