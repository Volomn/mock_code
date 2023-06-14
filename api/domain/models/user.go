package domain

import (
	"gopkg.in/guregu/null.v4"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	FirstName   null.String
	LastName    null.String
	Email       string
	Submissions []Submission `gorm:"foreignKey:UserId"`
}
