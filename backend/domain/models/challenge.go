package domain

import (
	"time"

	"gopkg.in/guregu/null.v4"
	"gorm.io/gorm"
)

type Challenge struct {
	ID               uint `gorm:"primaryKey"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
	DeletedAt        gorm.DeletedAt `gorm:"index"`
	OpenedAt         null.Time
	Name             string
	ProblemStatement string
	InputFile        null.String
	Judge            string
	Submissions      []Submission `gorm:"foreignKey:ChallengeId"`
}
