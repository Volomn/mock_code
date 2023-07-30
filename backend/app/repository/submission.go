package repository

import (
	"errors"

	domain "github.com/Volomn/mock_code/backend/domain/models"
	"gorm.io/gorm"
)

type SubmissionRepo struct {
	db *gorm.DB
}

func NewSubmissionRepository(db *gorm.DB) *SubmissionRepo {
	return &SubmissionRepo{db: db}
}

func (repo *SubmissionRepo) SaveSubmission(submission *domain.Submission) {
	repo.db.Save(&submission)
}

func (repo *SubmissionRepo) GetById(id uint) *domain.Submission {
	submission := domain.Submission{ID: id}
	res := repo.db.First(&submission)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		return nil
	}
	return &submission
}

func (repo *SubmissionRepo) Fetch() []*domain.Submission {
	var submissions []*domain.Submission
	repo.db.Find(&submissions)
	return submissions
}
