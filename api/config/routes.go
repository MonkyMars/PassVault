package api

import (
	"net/http"
	"passvault/internal/credentials"

	"github.com/go-chi/chi/v5"
)

// SetupRoutes configures all API routes
func SetupRoutes(app *chi.Mux) {
	// API v1 routes
	app.Route("/api/v1", func(r chi.Router) {
		// Credentials routes
		r.Route("/credentials", func(r chi.Router) {
			r.Post("/", credentials.StoreCredential)     // Create credential
			r.Get("/", credentials.GetAllCredentials)    // Get all credentials
			r.Get("/{id}", credentials.GetCredential)    // Get single credential
			r.Delete("/{id}", credentials.DeleteCredential) // Delete credential
		})
	})
	
	// Health check endpoint
	app.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","message":"PassVault API is running"}`))
	})
}
