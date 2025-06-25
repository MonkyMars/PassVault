package api

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

// Middleware sets up the middleware for the API server.
func Middleware(app *chi.Mux) {
	// Set up middleware for the API server
	app.Use(middleware.Logger)                               // Log every request
	app.Use(middleware.Recoverer)                            // Recover from panics and log them
	app.Use(middleware.Timeout(20))                          // Set a timeout for requests
	app.Use(middleware.CleanPath)                            // Clean the URL path
	app.Use(middleware.RedirectSlashes)                      // Redirect slashes in URLs
	app.Use(middleware.AllowContentType("application/json")) // Allow only JSON content type
	app.Use(middleware.NoCache)                              // Disable caching
	app.Use(middleware.RequestID)                            // Generate a unique request ID for each request
	app.Use(middleware.RealIP)                               // Get the real IP address of the client
	app.Use(middleware.StripSlashes)                         // Strip trailing slashes from URLs
	app.Use(middleware.URLFormat)                            // Format URLs
	app.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},                   // Allow all origins
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}, // Allow these HTTP methods
		AllowedHeaders:   []string{"Content-Type", "Authorization"},           // Allow these headers
		AllowCredentials: true,                                                // Allow credentials (cookies, authorization headers, etc.)
		MaxAge:           300,                                                 // Cache preflight response for 5 minutes
	}))
}
