package repository

import (
	"errors"
	"strings"
	"time"

	domain "github.com/Volomn/mock_code/backend/domain/models"
	"gopkg.in/guregu/null.v4"
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
	res := repo.db.Where(&domain.Challenge{Name: strings.ToLower(name)}).First(&result)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return nil
	}
	return &result
}

func (repo *ChallengeRepo) GetById(id uint) *domain.Challenge {
	challenge := domain.Challenge{ID: id}
	res := repo.db.First(&challenge)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return nil
	}
	return &challenge
}

func (repo *ChallengeRepo) Fetch(isOpened *bool) []*domain.Challenge {
	var challenges []*domain.Challenge
	if isOpened == nil {
		repo.db.Find(&challenges)
	} else if *isOpened == true {
		repo.db.Not(&domain.Challenge{OpenedAt: null.NewTime(time.Now(), false)}).Find(&challenges)
	} else {
		repo.db.Where(&domain.Challenge{OpenedAt: null.NewTime(time.Now(), false)}).Find(&challenges)
	}
	return challenges
}
