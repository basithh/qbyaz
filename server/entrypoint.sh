#!/bin/sh
set -e

# If neither DATABASE_URL nor PGHOST is set, use H2
if [ -z "$DATABASE_URL" ] && [ -z "$PGHOST" ]; then
  echo "Database variables not set, using default (H2 or dev profile)"
  exec java -jar app.jar --spring.profiles.active=dev
else
  echo "Using prod profile for database..."
  exec java -jar app.jar --spring.profiles.active=prod
fi
