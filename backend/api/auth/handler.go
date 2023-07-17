package auth

import (
	"net/http"
	"net/url"
	"strings"

	"github.com/Volomn/mock_code/backend/app"
	"github.com/go-chi/render"
	"github.com/golang-jwt/jwt"
	"github.com/spf13/viper"
	"golang.org/x/exp/slog"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func GetGoogleAuthorizationURL(w http.ResponseWriter, r *http.Request) {
	oauthStateSecretKey := viper.GetString("OAUTH_STATE_SECRET_KEY")
	oauthConf := oauth2.Config{
		ClientID:     viper.GetString("GOOGLE_CLIENT_ID"),
		ClientSecret: viper.GetString("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  "http://localhost:6005/api/auth/google",
		Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"},
		Endpoint:     google.Endpoint,
	}
	query := r.URL.Query()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"extra": query.Encode(),
		"sub":   "mock_code_api",
		// "exp":   time.Now().UTC().Add(5 * time.Minute),
	})
	oauthState, oauthTokenStringError := token.SignedString([]byte(oauthStateSecretKey))
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

func LoginWithGoogle(w http.ResponseWriter, r *http.Request) {
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

	if err := application.SignupOrSignInWithGoogle(oauthCode); err != nil {
		render.Status(r, 401)
		render.JSON(w, r, map[string]string{"msg": "Unauthorized"})
		return
	}

}
