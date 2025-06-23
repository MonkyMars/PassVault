package api

import (
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/chi/v5"	
)

// Middleware sets up the middleware for the API server.
func Middleware(app *chi.Mux) {
	// Set up middleware for the API server
	app.Use(middleware.Logger) // Log every request
	app.Use(middleware.Recoverer) // Recover from panics and log them
	app.Use(middleware.Timeout(20)) // Set a timeout for requests
	app.Use(middleware.CleanPath) // Clean the URL path
	app.Use(middleware.RedirectSlashes) // Redirect slashes in URLs
	app.Use(middleware.AllowContentType("application/json")) // Allow only JSON content type
	app.Use(middleware.NoCache) // Disable caching
	app.Use(middleware.RequestID) // Generate a unique request ID for each request
	app.Use(middleware.RealIP) // Get the real IP address of the client
	app.Use(middleware.StripSlashes) // Strip trailing slashes from URLs
	app.Use(middleware.URLFormat) // Format URLs
}