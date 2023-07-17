package domain

import (
	"time"

	"gopkg.in/guregu/null.v4"
	"gorm.io/gorm"
)

type User struct {
	ID          uint `gorm:"primaryKey"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
	FirstName   null.String
	LastName    null.String
	Email       string
	Submissions []Submission `gorm:"foreignKey:UserId"`
}
