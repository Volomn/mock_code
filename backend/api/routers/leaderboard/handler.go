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
}

type LeaderboardItemResponse struct {
	ID              uint
	UserID          uint
	SubmissionScore float32
	Email           string
	FirstName       string
	LastName        string
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
	db.Table("submissions").
		Select("submissions.id, submissions.user_id, SUM(solutions.score) as submission_score, users.email, users.first_name, users.last_name").
		Joins("JOIN users ON submissions.user_id = users.id").
		Joins("JOIN solutions ON submissions.id = solutions.submission_id").
		Where("challenge_id = ?", challengeId).
		Group("submissions.id, submissions.user_id, users.email, users.first_name, users.last_name").
		Order("submission_score DESC").
		Scan(&results)

	render.Status(r, 200)
	render.RenderList(w, r, NewLeaderboardItemListResponse(results))
	return

}
