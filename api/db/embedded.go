package db

import (
	"database/sql"
	"embed"
	"io"
	"io/fs"
	"os"
	"passvault/response"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

// InitEmbedded initializes the database from an embedded file
func InitEmbedded(embeddedFS embed.FS) (*sql.DB, error) {
	// Try to extract the database from embedded files
	dbFile, err := fs.Sub(embeddedFS, "static")
	if err != nil {
		// Fall back to regular init if embedding fails
		return Init()
	}

	// Open the embedded database file
	embeddedDB, err := dbFile.Open("credentials.sqlite")
	if err != nil {
		// Fall back to regular init if embedded DB doesn't exist
		return Init()
	}
	defer embeddedDB.Close()

	// Create a temporary database file
	tempDir := os.TempDir()
	tempDBPath := filepath.Join(tempDir, "passvault_credentials.sqlite")

	// Create/overwrite the temp database file
	tempDB, err := os.Create(tempDBPath)
	if err != nil {
		return nil, response.WrapError(err, response.ErrDatabaseConnection)
	}

	// Copy embedded database to temp file
	_, err = io.Copy(tempDB, embeddedDB)
	tempDB.Close()
	if err != nil {
		os.Remove(tempDBPath) // Clean up on error
		return nil, response.WrapError(err, response.ErrDatabaseConnection)
	}

	// Open the copied database
	db, err := sql.Open("sqlite3", tempDBPath)
	if err != nil {
		os.Remove(tempDBPath) // Clean up on error
		return nil, response.WrapError(err, response.ErrDatabaseConnection)
	}

	// Verify the database works
	if err := db.Ping(); err != nil {
		db.Close()
		os.Remove(tempDBPath) // Clean up on error
		return nil, response.WrapError(err, response.ErrDatabaseConnection)
	}

	return db, nil
}

// GetTempDBPath returns the path where the temporary database is stored
func GetTempDBPath() string {
	tempDir := os.TempDir()
	return filepath.Join(tempDir, "passvault_credentials.sqlite")
}
