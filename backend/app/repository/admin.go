package repository

import (
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
	var result domain.Admin
	repo.db.Where(&domain.Admin{Email: strings.ToLower(email)}).First(&result)
	return &result
}

func (repo *AdminRepo) GetById(id uint) *domain.Admin {
	admin := domain.Admin{ID: id}
	repo.db.First(&admin)
	return &admin
}
