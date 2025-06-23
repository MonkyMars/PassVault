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

	// Initialize database connection
	database, err := db.Init()
	if err != nil {
		http.Error(w, "Database connection failed: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer database.Close()

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
	// Initialize database connection
	database, err := db.Init()
	if err != nil {
		http.Error(w, "Database connection failed: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer database.Close()

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

	// Initialize database connection
	database, err := db.Init()
	if err != nil {
		http.Error(w, "Database connection failed: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer database.Close()

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
