package challenge

import (
	"fmt"
	"net/http"

	"github.com/Volomn/mock_code/backend/app"
	domain "github.com/Volomn/mock_code/backend/domain/models"
	"github.com/go-chi/render"
	"golang.org/x/exp/slog"
)

type AddChallengeRequest struct {
	Name             string `json:"name"`
	ProblemStatement string `json:"problemStatement"`
	Judge            string `json:"judge"`
}

func (a *AddChallengeRequest) Bind(r *http.Request) error {
	return nil
}

func AddChallenge(w http.ResponseWriter, r *http.Request) {
	data := &AddChallengeRequest{}
	if err := render.Bind(r, data); err != nil {
		slog.Info("binding input data failed", "error", err.Error())
		render.Status(r, 422)
		render.JSON(w, r, map[string]string{"msg": fmt.Sprintf("Invalid request payload, %s", err.Error())})
		return
	}

	authAdmin := r.Context().Value("authAdmin").(*domain.Admin)
	application := r.Context().Value("app").(*app.Application)
	_, err := application.AddChallenge(authAdmin.ID, data.Name, data.ProblemStatement, data.Judge)
	if err != nil {
		slog.Error("Error adding challenge", "error", err.Error())
		render.Status(r, 400)
		render.JSON(w, r, map[string]string{"msg": err.Error()})
		return
	}
	render.Status(r, http.StatusCreated)
	render.JSON(w, r, map[string]string{"msg": "Challenge addess successfully"})

}

func UploadInputFile(w http.ResponseWriter, r *http.Request) {

}
