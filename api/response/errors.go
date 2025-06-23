package response

import (
	"errors"
	"fmt"
)

var (
	ErrInvalidPassword = errors.New("invalid password provided")
	ErrInvalidUsername = errors.New("invalid username provided")
	ErrCredentialNotFound = errors.New("credential not found")
	ErrDatabaseConnection = errors.New("failed to connect to the database")
)

func WrapError(err error, message error) error {
    if err != nil {
        return fmt.Errorf("%w: %v", message, err)
    }
    return nil
}
