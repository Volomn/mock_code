package challenge

import (
	"errors"
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

type ChallengeResponse struct {
	ID                  uint      `json:"id"`
	CreatedAt           time.Time `json:"createdAt"`
	IsOpened            bool      `json:"isOpened"`
	Name                string    `json:"name"`
	ProblemStatementUrl string    `json:"problemStatementUrl"`
	ShortDescription    string    `json:"shortDescription"`
	InputFiles          []string  `json:"inputFiles"`
}

func (rd *ChallengeResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewChallengeListResponse(challenges []*domain.Challenge) []render.Renderer {
	list := []render.Renderer{}
	for _, challenge := range challenges {
		list = append(list, NewChallengeResponse(challenge))
	}
	return list
}

func NewChallengeResponse(challenge *domain.Challenge) *ChallengeResponse {
	return &ChallengeResponse{
		ID:                  challenge.ID,
		CreatedAt:           challenge.CreatedAt,
		IsOpened:            challenge.OpenedAt.Valid,
		Name:                challenge.Name,
		ShortDescription:    challenge.ShortDescription,
		ProblemStatementUrl: challenge.ProblemStatementUrl,
		InputFiles:          challenge.InputFiles,
	}
}

func AddChallenge(w http.ResponseWriter, r *http.Request) {
	// limit file size to 25Mb
	err := r.ParseMultipartForm(25 << 20)
	if err != nil {
		slog.Error("Error parsing multipart form when submitting solution", "error", err.Error())
		render.Render(w, r, util.ErrorBadRequest(err, nil))
		return
	}

	// Get handler for filename, size and headers
	file, handler, err := r.FormFile("problemStatement")
	if err != nil {
		slog.Error("Error receiving file", "error", err.Error())
		render.Render(w, r, util.ErrorBadRequest(err, nil))
		return
	}

	// Ensure file is pdf
	contentType := handler.Header.Get("Content-Type")
	if contentType != "application/pdf" {
		errorMessage := "Invalid file format"
		render.Render(w, r, util.ErrorBadRequest(errors.New(errorMessage), &errorMessage))
		return
	}

	challangeName := r.FormValue("name")
	shortDescription := r.FormValue("shortDescription")
	judge := r.FormValue("judge")

	authAdmin := r.Context().Value("authAdmin").(*domain.Admin)
	application := r.Context().Value("app").(*app.Application)

	// add challenge
	_, err = application.AddChallenge(authAdmin.ID, challangeName, shortDescription, file, handler.Filename, contentType, judge)
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

func GetChallenge(w http.ResponseWriter, r *http.Request) {
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
	render.Status(r, 200)
	render.Render(w, r, NewChallengeResponse(challenge))
	return

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
