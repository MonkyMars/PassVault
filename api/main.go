package main

import (
	"fmt"
	api "passvault/config"
)

func main() {
	config := api.LoadConfig()
	fmt.Printf("Starting the vault on port %s...\n", config.Port)
	
	app := api.StartServer()
	api.Middleware(app)
	api.SetupRoutes(app)
	api.StartListening(app, config.Port)
};