package api

import (
	"embed"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"path"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
)

func StartServer() *chi.Mux {
	app := chi.NewRouter()
	return app
}

func StartListening(app *chi.Mux, port string) {
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, app))
}

// ServeUI sets up serving the embedded Vite build
func ServeUI(app *chi.Mux, staticFiles embed.FS) {
	// Get the embedded filesystem, stripping the "static" prefix
	uiFS, err := fs.Sub(staticFiles, "static")
	if err != nil {
		log.Fatal("Failed to create UI filesystem:", err)
	}

	// Serve static assets (CSS, JS, images, etc.)
	app.Get("/assets/*", func(w http.ResponseWriter, r *http.Request) {
		// Remove /assets prefix and serve from embedded files
		assetPath := strings.TrimPrefix(r.URL.Path, "/assets/")
		fullPath := path.Join("assets", assetPath)

		file, err := uiFS.Open(fullPath)
		if err != nil {
			http.NotFound(w, r)
			return
		}
		defer file.Close()

		// Get file info for proper serving
		stat, err := file.Stat()
		if err != nil {
			http.Error(w, "File stat error", http.StatusInternalServerError)
			return
		}

		// Set appropriate content type with proper charset
		if strings.HasSuffix(assetPath, ".js") {
			w.Header().Set("Content-Type", "application/javascript; charset=utf-8")
			// Add cache control for JS files
			w.Header().Set("Cache-Control", "public, max-age=31536000")
		} else if strings.HasSuffix(assetPath, ".css") {
			w.Header().Set("Content-Type", "text/css; charset=utf-8")
			w.Header().Set("Cache-Control", "public, max-age=31536000")
		} else if strings.HasSuffix(assetPath, ".svg") {
			w.Header().Set("Content-Type", "image/svg+xml")
		} else if strings.HasSuffix(assetPath, ".png") {
			w.Header().Set("Content-Type", "image/png")
		} else if strings.HasSuffix(assetPath, ".jpg") || strings.HasSuffix(assetPath, ".jpeg") {
			w.Header().Set("Content-Type", "image/jpeg")
		}

		http.ServeContent(w, r, assetPath, stat.ModTime(), file.(io.ReadSeeker))
	})

	// Handle SPA routes - serve index.html for non-API routes
	app.Get("/*", embeddedSpaHandler(uiFS))
}

func embeddedSpaHandler(uiFS fs.FS) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Don't serve UI for API routes
		if len(r.URL.Path) >= 4 && r.URL.Path[:4] == "/api" {
			http.NotFound(w, r)
			return
		}

		// Clean the path and try to serve the file
		cleanPath := strings.TrimPrefix(r.URL.Path, "/")
		if cleanPath == "" {
			cleanPath = "index.html"
		}

		fmt.Println("Request path:", cleanPath)

		// Try to open the requested file
		file, err := uiFS.Open(cleanPath)
		if err == nil {
			defer file.Close()
			// Check if it's a file (not a directory)
			if stat, err := file.Stat(); err == nil && !stat.IsDir() {
				// Set appropriate content type for different file types
				if strings.HasSuffix(cleanPath, ".html") {
					w.Header().Set("Content-Type", "text/html; charset=utf-8")
				} else if strings.HasSuffix(cleanPath, ".svg") {
					w.Header().Set("Content-Type", "image/svg+xml")
				}
				http.ServeContent(w, r, cleanPath, stat.ModTime(), file.(io.ReadSeeker))
				return
			}
			file.Close()
		}

		// Fallback to index.html for SPA routing
		indexFile, err := uiFS.Open("index.html")
		if err != nil {
			http.Error(w, "UI not found", http.StatusNotFound)
			return
		}
		defer indexFile.Close()

		// Get file info for proper serving
		stat, err := indexFile.Stat()
		if err != nil {
			stat = nil // fallback to no stat info
		}

		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		// Prevent caching of the main HTML file for SPA updates
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")

		var modTime time.Time
		if stat != nil {
			modTime = stat.ModTime()
		}
		http.ServeContent(w, r, "index.html", modTime, indexFile.(io.ReadSeeker))
	}
}
