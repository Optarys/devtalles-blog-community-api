#!/bin/sh
set -e

echo "⏳ Esperando a que PostgreSQL esté disponible..."

until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
  sleep 1
done

echo "✅ PostgreSQL está arriba, corriendo migraciones..."
yarn migration:run -d dist/core/persistence/config/data-source.js

echo "🚀 Iniciando aplicación NestJS..."
exec node dist/main.js
