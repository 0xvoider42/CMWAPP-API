#!/bin/sh

echo "Waiting for postgres..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "PostgreSQL started"

echo "Running migrations..."
npm run migrate

if [ "$NODE_ENV" = "production" ]; then
  echo "Starting production server..."
  npm run start:prod
else
  echo "Starting development server..."
  npm run start:dev
fi 