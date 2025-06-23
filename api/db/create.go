package db

import (
	"database/sql"
	"passvault/response"

	_ "github.com/mattn/go-sqlite3"
)

func Init() (*sql.DB, error) {
	// Create a table in the .sqlite database named credentials
	db, err := sql.Open("sqlite3", "./credentials.sqlite")
	if err != nil {
		return nil, response.WrapError(err, response.ErrDatabaseConnection)
	}

	_, err = db.Exec(
		`CREATE TABLE IF NOT EXISTS credentials (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL,
			password TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			description TEXT,
			tags TEXT
		)`,
	)

	if err != nil {
		return nil, response.WrapError(err, response.ErrDatabaseConnection)
	}

	return db, nil
}
