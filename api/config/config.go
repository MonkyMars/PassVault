package api

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Port            string
	DatabasePath    string
	RequestTimeout  time.Duration
	PasswordMinLen  int
	PasswordMaxLen  int
	UsernameMinLen  int
	UsernameMaxLen  int
}

func LoadConfig() *Config {
	return &Config{
		Port:           getEnv("PORT", "8200"),
		DatabasePath:   getEnv("DATABASE_PATH", "./credentials.sqlite"),
		RequestTimeout: getDurationEnv("REQUEST_TIMEOUT", 20*time.Second),
		PasswordMinLen: getIntEnv("PASSWORD_MIN_LENGTH", 8),
		PasswordMaxLen: getIntEnv("PASSWORD_MAX_LENGTH", 64),
		UsernameMinLen: getIntEnv("USERNAME_MIN_LENGTH", 3),
		UsernameMaxLen: getIntEnv("USERNAME_MAX_LENGTH", 32),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getIntEnv(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}

func getDurationEnv(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}
