package app

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/Volomn/mock_code/backend/app/repository"
	domain "github.com/Volomn/mock_code/backend/domain/models"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
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
	db            *gorm.DB
	UserRepo      *repository.UserRepo
	AdminRepo     *repository.AdminRepo
	ChallengeRepo *repository.ChallengeRepo
}

func NewApplication(db *gorm.DB) *Application {
	return &Application{
		db:            db,
		UserRepo:      repository.NewUserRepository(db),
		AdminRepo:     repository.NewAdminRepository(db),
		ChallengeRepo: repository.NewChallengeRepository(db),
	}
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func IsPasswordMatch(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
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
		existingUser := application.UserRepo.GetUserByEmail(googleUser.Email)
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
		application.UserRepo.SaveUser(&user)
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
		existingUser := application.UserRepo.GetUserByEmail(githubUser.Email)
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
		application.UserRepo.SaveUser(&user)
		return user, nil
	}
}

func (application *Application) CreateAdmin(firstName string, lastName string, email string, password string) (domain.Admin, error) {
	existingAdmin := application.AdminRepo.GetAdminByEmail(strings.ToLower(email))
	if existingAdmin != nil {
		slog.Error("Admin already exists", "email", strings.ToLower(email))
		return domain.Admin{}, errors.New("Admin already exists")
	}

	password, err := hashPassword(password)
	if err != nil {
		slog.Error("Hashing password error", "error", err.Error())
		return domain.Admin{}, err
	}
	admin := domain.Admin{
		FirstName: firstName,
		LastName:  lastName,
		Email:     email,
		Password:  password,
	}
	application.AdminRepo.SaveAdmin(&admin)
	return admin, nil
}

func (application *Application) AddChallenge(adminId uint, name string, problemStatement string, judge string) (domain.Challenge, error) {
	admin := application.AdminRepo.GetById(adminId)
	if admin == nil {
		return domain.Challenge{}, errors.New("Admin not found")
	}

	existingChallenge := application.ChallengeRepo.GetByName(name)
	if existingChallenge != nil {
		return domain.Challenge{}, errors.New("Challenge already exists")
	}
	challenge := domain.Challenge{
		Name:             name,
		ProblemStatement: problemStatement,
		Judge:            judge,
		OpenedAt:         null.NewTime(time.Time{}, false),
		InputFile:        null.NewString("", false),
	}
	application.ChallengeRepo.SaveChallenge(&challenge)
	return challenge, nil
}

func (application *Application) AddChallengeInputFile(adminId uint, challengeId uint, inputFile io.Reader, filename string, contentType string) (domain.Challenge, error) {
	admin := application.AdminRepo.GetById(adminId)
	if admin == nil {
		return domain.Challenge{}, errors.New("Admin not found")
	}
	challenge := application.ChallengeRepo.GetById(challengeId)
	if challenge == nil {
		return domain.Challenge{}, errors.New("Challenge not found")
	}

	sess, err := session.NewSessionWithOptions(session.Options{
		Profile: "default",
		Config: aws.Config{
			Region:      aws.String(viper.GetString(("AWS_REGION"))),
			Credentials: credentials.NewStaticCredentials(viper.GetString("AWS_ACCESS_KEY_ID"), viper.GetString("AWS_SECRET_ACCESS_KEY"), ""),
		},
	})

	if err != nil {
		slog.Error("Failed to initialize new aws session", "error", err)
		return domain.Challenge{}, errors.New(err.Error())
	}

	var fileContent []byte
	_, err = inputFile.Read(fileContent)

	if err != nil {
		slog.Error("Error reading input file", "error", err.Error())
	}

	uploadParams := s3manager.UploadInput{
		ACL:                aws.String("public-read"),
		Bucket:             aws.String(viper.GetString("AWS_S3_BUCKET")),
		Body:               bytes.NewReader(fileContent),
		Key:                aws.String(fmt.Sprintf("%s/%s/%s/%s", "challenges", challenge.Name, "input", filename)),
		ContentDisposition: aws.String("attachment"),
		ContentType:        aws.String(contentType),
	}

	uploader := s3manager.NewUploader(sess)

	// Perform an upload.
	result, err := uploader.Upload(&uploadParams)

	if err != nil {
		slog.Error("Input file upload failed", "error", err.Error())
		return domain.Challenge{}, err
	}

	slog.Info("Input file uploaded successfully", "location", result.Location)
	challenge.InputFile = null.NewString(result.Location, true)
	application.ChallengeRepo.SaveChallenge(challenge)
	return *challenge, nil
}

func (application *Application) OpenChallenge() (domain.Challenge, error) {
	return domain.Challenge{}, nil
}

func (application *Application) CloseChallenge() (domain.Challenge, error) {
	return domain.Challenge{}, nil
}
