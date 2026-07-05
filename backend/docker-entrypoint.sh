#!/bin/bash
set -e

echo "Running Laravel setup..."

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# Wait for database to be ready
echo "Waiting for database connection..."
max_attempts=30
attempt=0
until php artisan db:show 2>&1 || [ $attempt -eq $max_attempts ]; do
    attempt=$((attempt + 1))
    echo "Database not ready (attempt $attempt/$max_attempts). Last error:"
    php artisan db:show 2>&1 | tail -3
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo "Failed to connect to database after $max_attempts attempts"
    exit 1
fi

echo "Database connection established!"

# Run migrations
echo "Running database migrations..."
php artisan migrate --force

# Run seeders
echo "Running database seeders..."
php artisan db:seed --force

# Create storage symlink
echo "Creating storage symlink..."
php artisan storage:link

# Cache configuration
echo "Caching configuration..."
php artisan config:cache
php artisan route:cache

echo "Laravel setup complete. Starting Apache..."

# Execute the main command (apache2-foreground)
exec "$@"
