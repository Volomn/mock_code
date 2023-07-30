package middleware

import (
	"context"
	"net/http"
	"reflect"

	"github.com/Volomn/mock_code/backend/app"
	domain "github.com/Volomn/mock_code/backend/domain/models"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"golang.org/x/exp/slog"
	"gorm.io/gorm"
)

func ApplicationMiddleware(app *app.Application) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := context.WithValue(r.Context(), "app", app)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}

}

func AuthenticationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.WithValue(r.Context(), "authUser", nil)
		db := r.Context().Value("db").(*gorm.DB)
		_, claims, err := jwtauth.FromContext(r.Context())
		if err != nil {
			slog.Error("Error authenticating token", "error", err.Error())
			render.Status(r, 401)
			render.JSON(w, r, map[string]string{"msg": "Unauthorized"})
			return
		}
		slog.Info("Token claims", "claims", claims)
		isAdmin := claims["isAdmin"].(bool)
		authId := claims["authId"].(float64)
		slog.Info("Type of authId is ", "type", reflect.TypeOf(authId))
		if err != nil {
			slog.Error("Error authenticating token", "error", err.Error())
			render.Status(r, 401)
			render.JSON(w, r, map[string]string{"msg": "Unauthorized"})
			return
		}
		if err != nil {
			slog.Error("Error authenticating token", "error", err.Error())
			render.Status(r, 401)
			render.JSON(w, r, map[string]string{"msg": "Unauthorized"})
			return
		}
		if isAdmin == true {
			admin := &domain.Admin{ID: uint(authId)}
			db.First(admin)
			if admin == nil {
				slog.Error("Error authenticating admin token", "adminId", authId, "error", "Admin not found")
				render.Status(r, 401)
				render.JSON(w, r, map[string]string{"msg": "Unauthorized"})
				return
			}
			ctx = context.WithValue(r.Context(), "authAdmin", admin)
		} else {
			user := &domain.User{ID: uint(authId)}
			db.First(user)
			if user == nil {
				slog.Error("Error authenticating user token", "adminId", authId, "error", "User not found")
				render.Status(r, 401)
				render.JSON(w, r, map[string]string{"msg": "Unauthorized"})
				return
			}
			ctx = context.WithValue(r.Context(), "authUser", user)
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func AuthorizationMiddleWare(allowUser bool, allowAdmin bool) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authUser := r.Context().Value("authUser")
			authAdmin := r.Context().Value("authADmin")
			if allowUser == false && authUser != nil {
				slog.Error("User not allowed")
				render.Status(r, 403)
				render.JSON(w, r, map[string]string{"msg": "Forbidden"})
				return
			}
			if allowAdmin == false && authAdmin != nil {
				slog.Error("Admin not allowed")
				render.Status(r, 403)
				render.JSON(w, r, map[string]string{"msg": "Forbidden"})
				return
			}
			next.ServeHTTP(w, r)
		})
	}

}
