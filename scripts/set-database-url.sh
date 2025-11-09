#!/bin/sh
# Script to build DATABASE_URL from individual environment variables
# This allows us to avoid hardcoding DATABASE_URL in docker-compose.yml

# Build the DATABASE_URL from environment variables
export DATABASE_URL="postgresql://${POSTGRESQL_USER}:${POSTGRESQL_PASSWORD}@${POSTGRESQL_HOST}:${POSTGRESQL_PORT}/${POSTGRESQL_DB}?schema=public"

# Set PORT for the application
export PORT=${ROOMS_INTERNAL_API_PORT:-3000}

# Run the Prisma migration
npx prisma db push

# Start the application
exec node dist/main
