package app

import (
	"encoding/json"
	"errors"
	"fmt"
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

func (application *Application) SignupOrSignInWithGoogle(code string) (domain.User, error) {
	if code == "" {
		slog.Info("Oauth code not found")
		return domain.User{}, errors.New("Invalid authorization code")
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
			return domain.User{}, errors.New("")
		}

		slog.Info("TOKEN>> AccessToken>> " + token.AccessToken)
		slog.Info("TOKEN>> Expiration Time>> " + token.Expiry.String())
		slog.Info("TOKEN>> RefreshToken>> " + token.RefreshToken)

		resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + url.QueryEscape(token.AccessToken))

		if err != nil {
			slog.Error("Get google user details", "error", err.Error())
			return domain.User{}, errors.New("")
		}

		response, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			slog.Error("Read response", "error", err.Error())
			return domain.User{}, errors.New("")
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
			return domain.User{}, errors.New("")
		}

		slog.Info("Google user is", "user", googleUser, "splitName", strings.Split(googleUser.Name, " "))
		existingUser := application.userRepo.GetUserByEmail(googleUser.Email)
		var userPrimaryKey uint

		if existingUser != nil {
			userPrimaryKey = existingUser.ID
		}
		user := domain.User{
			ID:        userPrimaryKey,
			FirstName: null.NewString(strings.Split(googleUser.Name, " ")[0], true),
			LastName:  null.NewString(strings.Split(googleUser.Name, " ")[1], true),
			Email:     googleUser.Email,
		}
		application.userRepo.SaveUser(&user)
		return user, nil
	}
}

func (application *Application) SignupOrSignInWithGithub(code string) (domain.User, error) {
	if code == "" {
		slog.Info("Oauth code not found")
		return domain.User{}, errors.New("Invalid authorization code")
	} else {

		oauthConf := oauth2.Config{
			ClientID:     viper.GetString("GITHUB_CLIENT_ID"),
			ClientSecret: viper.GetString("GITHUB_CLIENT_SECRET"),
			RedirectURL:  "http://localhost:6005/api/auth/github",
			Scopes:       []string{"user"},
			Endpoint: oauth2.Endpoint{
				AuthURL:   "https://github.com/login/oauth/authorize",
				TokenURL:  "https://github.com/login/oauth/access_token",
				AuthStyle: oauth2.AuthStyleInParams,
			},
		}

		token, err := oauthConf.Exchange(oauth2.NoContext, code)
		if err != nil {
			slog.Error("Exchanging github oauth code failed", "error", err.Error())
			return domain.User{}, errors.New("Unable to authenticate user")
		}

		slog.Info("TOKEN>> AccessToken>> " + token.AccessToken)
		slog.Info("TOKEN>> Expiration Time>> " + token.Expiry.String())

		// Get request to a set URL
		req, reqerr := http.NewRequest(
			"GET",
			"https://api.github.com/user",
			nil,
		)
		if reqerr != nil {
			slog.Error("Error fetching user data", "error", reqerr.Error())
			return domain.User{}, errors.New("Unable to authenticate user")
		}

		// Set the Authorization header before sending the request
		// Authorization: token XXXXXXXXXXXXXXXXXXXXXXXXXXX
		authorizationHeaderValue := fmt.Sprintf("token %s", token.AccessToken)
		req.Header.Set("Authorization", authorizationHeaderValue)

		// Make the request
		resp, resperr := http.DefaultClient.Do(req)
		if resperr != nil {
			slog.Error("Error fetching user data", "error", reqerr.Error())
			return domain.User{}, errors.New("Unable to authenticate user")
		}

		response, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			slog.Error("Read response", "error", err.Error())
			return domain.User{}, errors.New("")
		}

		slog.Info("Github user", "user", response)

		type GithubUser struct {
			Email     string `json:"email"`
			Name      string `json:"name"`
			AvatarURL string `json:"avatar_url"`
		}

		var githubUser GithubUser

		err = json.Unmarshal(response, &githubUser)
		if err != nil {
			slog.Error("Error parsing response", "error", err.Error())
			return domain.User{}, errors.New("")
		}

		slog.Info("Github user is", "user", githubUser, "splitName", strings.Split(githubUser.Name, " "))
		existingUser := application.userRepo.GetUserByEmail(githubUser.Email)
		var userPrimaryKey uint

		if existingUser != nil {
			userPrimaryKey = existingUser.ID
		}
		user := domain.User{
			ID:        userPrimaryKey,
			FirstName: null.NewString(strings.Split(githubUser.Name, " ")[0], true),
			LastName:  null.NewString(strings.Split(githubUser.Name, " ")[1], true),
			Email:     githubUser.Email,
		}
		application.userRepo.SaveUser(&user)
		return user, nil
	}
}
