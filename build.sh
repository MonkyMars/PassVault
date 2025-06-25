#!/bin/bash

# Build script for PassVault with embedded UI

set -e

echo "Building PassVault with embedded UI..."

# Change to project root
cd "$(dirname "$0")"

# Build the UI
echo "Building UI..."
cd ui
npm run build
cd ..

# Copy UI build to api/static for embedding
echo "Copying UI build for embedding..."
rm -rf api/static
cp -r ui/build api/static
rm -rf ui/build

# Copy database to static directory for embedding
echo "Copying database for embedding..."
if [ -f "api/credentials.sqlite" ]; then
    cp api/credentials.sqlite api/static/
    echo "Database embedded successfully"
else
    echo "Warning: credentials.sqlite not found - app will create a new database"
fi

# Build the Go binary
echo "Building Go binary..."
cd api
go build -o passvault

echo "Build complete! Binary: api/passvault"
echo "The UI and database are now embedded in the binary."
