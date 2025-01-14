#!/bin/bash

if ! command -v snyk &> /dev/null
then
    echo "Snyk n'est pas installé. Veuillez installer Snyk avant de continuer."
    exit 1
fi

IMAGES=("grafana/grafana:latest" "t-dev-702-api-app:latest" "prom/prometheus:latest" "gcr.io/cadvisor/cadvisor:latest" "postgres:16")

OUTPUT_FILE="snyk_report_summary.txt"

rm -f $OUTPUT_FILE

for IMAGE in "${IMAGES[@]}"
do
    echo "Analyse de l'image: $IMAGE"

    snyk container test $IMAGE >> $OUTPUT_FILE
    echo "Rapport d'analyse généré pour $IMAGE dans $OUTPUT_FILE"

    echo "Tentative de correction des vulnérabilités pour $IMAGE..."
    snyk container fix $IMAGE

    echo "Réanalyse après correction pour $IMAGE"
    snyk container test $IMAGE >> $OUTPUT_FILE

    echo "Analyse et correction terminées pour $IMAGE"
done

echo "Analyse et correction terminées. Résumé des vulnérabilités dans le fichier $OUTPUT_FILE"
