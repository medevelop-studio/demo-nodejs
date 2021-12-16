package models

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha512"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	u "main/utils"
	"strconv"
	"strings"
	"time"

	"github.com/IguteChung/go-errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/jinzhu/gorm"
	"golang.org/x/crypto/bcrypt"
)

//Token claims struct
type Token struct {
	UserID          uint
	PermissionLevel int
	jwt.StandardClaims
}

//DisplaySettings struct
type DisplaySettings struct {
	ID                   uint      `json:"id"`
	ColumnsSettings      string    `json:"columnsSettings" gorm:"column:columnsSettings; type: text"`
	RowsPerPage          uint      `json:"rowsPerPage" gorm:"column:rowsPerPage"`
	IsShowingCountryFlag bool      `json:"isShowingCountryFlag" gorm:"column:isShowingCountryFlag"`
	OrderBy              uint      `json:"orderBy" gorm:"column:orderBy"`
	IsOrderingDescending bool      `json:"isOrderingDescending" gorm:"column:isOrderingDescending"`
	CreateDate           time.Time `json:"createDate" gorm:"column:createDate"`
	UpdateDate           time.Time `json:"updateDate" gorm:"column:updateDate"`
	Version              uint      `json:"version"`
}

type AuthInfo struct {
	IP    string   `json:"ip"`
	Token []string `json:"token"`
}

//User a struct to rep user
type User struct {
	ID                     uint            `json:"id" gorm:"uniqueIndex"`
	Login                  string          `json:"login" gorm:"index"`
	Password               string          `json:"password" gorm:"index"`
	Email                  string          `json:"email" gorm:"index"`
	SubID                  string          `json:"subId" gorm:"column:subId; index"`
	ExpirationDate         time.Time       `json:"expirationDate" gorm:"column:expirationDate"`
	Token                  string          `json:"token" gorm:"-"`
	Credits                uint            `json:"credits"`
	PermissionLevel        int             `json:"permissionLevel" gorm:"column:permissionLevel; index"`
	Status                 uint            `json:"status" uint:"status"`
	IsFromOldSystem        bool            `json:"isFromOldSystem" gorm:"column:isFromOldSystem"`
	MaxBcConnections       uint            `json:"maxBcConnections" gorm:"column:maxBcConnections"`
	MaxLeaseCount          uint            `json:"maxLeaseCount" gorm:"column:maxLeaseCount"`
	Comment                string          `json:"comment"`
	AllowedIps             string          `json:"allowedIps" gorm:"column:allowedIps; index"`
	IsSoundsEnable         bool            `json:"isSoundsEnable" gorm:"column:isSoundsEnable"`
	IsShowingUsedColumn    bool            `json:"isShowingUsedColumn" gorm:"column:isShowingUsedColumn"`
	IsIncreasingUseCounter bool            `json:"isIncreasingUseCounter" gorm:"column:isIncreasingUseCounter"`
	IsMultilogining        bool            `json:"isMultilogining" gorm:"column:isMultilogining"`
	DisplaySettingsID      uint            `json:"displaySettingsId" gorm:"column:displaySettingsId"`
	DisplaySettings        DisplaySettings `json:"displaySettings" gorm:"index"`
	CreateDate             time.Time       `json:"createDate" gorm:"column:createDate"`
	UpdateDate             time.Time       `json:"updateDate" gorm:"column:updateDate"`
	Version                uint            `json:"version" gorm:"column:version"`
	BcServerID             uint            `json:"bcServerId" gorm:"column:bcServerId; index"`
	AuthInfo               string          `json:"authInfo" gorm:"column:authInfo; type: text; index"`
	ServerTime             time.Time       `json:"serverTime" gorm:"-"`
}

var passSalt []byte = []byte("b51860aebd60187ba878ae81e7d5b780f0a515b8d329361b9f0cc6e8192ffd89")
var allowedIpsAsSlice []string

type ServingStatus int

const (
	UNKNOWN ServingStatus = iota
	SERVING
	NOT_SERVING
	SERVICE_UNKNOWN
)

// Validate incoming user details...
func (user *User) Validate() (map[string]interface{}, bool) {
	if len(user.Login) < 4 || len(user.Login) > 32 {
		return u.Message(http.StatusForbidden, "Login has invalid length."), false
	}

	if len(user.Password) < 4 {
		return u.Message(http.StatusForbidden, "Password has invalid length"), false
	}

	//Login must be unique
	temp := &User{}

	//check for errors and duplicate logins
	err := GetDB().Table("user").Where("login = ?", user.Login).First(temp).Error

	if err != nil && err != gorm.ErrRecordNotFound {
		return u.Message(http.StatusInternalServerError, "Connection error. Please retry"), false
	}

	if temp.Login != "" {
		return u.Message(http.StatusForbidden, "Login address already in use by another user."), false
	}

	return u.Message(http.StatusOK, "Requirement passed"), true
}

