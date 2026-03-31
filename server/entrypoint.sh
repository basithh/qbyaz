#!/bin/sh
set -e

# If DATABASE_URL is not set, use H2
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL not set, using default (H2 or dev profile)"
  exec java -jar app.jar --spring.profiles.active=dev
else
  echo "Using prod profile with DATABASE_URL: $DATABASE_URL"
  exec java -jar app.jar --spring.profiles.active=prod
fi
