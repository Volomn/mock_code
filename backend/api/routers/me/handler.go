package me

import (
	"net/http"

	domain "github.com/Volomn/mock_code/backend/domain/models"
	"github.com/go-chi/render"
)

type MeResponse struct {
	ID        uint   `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}

func (rd *MeResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewMeResponse(user domain.User) *MeResponse {
	return &MeResponse{
		ID:        user.ID,
		FirstName: user.FirstName.String,
		LastName:  user.LastName.String,
		Email:     user.Email,
	}
}

func GetMe(w http.ResponseWriter, r *http.Request) {
	authUser := r.Context().Value("authUser").(*domain.User)
	render.Status(r, 200)
	render.Render(w, r, NewMeResponse(*authUser))
	return

}
