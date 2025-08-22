#!/bin/sh
set -e

# Install dependencies if vendor is missing
if [ ! -f vendor/autoload.php ]; then
    echo "Installing composer dependencies..."
    composer install --no-progress --no-interaction --prefer-dist --optimize-autoloader
fi

# Ensure .env exists
if [ ! -f ".env" ]; then 
    echo "Creating env file for env $APP_ENV"
    cp .env.example .env
else
    echo ".env file exists."
fi

# Run Laravel setup commands
php artisan key:generate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan serve --port=$PORT --host=0.0.0.0
# Finally, hand over to the main entrypoint (php-fpm/apache)
exec docker-php-entrypoint "$@"
