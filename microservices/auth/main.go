// Package classification Account API.
//
// this is to show how to write RESTful APIs in golang.
// that is to provide a detailed overview of the language specs
//

package main

import (
	"fmt"
	"net/http"
	"os"
	"main/controllers"
	l "main/logger"
	"main/models"
	u "main/utils"

	"go.uber.org/zap"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

// Error response
// swagger:response errorResponse
type errorResponse struct {
	// in:body
	Body struct {
		status   int
		response interface{}
	}
}

// Success login
// swagger:response successLogin
type successLogin struct {
	// in:body
	Body struct {
		status   int
		response models.User
	}
}

// Success CheckAuth
// swagger:response successCheckAuth
type successCheckAuth struct {
	// in:body
	Body struct {
		status   int
		response controllers.CheckAuthResponse
	}
}

var logger = l.CreateLogger("auth-error", zap.ErrorLevel)

func handleError(w http.ResponseWriter, err error) {
	// w.WriteHeader(http.StatusIntervalServerError)
	fmt.Fprintf(w, err.Error())
}

func main() {
	e := godotenv.Load()

	if e != nil {
		fmt.Print(e)
	}

	jwtSecret := os.Getenv("jwtSecret")

	var jwtMiddleware = jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		},
		SigningMethod: jwt.SigningMethodHS256,
		ErrorHandler: func(w http.ResponseWriter, r *http.Request, err string) {
			logData := fmt.Sprintf(`"URL": "%s", "CheckAuthFail": "", "TOKEN": "%s", "RESPONCE": "%s", "STATUS CODE": %d`, r.URL.Path, r.Header.Get("Authorization"), err, http.StatusUnauthorized)
			logger.Error(logData)
			u.Respond(w, u.Message(http.StatusUnauthorized, err))

			l.AddRecordToElasticServer("info", "{"+logData+"}")
		},
	})

	r := mux.NewRouter()

	r.Handle("/login", controllers.Login).Methods("POST")
	r.Handle("/test", controllers.Test).Methods("GET")
	r.Handle("/health/check", controllers.Check).Methods("GET")
	r.Handle("/checkAuth", jwtMiddleware.Handler(controllers.CheckAuth)).Methods("POST")

	cors := cors.Default().Handler(r)

	http.ListenAndServe(":3000", cors)
}
