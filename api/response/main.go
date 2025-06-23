package response

import (
	"encoding/json"
	"net/http"
)

func SuccessResponse(r *http.ResponseWriter, data any) {
	(*r).Header().Set("Content-Type", "application/json")
	(*r).WriteHeader(http.StatusOK)
	if data != nil {
		if err := json.NewEncoder(*r).Encode(data); err != nil {
			http.Error(*r, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

func ErrorResponse(r *http.ResponseWriter, statusCode int, message string) {
	(*r).Header().Set("Content-Type", "application/json")
	(*r).WriteHeader(statusCode)
	errorResponse := map[string]string{"error": message}
	if err := json.NewEncoder(*r).Encode(errorResponse); err != nil {
		http.Error(*r, "Failed to encode error response", http.StatusInternalServerError)
	}
}

func NotFoundResponse(r *http.ResponseWriter, message string) {
	ErrorResponse(r, http.StatusNotFound, message)
}

func BadRequestResponse(r *http.ResponseWriter, message string) {
	ErrorResponse(r, http.StatusBadRequest, message)
}