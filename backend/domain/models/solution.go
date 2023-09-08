package domain

import (
	"time"

	"gopkg.in/guregu/null.v4"
	"gorm.io/gorm"
)

type Solution struct {
	ID            uint `gorm:"primaryKey"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index"`
	SubmissionId  uint
	InputFileUrl  string
	OutputFileUrl string
	Score         int
	ErrorMessage  null.String
}
