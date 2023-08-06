package leaderboard

import (
	"net/http"
	"strconv"

	"github.com/Volomn/mock_code/backend/api/util"
	"github.com/go-chi/render"
	"gorm.io/gorm"
)

type LeaderboardItem struct {
	ID              uint
	UserID          uint
	SubmissionScore float32
	Email           string
	FirstName       string
	LastName        string
	SubmittedAt     string
}

type LeaderboardItemResponse struct {
	ID              uint    `json:"id"`
	UserID          uint    `json:"userId"`
	SubmissionScore float32 `json:"submissionScore"`
	Email           string  `json:"email"`
	FirstName       string  `json:"firstName"`
	LastName        string  `json:"lastName"`
	SubmittedAt     string  `json:"submittedAt"`
}

func (rd *LeaderboardItemResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewLeaderboardItemResponse(item *LeaderboardItem) *LeaderboardItemResponse {
	return &LeaderboardItemResponse{
		ID:              item.ID,
		UserID:          item.UserID,
		SubmissionScore: item.SubmissionScore,
		Email:           item.Email,
		FirstName:       item.FirstName,
		LastName:        item.LastName,
		SubmittedAt:     item.SubmittedAt,
	}
}

func NewLeaderboardItemListResponse(items []*LeaderboardItem) []render.Renderer {
	list := []render.Renderer{}
	for _, item := range items {
		list = append(list, NewLeaderboardItemResponse(item))
	}
	return list
}

func GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	challengeIdString := r.URL.Query().Get("challengeId")
	challengeId, err := strconv.ParseUint(challengeIdString, 10, 0)
	if err != nil {
		msg := "Invalid challengeId"
		render.Render(w, r, util.ErrorUnprocessableContent(err, &msg))
		return
	}

	var results []*LeaderboardItem

	db := r.Context().Value("db").(*gorm.DB)

	db.Table("users").
		Select(`
		DISTINCT ON (user_id)
		users.email,
		users.first_name,
		users.last_name,
		users_submissions.user_id,
		users_submissions.submission_id as id, 
		users_submissions.submitted_at, 
		users_submissions.highest_score as submission_score,
		users_submissions.challenge_id as challenge_id
	`).
		Joins(`
		JOIN(
			SELECT
				submissions.id as submission_id, 
				submissions.user_id, 
				submissions.challenge_id,
				solution_scores.score_sum as highest_score, 
				submissions.created_at as submitted_at 
			FROM submissions
			JOIN (
				SELECT solutions.submission_id, SUM(solutions.score) as score_sum
				FROM solutions
				GROUP BY solutions.submission_id
			) as solution_scores ON submissions.id = solution_scores.submission_id
			order by highest_score desc, submitted_at asc 
		) as users_submissions on users.id = users_submissions.user_id
	`).
		Where("challenge_id = ?", challengeId).
		Scan(&results)

	render.Status(r, 200)
	render.RenderList(w, r, NewLeaderboardItemListResponse(results))
	return

}
