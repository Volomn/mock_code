package challenge

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/Volomn/mock_code/backend/api/util"
	"github.com/Volomn/mock_code/backend/app"
	domain "github.com/Volomn/mock_code/backend/domain/models"
	"github.com/go-chi/chi/v5"
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

type ChallengeResponse struct {
	ID               uint      `json:"id"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
	IsOpened         bool      `json:"isOpened"`
	Name             string    `json:"name"`
	ProblemStatement string    `json:"problemStatement"`
	InputFiles       []string  `json:"inputFiles"`
}

func (rd *ChallengeResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewChallengeResponse(challenge *domain.Challenge) *ChallengeResponse {
	return &ChallengeResponse{
		ID:               challenge.ID,
		CreatedAt:        challenge.CreatedAt,
		UpdatedAt:        challenge.UpdatedAt,
		IsOpened:         challenge.OpenedAt.Valid,
		Name:             challenge.Name,
		ProblemStatement: challenge.ProblemStatement,
		InputFiles:       challenge.InputFiles,
	}
}

func NewChallengeListResponse(challenges []*domain.Challenge) []render.Renderer {
	list := []render.Renderer{}
	for _, challenge := range challenges {
		list = append(list, NewChallengeResponse(challenge))
	}
	return list
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
	render.JSON(w, r, map[string]string{"msg": "Challenge added successfully"})

}

func UploadInputFile(w http.ResponseWriter, r *http.Request) {
	// Maximum upload of 300 MB files
	r.ParseMultipartForm(300 << 20)

	// Get handler for filename, size and headers
	file, handler, err := r.FormFile("inputFile")
	if err != nil {
		slog.Error("Error receiving file", "error", err.Error())
		render.Render(w, r, util.ErrorBadRequest(err, nil))
		return
	}

	defer file.Close()
	application := r.Context().Value("app").(*app.Application)

	challengeIdString := chi.URLParam(r, "challengeId")
	slog.Info("Challenge id from request", "id", challengeIdString)
	challengeId, err := strconv.ParseUint(challengeIdString, 10, 0)
	if err != nil {
		msg := "Invalid challengeId"
		render.Render(w, r, util.ErrorUnprocessableContent(err, &msg))
		return
	}
	challenge := application.ChallengeRepo.GetById(uint(challengeId))
	if challenge == nil {
		msg := "Challenge not found"
		render.Render(w, r, util.ErrorNotFound(errors.New(msg), &msg))
		return
	}
	slog.Info("File content headers", "header", handler.Header)
	authAdmin := r.Context().Value("authAdmin").(*domain.Admin)
	contentType := handler.Header.Get("Content-Type")
	if contentType != "text/plain" {
		errorMessage := "Invalid file format"
		render.Render(w, r, util.ErrorBadRequest(errors.New(errorMessage), &errorMessage))
		return
	}
	*challenge, err = application.AddChallengeInputFile(authAdmin.ID, challenge.ID, file, handler.Filename, handler.Header.Get("Content-Type"))
	if err != nil {
		slog.Error("Error uploading challenge input file", "error", err.Error())
		render.Render(w, r, util.ErrorBadRequest(err, nil))
		return
	}
	render.Status(r, 200)
	render.JSON(w, r, map[string]interface{}{"msg": "Successful"})
}

func FetchChallenges(w http.ResponseWriter, r *http.Request) {
	var result []*domain.Challenge
	application := r.Context().Value("app").(*app.Application)
	challengeRepo := application.ChallengeRepo
	isOpenString := r.URL.Query().Get("isOpen")
	if isOpenString == "" {
		result = challengeRepo.Fetch(nil)
	} else {
		isOpened, err := strconv.ParseBool(isOpenString)
		if err != nil {
			render.Status(r, 422)
			render.JSON(w, r, map[string]string{"msg": "Invalid boolean value"})
			return
		}
		result = challengeRepo.Fetch(&isOpened)
	}
	if err := render.RenderList(w, r, NewChallengeListResponse(result)); err != nil {
		slog.Error("Unable to render response for fetch challenges", "error", err.Error())
		panic(err.Error())
	}

}

func OpenChallenge(w http.ResponseWriter, r *http.Request) {
	application := r.Context().Value("app").(*app.Application)

	challengeIdString := chi.URLParam(r, "challengeId")
	slog.Info("Challenge id from request", "id", challengeIdString)
	challengeId, err := strconv.ParseUint(challengeIdString, 10, 0)
	if err != nil {
		msg := "Invalid challengeId"
		render.Render(w, r, util.ErrorUnprocessableContent(err, &msg))
		return
	}
	challenge := application.ChallengeRepo.GetById(uint(challengeId))
	if challenge == nil {
		msg := "Challenge not found"
		render.Render(w, r, util.ErrorNotFound(errors.New(msg), &msg))
		return
	}
	authAdmin := r.Context().Value("authAdmin").(*domain.Admin)

	*challenge, err = application.OpenChallenge(authAdmin.ID, challenge.ID)
	if err != nil {
		erroMessage := err.Error()
		slog.Error("Error opening challenge", "error", erroMessage)
		render.Render(w, r, util.ErrorBadRequest(err, &erroMessage))
		return
	}
	render.Status(r, 200)
	render.JSON(w, r, map[string]interface{}{"msg": "Successful"})
}