// Create handle Create
func (user *User) Create() map[string]interface{} {
	sig := hmac.New(sha512.New, passSalt)
	sig.Write([]byte(user.Password))
	hashedPassword := base64.StdEncoding.EncodeToString(sig.Sum(nil))
	user.Password = string(hashedPassword)
	user.CreateDate = time.Now()
	user.UpdateDate = time.Now()
	user.Version = 1

	GetDB().Create(user)

	if user.ID <= 0 {
		return u.Message(http.StatusInternalServerError, "Failed to create user, connection error.")
	}

	//Create new JWT token for the newly registered user
	tk := &Token{UserID: user.ID}
	token := jwt.NewWithClaims(jwt.GetSigningMethod("HS256"), tk)
	tokenString, _ := token.SignedString([]byte(os.Getenv("jwtSecret")))
	user.Token = tokenString

	user.Password = "" //delete password

	response := u.Message(http.StatusOK, "User has been created")
	response["user"] = user
	return response
}

// Login handle login
func Login(
	login string,
	password string,
	ip string,
) (map[string]interface{}, *User, string) {
	user := &User{}
	err := GetDB().Preload("DisplaySettings").Table("user").Where("LOWER(login) = LOWER(?)", login).First(user).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound || err.Error() == "record not found" {
			return u.Message(http.StatusNotFound, "Invalid login or password"), nil, errors.StackTrace(err)
		}
		return u.Message(http.StatusInternalServerError, "DB connection error. Please retry. "), nil, errors.StackTrace(err)
	}

	if user.Status != 1 {

		if user.Status == 3 {
			return u.Message(http.StatusNotFound, "Invalid login or password"), nil, ""
		}

		data := []byte(fmt.Sprintf(`{"actionType": 3, "userId": %d, "username": "%s", "userIp": "%s"}`, user.ID, user.Login, ip))
		SendLog(data)
		return u.Message(http.StatusForbidden, "User has been banned."), nil, ""
	}

	var isValid bool

	if user.IsFromOldSystem {
		isValid = ValidHash([]byte(password), []byte(user.Password))
	} else {
		isValid = ValidMAC([]byte(password), []byte(user.Password), passSalt)
	}

	if !isValid {
		data := []byte(fmt.Sprintf(`{"actionType": 4, "userId": %d, "username": "%s", "wrongPassword": "%s", "userIp": "%s"}`, user.ID, user.Login, password, ip))
		SendLog(data)
		return u.Message(http.StatusForbidden, "Invalid login or password. Please try again."), nil, ""
	}

	if time.Now().Unix() > user.ExpirationDate.Add(time.Hour*24).Unix() && user.PermissionLevel == 1 {

		data := []byte(fmt.Sprintf(`{"actionType": 2, "userId": %d, "username": "%s", "ExpirationDate": "%s", "userIp": "%s"}`, user.ID, user.Login, user.ExpirationDate, ip))
		SendLog(data)
		return u.Message(http.StatusNotFound, "The license date is expired."), nil, ""
	}

	var authInfo []AuthInfo
	var updateAuthInfo []AuthInfo

	if user.AuthInfo == "" {
		user.AuthInfo = "[]"
	}

	err = json.Unmarshal([]byte(user.AuthInfo), &authInfo)

	if err != nil {
		return u.Message(http.StatusInternalServerError, "Cannot convert string to JSON"), nil, errors.StackTrace(err)
	}

	token, err := createJwtToken(user.ID, user.PermissionLevel, ip)

	if err != nil {
		return u.Message(http.StatusInternalServerError, "Cannot create JWT token"), nil, errors.StackTrace(err)
	}

	dataForUpdating := make(map[string]interface{})
	user.Token = token

	if user.PermissionLevel < 3 { // For user, admin

		for i, v := range authInfo {
			if ip == v.IP {

				authInfo[i].Token = append(authInfo[i].Token, token)

				if len(authInfo[i].Token) > 3 {
					authInfo[i].Token = authInfo[i].Token[1:]
				}

				if user.IsMultilogining {
					updateAuthInfo = authInfo
				} else {
					updateAuthInfo = append(updateAuthInfo, authInfo[i])
				}

				break
			}

			if !user.IsMultilogining && ip != v.IP {
				InvalidateOldSessions(user.SubID)
			}

			if i == len(authInfo)-1 {
				if user.IsMultilogining {
					updateAuthInfo = append(authInfo, AuthInfo{IP: ip, Token: []string{token}})
				} else {
					updateAuthInfo = append(updateAuthInfo, AuthInfo{IP: ip, Token: []string{token}})
				}
			}
		}

		if len(authInfo) == 0 {
			updateAuthInfo = append(updateAuthInfo, AuthInfo{IP: ip, Token: []string{token}})
		}

		if len(authInfo) > 5 {
			updateAuthInfo = updateAuthInfo[1:]
		}

		jsonOfBytes, err := json.Marshal(updateAuthInfo)

		if err != nil {
			return u.Message(http.StatusInternalServerError, "Cannot covert array of struct to json string."), nil, errors.StackTrace(err)
		}

		convertedAuthInfo := fmt.Sprintf("%+v", string(jsonOfBytes))

		dataForUpdating["authInfo"] = convertedAuthInfo
	}

	allowedIpsAsSlice = strings.Split(user.AllowedIps, ",")
	allowedIpsAsSlice[0] = ip
	user.AllowedIps = strings.Join(allowedIpsAsSlice, ",")

	dataForUpdating["allowedIps"] = user.AllowedIps

	if user.PermissionLevel > 1 { // admin and services
		dataForUpdating["expirationDate"] = time.Now().AddDate(0, 1, 0)
	}

	err = GetDB().Model(user).Where("LOWER(login) = LOWER(?)", login).Updates(dataForUpdating).Error

	if err != nil {
		return u.Message(http.StatusInternalServerError, "Connection error, cannot update auth info. Please retry"), nil, errors.StackTrace(err)
	}

	user.Password = ""
	user.AuthInfo = ""
	user.ServerTime = time.Now()

	data := []byte(fmt.Sprintf(`{"actionType": 1, "userId": %d, "username": "%s", "userIp": "%s"}`, user.ID, user.Login, ip))
	SendLog(data)

	return u.Message(http.StatusOK, "Logged In"), user, ""
}

