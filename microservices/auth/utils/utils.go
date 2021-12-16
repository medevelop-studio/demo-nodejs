package utils

import (
	"encoding/json"
	"net/http"
)

func Message(status int, response interface{}) map[string]interface{} {
	return map[string]interface{}{"status": status, "response": response}
}

func Respond(w http.ResponseWriter, data map[string]interface{}) {
	w.Header().Add("Content-Type", "application/json")
	status := data["status"].(int)
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
