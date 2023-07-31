package domain

import (
	"time"

	"gorm.io/gorm"
)

type Submission struct {
	ID          uint `gorm:"primaryKey"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
	ChallengeId uint
	UserId      uint
	Solutions   []Solution `gorm:"foreignKey:SubmissionId"`
}