// Check handle check
func Check() ServingStatus {
	queryResult := &User{}

	err := GetDB().Select("1").Table("user").First(queryResult).Error

	if err != nil {
		return NOT_SERVING
	}

	return SERVING
}

// ValidMAC reports whether messageMAC is a valid HMAC tag for message.
func ValidMAC(message, messageMAC, key []byte) bool {
	mac := hmac.New(sha512.New, key)
	mac.Write(message)
	expectedMAC := []byte(base64.StdEncoding.EncodeToString(mac.Sum(nil)))
	return hmac.Equal(messageMAC, expectedMAC)
}

// ValidHash reports whether password is valid for user from old system (using bCrypt).
func ValidHash(password []byte, hash []byte) bool {
	err := bcrypt.CompareHashAndPassword(hash, password)
	return err == nil
}

//InvalidateOldSessions invalidates old sessions for user with disabled multilogin
func InvalidateOldSessions(userUUID string) {

	data := []byte(fmt.Sprintf(`{"userUUID": "%s", "type": 1}`, userUUID))
	client := &http.Client{}

	r, err := http.NewRequest("POST", "http://activation:8080/socket/invalidateSession/", bytes.NewBuffer(data))

	if err != nil {
		fmt.Print(err)
		return
	}

	userID, err := strconv.ParseUint(os.Getenv("serviceUserID"), 10, 32)
	if err != nil {
		return
	}
	userIDuint := uint(userID)

	permissionLevel, err := strconv.ParseInt(os.Getenv("serviceUserPermissionLevel"), 10, 32)
	if err != nil {
		return
	}

	permissionLevelInt := int(permissionLevel)

	token, err := createJwtToken(userIDuint, permissionLevelInt, "127.0.0.1")

	if err != nil {
		return
	}

	r.Header.Add("Content-Type", "application/json")
	r.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))

	res, err := client.Do(r)

	if err != nil {
		fmt.Print(err)
		return
	}

	defer res.Body.Close()
}

//SendLog sends log data to UserService
func SendLog(data []byte) {
	client := &http.Client{}

	r, err := http.NewRequest("POST", "http://user:8080/user/writeLog/", bytes.NewBuffer(data))

	if err != nil {
		return
	}

	userID, err := strconv.ParseUint(os.Getenv("serviceUserID"), 10, 32)
	if err != nil {
		return
	}
	userIDuint := uint(userID)

	permissionLevel, err := strconv.ParseInt(os.Getenv("serviceUserPermissionLevel"), 10, 32)
	if err != nil {
		return
	}

	permissionLevelInt := int(permissionLevel)

	token, err := createJwtToken(userIDuint, permissionLevelInt, "127.0.0.1")

	if err != nil {
		return
	}

	r.Header.Add("Content-Type", "application/json")
	r.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))

	res, err := client.Do(r)

	if err != nil {
		return
	}

	defer res.Body.Close()
}

// Generate and return JWT token based on id, permission level, expired time, ip
func createJwtToken(
	userID uint,
	permissionLevel int,
	ip string,
) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["userId"] = userID
	claims["permissionLevel"] = permissionLevel
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()
	claims["ip"] = ip

	jwtSecret := os.Getenv("jwtSecret")

	tokenString, err := token.SignedString([]byte(jwtSecret))

	if err != nil {
		return "", errors.New(err.Error())
	}

	return tokenString, nil
}

//GetIP returns IP of http request
func GetIP(r *http.Request) string {
	var ipAddress string

	fwdAddress := r.Header.Get("X-Forwarded-For")

	if fwdAddress != "" {
		ipAddress = fwdAddress
		ips := strings.Split(fwdAddress, ",")

		ipAddress = ips[0]
	}

	if ipAddress == "" {
		ipAddress = r.Header.Get("X-Real-Ip")
	}

	if ipAddress == "" {
		ipAddress = r.RemoteAddr
	}

	return ipAddress
}
