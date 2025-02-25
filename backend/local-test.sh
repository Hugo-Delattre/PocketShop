#!/bin/bash

set -e  # Arrêter le script en cas d'erreur
trap 'docker-compose down -v' EXIT  # Nettoyer les conteneurs à la sortie

DOPPLER_ENV="dev"

echo "Vérification de Doppler..."
if ! command -v doppler &> /dev/null; then
  echo "Doppler CLI n'est pas installé. Installez-le : https://docs.doppler.com/docs/cli"
  exit 1
fi

echo "Utilisation de l'environnement Doppler : $DOPPLER_ENV"

echo "Étape 1 : Linting..."
doppler run --config "$DOPPLER_ENV" -- \
  docker run --rm -v "$(pwd)":/app -w /app node:23 npm run lint

echo "Étape 2 : Préparation de la base de données..."
docker-compose up -d db
echo "Attente de la disponibilité de la base de données..."
sleep 10  # Assurez-vous que Postgres est prêt

echo "Étape 3 : Exécution des tests..."
doppler run --config "$DOPPLER_ENV" -- \
  docker run --rm --network="host" -v "$(pwd)":/app -w /app node:23 npm run test

echo "Étape 4 : Build de l'application..."
doppler run --config "$DOPPLER_ENV" -- \
  docker run --rm -v "$(pwd)":/app -w /app node:23 npm run build

echo "Nettoyage des conteneurs Docker..."
docker-compose down -v

echo "Toutes les étapes se sont terminées avec succès !"