package domain

import (
	"time"

	"gorm.io/gorm"
)

type Admin struct {
	ID        uint `gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	FirstName string
	LastName  string
	Email     string
	Password  string
}
