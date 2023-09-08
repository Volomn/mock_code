package submission

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/Volomn/mock_code/backend/api/util"
	"github.com/Volomn/mock_code/backend/app"
	domain "github.com/Volomn/mock_code/backend/domain/models"
	"github.com/go-chi/render"
	"golang.org/x/exp/slog"
)

type SolutionResponse struct {
	InputFile    string  `json:"inputFile"`
	OutputFile   string  `json:"outputFile"`
	Score        int     `json:"score"`
	ErrorMessage *string `json:"errorMessage"`
}

type SubmissionResponse struct {
	ID         uint               `json:"id"`
	CreatedAt  time.Time          `json:"createdAt"`
	TotalScore int                `json:"totalScore"`
	Solutions  []SolutionResponse `json:"solutions"`
}

func (rd *SubmissionResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewSubmissionResponse(submission *domain.Submission) *SubmissionResponse {
	totalScore := 0
	solutions := make([]SolutionResponse, len(submission.Solutions))
	for index, solution := range submission.Solutions {
		totalScore += int(solution.Score)
		solutions[index] = SolutionResponse{
			InputFile:    solution.InputFileUrl,
			OutputFile:   solution.OutputFileUrl,
			Score:        solution.Score,
			ErrorMessage: solution.ErrorMessage.Ptr(),
		}
	}

	return &SubmissionResponse{
		ID:         submission.ID,
		CreatedAt:  submission.CreatedAt,
		TotalScore: totalScore,
		Solutions:  solutions,
	}
}

func NewSubmissionListResponse(submissions []*domain.Submission) []render.Renderer {
	list := []render.Renderer{}
	for _, submission := range submissions {
		list = append(list, NewSubmissionResponse(submission))
	}
	return list
}

func SubmitSolution(w http.ResponseWriter, r *http.Request) {
	// Maximum upload of 300 MB files
	err := r.ParseMultipartForm(300 << 20)
	if err != nil {
		slog.Error("Error parsing multipart form when submitting solution", "error", err.Error())
		render.Render(w, r, util.ErrorBadRequest(err, nil))
		return
	}

	challengeIdString := r.FormValue("challengeId")
	challengeId, err := strconv.ParseUint(challengeIdString, 10, 0)
	if err != nil {
		msg := "Invalid challengeId"
		render.Render(w, r, util.ErrorUnprocessableContent(err, &msg))
		return
	}
	inputFileNames := r.MultipartForm.Value["input"]
	outputFiles := r.MultipartForm.File["output"]

	solutions := make([]app.Solution, len(outputFiles))

	for index, outputFileHandle := range outputFiles {
		outputFile, err := outputFileHandle.Open()
		defer outputFile.Close()
		if err != nil {
			errorMessage := fmt.Sprintf("Invalid output file %s", outputFileHandle.Filename)
			render.Render(w, r, util.ErrorBadRequest(err, &errorMessage))
			return
		}
		solutions[index] = app.Solution{
			InputFileName:         inputFileNames[index],
			OutputFile:            outputFile,
			OutputFileName:        outputFileHandle.Filename,
			OutputFileContentType: outputFileHandle.Header.Get("Content-Type"),
		}
	}

	application := r.Context().Value("app").(*app.Application)
	authUser := r.Context().Value("authUser").(*domain.User)
	submission, err := application.SubmitSolution(authUser.ID, uint(challengeId), solutions)

	if err != nil {
		slog.Error("Error submiting solution", "error", err.Error())
		errorMessage := err.Error()
		render.Render(w, r, util.ErrorBadRequest(err, &errorMessage))
		return
	}
	render.Status(r, 200)
	render.Render(w, r, NewSubmissionResponse(&submission))
	return
}

func FetchSolutions(w http.ResponseWriter, r *http.Request) {
	challengeIdString := r.URL.Query().Get("challengeId")
	challengeId, err := strconv.ParseUint(challengeIdString, 10, 0)
	if err != nil {
		msg := "Invalid challengeId"
		render.Render(w, r, util.ErrorUnprocessableContent(err, &msg))
		return
	}

	application := r.Context().Value("app").(*app.Application)
	authUser := r.Context().Value("authUser").(*domain.User)

	challengeRepo := application.ChallengeRepo
	challenge := challengeRepo.GetById(uint(challengeId))

	if challenge == nil {
		errorMessage := "Challenge not found"
		render.Render(w, r, util.ErrorNotFound(errors.New("Challenge not found"), &errorMessage))
		return
	}

	submissionRepo := application.SubmissionRepo
	submissions := submissionRepo.Fetch(&authUser.ID, &challenge.ID)

	render.Status(r, 200)
	if err := render.RenderList(w, r, NewSubmissionListResponse(submissions)); err != nil {
		slog.Error("Unable to render response for fetch submissions", "error", err.Error())
		panic(err.Error())
	}
	return

}
