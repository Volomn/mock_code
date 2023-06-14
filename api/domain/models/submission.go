package domain

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Submission struct {
	gorm.Model
	Score       float32
	Details     datatypes.JSON
	ChallengeId uint
	UserId      uint
}
