package domain

import (
	"gopkg.in/guregu/null.v4"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Challenge struct {
	gorm.Model
	Name             string
	IsOpened         bool
	OpenedAt         null.Time
	ProblemStatement string
	InputFiles       datatypes.JSON
	Judge            string
	Submissions      []Submission `gorm:"foreignKey:ChallengeId"`
}
