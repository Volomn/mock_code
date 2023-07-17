package app

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"

	"github.com/Volomn/mock_code/backend/app/repository"
	domain "github.com/Volomn/mock_code/backend/domain/models"
	"github.com/spf13/viper"
	"golang.org/x/exp/slog"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gopkg.in/guregu/null.v4"
	"gorm.io/gorm"
)

var (
	AuthorizationDeniedError = errors.New("Authorization Denied")
)

type ApplicationInterface interface {
	SignupOrSignInWithGoogle(code string)
}

type Application struct {
	db       *gorm.DB
	userRepo *repository.UserRepo
}

func NewApplication(db *gorm.DB) *Application {
	return &Application{
		db:       db,
		userRepo: repository.NewUserRepository(db),
	}
}

func (application *Application) SignupOrSignInWithGoogle(code string) error {
	if code == "" {
		slog.Info("Oauth code not found")
		return errors.New("Invalid authorization code")
	} else {

		oauthConf := oauth2.Config{
			ClientID:     viper.GetString("GOOGLE_CLIENT_ID"),
			ClientSecret: viper.GetString("GOOGLE_CLIENT_SECRET"),
			RedirectURL:  "http://localhost:6005/api/auth/google",
			Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
			Endpoint:     google.Endpoint,
		}

		token, err := oauthConf.Exchange(oauth2.NoContext, code)
		if err != nil {
			slog.Error("Exchanging google oauth code failed", "error", err.Error())
			return errors.New("")
		}

		slog.Info("TOKEN>> AccessToken>> " + token.AccessToken)
		slog.Info("TOKEN>> Expiration Time>> " + token.Expiry.String())
		slog.Info("TOKEN>> RefreshToken>> " + token.RefreshToken)

		resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + url.QueryEscape(token.AccessToken))

		if err != nil {
			slog.Error("Get google user details", "error", err.Error())
			return errors.New("")
		}

		response, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			slog.Error("Read response", "error", err.Error())
			return errors.New("")
		}

		type GoogleUser struct {
			Email         string `json:"email"`
			FamilyName    string `json:"family_name"`
			GivenName     string `json:"given_name"`
			Hd            string `json:"hd"`
			Id            string `json:"id"`
			Locale        string `json:"locale"`
			Name          string `json:"name"`
			Picture       string `json:"picture"`
			VerifiedEmail bool   `json:"verified_email"`
		}

		var googleUser GoogleUser

		err = json.Unmarshal(response, &googleUser)
		if err != nil {
			slog.Error("Error parsing response", "error", err.Error())
			return errors.New("")
		}

		slog.Info("Google user is", "user", googleUser, "splitName", strings.Split(googleUser.Name, " "))
		existingUser := application.userRepo.GetUserByEmail(googleUser.Email)
		var userPrimaryKey uint

		if existingUser != nil {
			userPrimaryKey = existingUser.ID
		}
		application.userRepo.SaveUser(&domain.User{
			ID:        userPrimaryKey,
			FirstName: null.NewString(strings.Split(googleUser.Name, " ")[0], true),
			LastName:  null.NewString(strings.Split(googleUser.Name, " ")[1], true),
			Email:     googleUser.Email,
		})
		return nil
	}
}
