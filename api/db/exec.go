package db

import (
	"database/sql"
	"encoding/json"
	"passvault/response"
	"passvault/structs"
	"time"
)

// InsertCredential inserts a new credential into the database
func InsertCredential(db *sql.DB, cred structs.Credential) error {
	// Convert tags slice to JSON string
	tagsJSON, err := json.Marshal(cred.Tags)
	if err != nil {
		return response.WrapError(err, response.ErrDatabaseConnection)
	}

	query := `
		INSERT INTO credentials (username, password, description, tags, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?)
	`

	now := time.Now()
	_, err = db.Exec(query, cred.Username, cred.Password, cred.Description, string(tagsJSON), now, now)
	if err != nil {
		return response.WrapError(err, response.ErrDatabaseConnection)
	}

	return nil
}

// GetCredential retrieves a credential by ID
func GetCredential(db *sql.DB, id int) (*structs.Credential, error) {
	query := `
		SELECT id, username, password, description, tags, created_at, updated_at
		FROM credentials WHERE id = ?
	`

	var cred structs.Credential
	var tagsJSON string
	err := db.QueryRow(query, id).Scan(
		&cred.ID, &cred.Username, &cred.Password,
		&cred.Description, &tagsJSON, &cred.CreatedAt, &cred.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, response.ErrCredentialNotFound
		}
		return nil, response.WrapError(err, response.ErrDatabaseConnection)
	}

	// Convert JSON string back to slice
	if tagsJSON != "" {
		err = json.Unmarshal([]byte(tagsJSON), &cred.Tags)
		if err != nil {
			return nil, response.WrapError(err, response.ErrDatabaseConnection)
		}
	} else {
		cred.Tags = []string{} // Initialize empty slice if no tags
	}

	return &cred, nil
}

// GetAllCredentials retrieves all credentials
func GetAllCredentials(db *sql.DB) ([]structs.Credential, error) {
	query := `
		SELECT id, username, password, description, tags, created_at, updated_at
		FROM credentials ORDER BY created_at DESC
	`

	rows, err := db.Query(query)
	if err != nil {
		return nil, response.WrapError(err, response.ErrDatabaseConnection)
	}
	defer rows.Close()

	var credentials []structs.Credential
	for rows.Next() {
		var cred structs.Credential
		var tagsJSON string
		err := rows.Scan(
			&cred.ID, &cred.Username, &cred.Password,
			&cred.Description, &tagsJSON, &cred.CreatedAt, &cred.UpdatedAt,
		)
		if err != nil {
			return nil, response.WrapError(err, response.ErrDatabaseConnection)
		}

		// Convert JSON string back to slice
		if tagsJSON != "" {
			err = json.Unmarshal([]byte(tagsJSON), &cred.Tags)
			if err != nil {
				return nil, response.WrapError(err, response.ErrDatabaseConnection)
			}
		} else {
			cred.Tags = []string{} // Initialize empty slice if no tags
		}

		credentials = append(credentials, cred)
	}

	return credentials, nil
}

// UpdateCredential updates an existing credential
func UpdateCredential(db *sql.DB, id int, cred structs.Credential) error {
	// Convert tags slice to JSON string
	tagsJSON, err := json.Marshal(cred.Tags)
	if err != nil {
		return response.WrapError(err, response.ErrDatabaseConnection)
	}

	query := `
		UPDATE credentials 
		SET username = ?, password = ?, description = ?, tags = ?, updated_at = ?
		WHERE id = ?
	`

	now := time.Now()
	result, err := db.Exec(query, cred.Username, cred.Password, cred.Description, string(tagsJSON), now, id)
	if err != nil {
		return response.WrapError(err, response.ErrDatabaseConnection)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return response.WrapError(err, response.ErrDatabaseConnection)
	}

	if rowsAffected == 0 {
		return response.ErrCredentialNotFound
	}

	return nil
}

// DeleteCredential deletes a credential by ID
func DeleteCredential(db *sql.DB, id int) error {
	query := `DELETE FROM credentials WHERE id = ?`

	result, err := db.Exec(query, id)
	if err != nil {
		return response.WrapError(err, response.ErrDatabaseConnection)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return response.WrapError(err, response.ErrDatabaseConnection)
	}

	if rowsAffected == 0 {
		return response.ErrCredentialNotFound
	}

	return nil
}
