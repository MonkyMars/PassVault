package validate

import (
	"passvault/response"
	"passvault/structs"
)

// ValidateCredential checks if the provided credential is valid.
type ValidateCredential struct {
	PasswordMinLength int `json:"password_min_length"`
	PasswordMaxLength int `json:"password_max_length"`
	UsernameMinLength int `json:"username_min_length"`
	UsernameMaxLength int `json:"username_max_length"`
}

func NewValidateCredential() *ValidateCredential {
	return &ValidateCredential{
		PasswordMinLength: 8,
		PasswordMaxLength: 64,
		UsernameMinLength: 3,
		UsernameMaxLength: 32,
	}
}

// Validate checks if the credential meets the validation criteria.
func (v *ValidateCredential) Validate(cred structs.Credential) error {
	if len(cred.Password) < v.PasswordMinLength || len(cred.Password) > v.PasswordMaxLength {
		return response.ErrInvalidPassword
	}
	if len(cred.Username) < v.UsernameMinLength || len(cred.Username) > v.UsernameMaxLength {
		return response.ErrInvalidUsername
	}
	return nil
}

