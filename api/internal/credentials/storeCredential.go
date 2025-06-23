package credentials

import (
	"encoding/json"
	"net/http"
	"passvault/db"
	"passvault/structs"
	"passvault/validate"
)

func StoreCredential(w http.ResponseWriter, r *http.Request) {
	// Parse the request body into a Credential struct
	var credential structs.Credential
	if err := json.NewDecoder(r.Body).Decode(&credential); err != nil {
		http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Validate the request body with the validator package
	if err := validate.NewValidateCredential().Validate(credential); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Initialize database connection
	database, err := db.Init()
	if err != nil {
		http.Error(w, "Database connection failed: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer database.Close()

	// Insert data into the database
	if err := db.InsertCredential(database, credential); err != nil {
		http.Error(w, "Failed to store credential: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Credential stored successfully",
	})
}
