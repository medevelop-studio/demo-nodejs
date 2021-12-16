package controllers

import (
	"encoding/json"
	"fmt"
	l "main/logger"
	"main/models"
	u "main/utils"
	"net/http"
	"strings"
	"time"

	"github.com/IguteChung/go-errors"
	"github.com/dgrijalva/jwt-go"
	"go.uber.org/zap"
)

type CheckAuthResponse struct {
	JwtData interface{}
}

var logger = l.CreateLogger("auth-combined", zap.InfoLevel)
var errLogger = l.CreateLogger("auth-error", zap.ErrorLevel)

func makeTimestamp() int64 {
	return time.Now().UnixNano() / int64(time.Millisecond)
}

// Login handle login
var Login = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	startTime := makeTimestamp()
	r.ParseForm()
	login := r.FormValue("login")
	password := r.FormValue("password")

	ip := models.GetIP(r)
	message, currentUser, stackTrace := models.Login(login, password, ip)

	if currentUser == nil {
		endTime := makeTimestamp()
		logData := fmt.Sprintf(`"URL": "%s", "TOKEN": "%s", "LOGIN": "%s", "RESPONCE": "%s", "STACK TRACE": "%s", "STATUS CODE": %d, "TIME": %d`, r.URL.Path, r.Header.Get("Authorization"), login, message["response"], stackTrace, message["status"].(int), endTime-startTime)
		errLogger.Error(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")
		u.Respond(w, message)
		return
	}

	response := currentUser

	encodedUser, err := json.Marshal(response)
	if err != nil {
		endTime := makeTimestamp()

		logData := fmt.Sprintf(`"URL": "%s", "Error encoding user's data ID": %d, "STACK TRACE": "%s", "TIME": %d`, r.URL.Path, response.ID, errors.StackTrace(err), endTime-startTime)
		errLogger.Error(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")
	}

	endTime := makeTimestamp()

	logData := fmt.Sprintf(`"URL": "%s", "TOKEN": "%s", "LOGIN": "%s", "responce": %s, "STATUSCODE": %d, "TIME": %d`, r.URL.Path, r.Header.Get("Authorization"), login, encodedUser, http.StatusOK, endTime-startTime)
	logger.Info(logData)
	l.AddRecordToElasticServer("info", "{"+logData+"}")

	u.Respond(w, u.Message(http.StatusOK, response))
})

// Test is just for testing
var Test = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("test"))
})

var Check = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	res := models.Check()
	if res == 1 {
		w.WriteHeader(http.StatusOK)

		logData := fmt.Sprintf(`"URL": "%s", "STATUS": "Healthcheck success", "STATUSCODE": %d`, r.URL.Path, http.StatusOK)
		logger.Info(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")
	} else {
		w.WriteHeader(http.StatusServiceUnavailable)
		logData := fmt.Sprintf(`"URL": "%s", "STATUS": "Healthcheck fail", "STATUS CODE": %d`, r.URL.Path, http.StatusServiceUnavailable)
		errLogger.Error(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")
	}
	w.Write([]byte(string(fmt.Sprint(res))))
})

