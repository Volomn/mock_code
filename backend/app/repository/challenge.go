package repository

import (
	"strings"

	domain "github.com/Volomn/mock_code/backend/domain/models"
	"gorm.io/gorm"
)

type ChallengeRepo struct {
	db *gorm.DB
}

func NewChallengeRepository(db *gorm.DB) *ChallengeRepo {
	return &ChallengeRepo{db: db}
}

func (repo *ChallengeRepo) SaveChallenge(challenge *domain.Challenge) {
	repo.db.Save(&challenge)
}

func (repo *ChallengeRepo) GetByName(name string) *domain.Challenge {
	var result domain.Challenge
	repo.db.Where(&domain.Challenge{Name: strings.ToLower(name)}).First(&result)
	return &result
}

func (repo *ChallengeRepo) GetById(id uint) *domain.Challenge {
	challenge := domain.Challenge{ID: id}
	repo.db.First(&challenge)
	return &challenge
}
