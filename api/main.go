package main

import (
	"embed"
	"fmt"
	"log"
	api "passvault/config"
	"passvault/db"
)

//go:embed static
var staticFiles embed.FS

func main() {
	config := api.LoadConfig()
	fmt.Printf("Starting the vault on port %s...\n", config.Port)

	// Initialize the database
	if err := db.InitializeGlobalDB(staticFiles); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}
	defer db.CloseDB()

	app := api.StartServer()
	api.Middleware(app)
	api.SetupRoutes(app)
	api.ServeUI(app, staticFiles) // Pass the embedded files
	fmt.Println(config.Port)
	api.StartListening(app, config.Port)
}