//CheckAuth check jwt token
var CheckAuth = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	startTime := makeTimestamp()
	user := r.Context().Value("user")

	claims, ok := user.(*jwt.Token).Claims.(jwt.MapClaims)

	if !ok {
		logData := fmt.Sprintf(`"URL": "%s", "CheckAuth Fail, TOKEN": "%s", "STATUS CODE": %d`, r.URL.Path, r.Header.Get("Authorization"), http.StatusUnauthorized)
		errLogger.Error(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")

		u.Respond(w, u.Message(http.StatusUnauthorized, "Cannot get valid claims from token."))
		return
	}

	reqToken := strings.Split(r.Header.Get("Authorization"), "Bearer ")[1]

	ip := claims["ip"]
	userID := claims["userId"]
	permissionLevel := claims["permissionLevel"]

	userDBData := &models.User{}
	var authInfo []models.AuthInfo

	err := models.GetDB().Table("user").Where(
		"id = ?", uint(userID.(float64)),
	).First(userDBData).Error

	if err != nil {
		endTime := makeTimestamp()
		logData := fmt.Sprintf(`"URL": "%s", "Fail to get user from DB, TOKEN": "%s", "RESPONSE": "%s", "STACK TRACE": "%s", "STATUS CODE": %d, "TIME": %d`, r.URL.Path, r.Header.Get("Authorization"), "DB connection error. Please retry.", errors.StackTrace(err), http.StatusInternalServerError, endTime-startTime)
		errLogger.Error(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")

		u.Respond(w, u.Message(http.StatusInternalServerError, "DB connection error. Please retry."))
		return
	}

	if userDBData.Status != 1 && userDBData.PermissionLevel == 1 {
		data := []byte(fmt.Sprintf(`{"actionType": 3, "userId": %d, "username": "%s", "userIp": "%s"}`, userDBData.ID, userDBData.Login, ip))
		models.SendLog(data)
		endTime := makeTimestamp()
		logData := fmt.Sprintf(`"URL": "%s", "CheckAuthFail": "", "TOKEN": "%s", "responce": %s, "STATUS CODE": %d, "TIME": %d`, r.URL.Path, r.Header.Get("Authorization"), "DB connection error. Please retry.", http.StatusForbidden, endTime-startTime)
		errLogger.Error(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")
		u.Respond(w, u.Message(http.StatusForbidden, "User has been banned."))
		return
	}

	if time.Now().Unix() > userDBData.ExpirationDate.Add(time.Hour*24).Unix() && userDBData.PermissionLevel == 1 {
		data := []byte(fmt.Sprintf(`{"actionType": 2, "userId": %d, "username": "%s", "ExpirationDate": "%s", "userIp": "%s"}`, userDBData.ID, userDBData.Login, userDBData.ExpirationDate, ip))
		models.SendLog(data)
		endTime := makeTimestamp()
		logData := fmt.Sprintf(`"URL": "%s", "CheckAuthFail": "", "TOKEN": "%s", "responce": %s, "STATUS CODE": %d, "TIME": %d`, r.URL.Path, r.Header.Get("Authorization"), "The license date is expired.", http.StatusNotFound, endTime-startTime)
		errLogger.Error(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")

		u.Respond(w, u.Message(http.StatusNotFound, "The license date is expired."))
		return
	}

	if userDBData.PermissionLevel > 2 {
		response := &models.Token{
			UserID:          uint(userID.(float64)),
			PermissionLevel: int(permissionLevel.(float64)),
		}
		endTime := makeTimestamp()
		logData := fmt.Sprintf(`"URL": "%s", "TOKEN": "%s", "RESPONCE": "%v", "STATUSCODE": %d, "TIME": %d`, r.URL.Path, r.Header.Get("Authorization"), response, http.StatusOK, endTime-startTime)
		logger.Info(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")

		u.Respond(w, u.Message(http.StatusOK, response))
		return
	}

	if userDBData.AuthInfo == "" {
		logData := fmt.Sprintf(`"URL": "%s", "CheckAuthFail, TOKEN": "%s", "responce": "%s", "STATUS CODE": %d"`, r.URL.Path, r.Header.Get("Authorization"), "DB doesn't have enough data.", http.StatusInternalServerError)
		errLogger.Error(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")

		u.Respond(w, u.Message(http.StatusInternalServerError, "DB doesn't have enough data."))
		return
	}

	err = json.Unmarshal([]byte(userDBData.AuthInfo), &authInfo)

	if err != nil {
		logData := fmt.Sprintf(`"URL": "%s", "CheckAuthFail": "", "TOKEN": "%s", "responce": "%s", "STACK TRACE": "%s", "STATUS CODE": %d`, r.URL.Path, r.Header.Get("Authorization"), "Cannot convert string to JSON", errors.StackTrace(err), http.StatusInternalServerError)
		errLogger.Error(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")

		u.Respond(w, u.Message(http.StatusInternalServerError, "Cannot convert string to JSON"))
	}

	for i := range authInfo {
		var isSameToken = false

		if authInfo[i].IP == ip {
			for j := range authInfo[i].Token {
				if reqToken == authInfo[i].Token[j] {
					isSameToken = true
					break
				}
			}

			if isSameToken {
				break
			}
		}

		if i == len(authInfo)-1 {
			logData := fmt.Sprintf(`"URL": "%s", "CheckAuthFail": "", "TOKEN": "%s", "responce": "%s", "STATUS CODE": %d`, r.URL.Path, r.Header.Get("Authorization"), "Invalid user data", http.StatusUnauthorized)
			errLogger.Error(logData)
			l.AddRecordToElasticServer("info", "{"+logData+"}")

			u.Respond(w, u.Message(http.StatusUnauthorized, "Invalid user data"))
			return
		}
	}

	response := &models.Token{
		UserID:          uint(userID.(float64)),
		PermissionLevel: int(permissionLevel.(float64)),
	}

	responseString, err := json.Marshal(response)

	if err == nil {
		logData := fmt.Sprintf(`"URL": "%s", "TOKEN": "%s", "responce": %s, "STATUSCODE": %d`, r.URL.Path, r.Header.Get("Authorization"), responseString, http.StatusOK)
		logger.Info(logData)
		l.AddRecordToElasticServer("info", "{"+logData+"}")
	}

	u.Respond(w, u.Message(http.StatusOK, response))
})
