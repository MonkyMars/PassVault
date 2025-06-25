package db

import (
	"database/sql"
	"embed"
	"sync"
)

var (
	globalDB *sql.DB
	dbMutex  sync.RWMutex
	dbOnce   sync.Once
)

// InitializeGlobalDB initializes the global database instance
func InitializeGlobalDB(embeddedFS embed.FS) error {
	var err error
	dbOnce.Do(func() {
		dbMutex.Lock()
		defer dbMutex.Unlock()
		globalDB, err = InitEmbedded(embeddedFS)
	})
	return err
}

// GetDB returns the global database instance
func GetDB() *sql.DB {
	dbMutex.RLock()
	defer dbMutex.RUnlock()
	return globalDB
}

// CloseDB closes the global database connection
func CloseDB() error {
	dbMutex.Lock()
	defer dbMutex.Unlock()
	if globalDB != nil {
		return globalDB.Close()
	}
	return nil
}
