package api

import (
	"log"
	"net/http"

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