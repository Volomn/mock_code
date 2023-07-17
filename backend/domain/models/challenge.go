package domain

import (
	"time"

	"gopkg.in/guregu/null.v4"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Challenge struct {
	ID               uint `gorm:"primaryKey"`
	CreatedAt        time.Time
	UpdatedAt        time.Time
	DeletedAt        gorm.DeletedAt `gorm:"index"`
	Name             string
	IsOpened         bool
	OpenedAt         null.Time
	ProblemStatement string
	InputFiles       datatypes.JSON
	Judge            string
	Submissions      []Submission `gorm:"foreignKey:ChallengeId"`
}
