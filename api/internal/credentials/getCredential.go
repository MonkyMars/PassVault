package credentials

import (
	"encoding/json"
	"net/http"
	"passvault/db"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// GetCredential retrieves a single credential by ID
func GetCredential(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid credential ID", http.StatusBadRequest)
		return
	}

	// Get the global database connection
	database := db.GetDB()
	if database == nil {
		http.Error(w, "Database not initialized", http.StatusInternalServerError)
		return
	}

	// Get credential from database
	credential, err := db.GetCredential(database, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// Return credential
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(credential)
}

// GetAllCredentials retrieves all credentials
func GetAllCredentials(w http.ResponseWriter, r *http.Request) {
	// Get the global database connection
	database := db.GetDB()
	if database == nil {
		http.Error(w, "Database not initialized", http.StatusInternalServerError)
		return
	}

	// Get all credentials from database
	credentials, err := db.GetAllCredentials(database)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return credentials
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(credentials)
}

// DeleteCredential deletes a credential by ID
func DeleteCredential(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid credential ID", http.StatusBadRequest)
		return
	}

	// Get the global database connection
	database := db.GetDB()
	if database == nil {
		http.Error(w, "Database not initialized", http.StatusInternalServerError)
		return
	}

	// Delete credential from database
	if err := db.DeleteCredential(database, id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Credential deleted successfully",
	})
}
