package domain

import (
	"time"

	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Submission struct {
	ID          uint `gorm:"primaryKey"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
	Score       float32
	Details     datatypes.JSON
	ChallengeId uint
	UserId      uint
}
