package auth

import (
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/Volomn/mock_code/backend/app"
	domain "github.com/Volomn/mock_code/backend/domain/models"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"github.com/golang-jwt/jwt"
	"github.com/spf13/viper"
	"golang.org/x/exp/slog"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

type AuthenticateAdminRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (a *AuthenticateAdminRequest) Bind(r *http.Request) error {
	return nil
}

func getAccessToken(user domain.User, authMethod string) (string, error) {
	tokenAuth := jwtauth.New("HS256", []byte(viper.GetString("AUTH_SECRET_KEY")), nil)
	_, tokenString, err := tokenAuth.Encode(map[string]interface{}{"isAdmin": false, "authId": user.ID, "exp": time.Now().UTC().Add(24 * time.Hour), "authMethod": authMethod})
	return tokenString, err

}

func generateOauthSecret(extra string) (string, error) {
	oauthStateSecretKey := viper.GetString("OAUTH_STATE_SECRET_KEY")
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"extra": extra,
		"sub":   "mock_code_api",
		// "exp":   time.Now().UTC().Add(5 * time.Minute),
	})
	return token.SignedString([]byte(oauthStateSecretKey))
}

func GetGoogleAuthorizationURL(w http.ResponseWriter, r *http.Request) {
	oauthConf := oauth2.Config{
		ClientID:     viper.GetString("GOOGLE_CLIENT_ID"),
		ClientSecret: viper.GetString("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  viper.GetString("GOOGLE_REDIRECT_URL"),
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}
	query := r.URL.Query()
	oauthState, oauthTokenStringError := generateOauthSecret(query.Encode())
	if oauthTokenStringError != nil {
		render.Status(r, 400)
		render.JSON(w, r, map[string]string{"msg": oauthTokenStringError.Error()})
		return
	}

	URL, err := url.Parse(oauthConf.Endpoint.AuthURL)
	if err != nil {
		slog.Error("Parse: " + err.Error())
	}
	parameters := url.Values{}
	parameters.Add("client_id", oauthConf.ClientID)
	parameters.Add("scope", strings.Join(oauthConf.Scopes, " "))
	parameters.Add("redirect_uri", oauthConf.RedirectURL)
	parameters.Add("response_type", "code")
	parameters.Add("state", oauthState)
	slog.Info("Parameters", "key", parameters.Encode())
	URL.RawQuery = parameters.Encode()
	url := URL.String()
	slog.Info("url", "url", url)
	render.JSON(w, r, map[string]string{"to": url})
	return
}

func SignUpOrLoginWithGoogle(w http.ResponseWriter, r *http.Request) {
	oauthState := r.FormValue("state")

	token, err := jwt.Parse(oauthState, func(token *jwt.Token) (interface{}, error) {
		return []byte(viper.GetString("OAUTH_STATE_SECRET_KEY")), nil
	})
	if err != nil {
		slog.Info("Error parsing token", "error", err.Error())
		render.Status(r, 400)
		render.JSON(w, r, map[string]string{"msg": "Invalid state"})
		return
	}
	if !token.Valid {
		slog.Info("Invalid token", "error", err.Error())
		render.Status(r, 401)
		render.JSON(w, r, map[string]string{"msg": "Invalid state"})
		return
	}

	oauthCode := r.FormValue("code")
	slog.Info("Application", "app", r.Context().Value("app"))
	application := r.Context().Value("app").(*app.Application)
	slog.Info("Application", "application", application)

	user, err := application.SignupOrSignInWithGoogle(oauthCode)
	if err != nil {
		render.Status(r, 401)
		render.JSON(w, r, map[string]string{"msg": "Unauthorized"})
		return
	}
	accessToken, accessTokenError := getAccessToken(user, "google")
	if accessTokenError != nil {
		render.Status(r, 401)
		render.JSON(w, r, map[string]string{"msg": "Unauthorized"})
		return
	}
	render.Status(r, 200)
	render.JSON(w, r, map[string]string{"token": accessToken, "token_type": "Bearer"})
	return
}

func GetGithubAuthorizationURL(w http.ResponseWriter, r *http.Request) {
	oauthConf := oauth2.Config{
		ClientID:     viper.GetString("GITHUB_CLIENT_ID"),
		ClientSecret: viper.GetString("GITHUB_CLIENT_SECRET"),
		RedirectURL:  viper.GetString("GITHUB_REDIRECT_URL"),
		Scopes:       []string{"user"},
		Endpoint: oauth2.Endpoint{
			AuthURL:   "https://github.com/login/oauth/authorize",
			TokenURL:  "https://github.com/login/oauth/access_token",
			AuthStyle: oauth2.AuthStyleInParams,
		},
	}
	query := r.URL.Query()
	oauthState, oauthTokenStringError := generateOauthSecret(query.Encode())
	if oauthTokenStringError != nil {
		render.Status(r, 400)
		render.JSON(w, r, map[string]string{"msg": oauthTokenStringError.Error()})
		return
	}

	URL, err := url.Parse(oauthConf.Endpoint.AuthURL)
	if err != nil {
		slog.Error("Parse: " + err.Error())
	}
	parameters := url.Values{}
	parameters.Add("client_id", oauthConf.ClientID)
	parameters.Add("scope", strings.Join(oauthConf.Scopes, " "))
	parameters.Add("redirect_uri", oauthConf.RedirectURL)
	parameters.Add("response_type", "code")
	parameters.Add("state", oauthState)
	slog.Info("Parameters", "key", parameters.Encode())
	URL.RawQuery = parameters.Encode()
	url := URL.String()
	slog.Info("url", "url", url)
	render.JSON(w, r, map[string]string{"to": url})
	return
}

func SignUpOrLoginWithGithub(w http.ResponseWriter, r *http.Request) {
	oauthState := r.FormValue("state")

	token, err := jwt.Parse(oauthState, func(token *jwt.Token) (interface{}, error) {
		return []byte(viper.GetString("OAUTH_STATE_SECRET_KEY")), nil
	})
	if err != nil {
		slog.Info("Error parsing token", "error", err.Error())
		render.Status(r, 400)
		render.JSON(w, r, map[string]string{"msg": "Invalid state"})
		return
	}
	if !token.Valid {
		slog.Info("Invalid token", "error", err.Error())
		render.Status(r, 401)
		render.JSON(w, r, map[string]string{"msg": "Invalid state"})
		return
	}

	oauthCode := r.FormValue("code")
	slog.Info("Application", "app", r.Context().Value("app"))
	application := r.Context().Value("app").(*app.Application)
	slog.Info("Application", "application", application)

	user, err := application.SignupOrSignInWithGithub(oauthCode)
	if err != nil {
		render.Status(r, 401)
		render.JSON(w, r, map[string]string{"msg": "Unauthorized"})
		return
	}
	accessToken, accessTokenError := getAccessToken(user, "github")
	if accessTokenError != nil {
		render.Status(r, 401)
		render.JSON(w, r, map[string]string{"msg": "Unauthorized"})
		return
	}
	render.Status(r, 200)
	render.JSON(w, r, map[string]string{"token": accessToken, "token_type": "Bearer"})
	return
}

func AuthenticateAdmin(w http.ResponseWriter, r *http.Request) {
	data := &AuthenticateAdminRequest{}
	if err := render.Bind(r, data); err != nil {
		slog.Info("binding input data failed", "error", err.Error())
		render.Status(r, 422)
		render.JSON(w, r, map[string]string{"msg": fmt.Sprintf("Invalid request payload, %s", err.Error())})
		return
	}

	application := r.Context().Value("app").(*app.Application)
	adminiRepo := application.AdminRepo
	admin := adminiRepo.GetAdminByEmail(data.Email)
	if admin == nil {
		render.Status(r, 422)
		render.JSON(w, r, map[string]string{"msg": fmt.Sprintf("Invalid login credentials")})
		return
	}
	if app.IsPasswordMatch(data.Password, admin.Password) == false {
		render.Status(r, 422)
		render.JSON(w, r, map[string]string{"msg": fmt.Sprintf("Invalid login credentials")})
		return
	}
	tokenAuth := jwtauth.New("HS256", []byte(viper.GetString("AUTH_SECRET_KEY")), nil)
	_, tokenString, err := tokenAuth.Encode(map[string]interface{}{"isAdmin": true, "authId": admin.ID, "exp": time.Now().UTC().Add(24 * time.Hour)})
	if err != nil {
		slog.Error("Error creating admin access token", "error", err.Error())
		render.Status(r, 422)
		render.JSON(w, r, map[string]string{"msg": fmt.Sprintf("Invalid login credentials")})
		return
	}
	render.Status(r, 200)
	render.JSON(w, r, map[string]string{"tokenType": "Bearer", "accessToken": tokenString})
	return

}
