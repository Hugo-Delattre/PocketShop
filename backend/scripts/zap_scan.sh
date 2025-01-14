#!/bin/bash

# Configuration
ZAP_PATH="/home/andydck/ZAP_2.15.0"
ZAP_PORT=8081
API_KEY="gqvqvm376cdrapm9kl34msc916"
URL_BASE="http://localhost:3000"

# Liste des endpoints GET à scanner
ENDPOINTS_GET=(
  "/"
  "/profile"
  "/user"
  "/product"
  "/shop"
  "/order"
  "/orderline"
  "/inventory"
  "/billing-details"
)

# Fonction pour démarrer ZAP en mode daemon
start_zap() {
  echo "Démarrage de ZAP..."
  "${ZAP_PATH}/zap.sh" -daemon -config api.key="${API_KEY}" -port "${ZAP_PORT}" &
  ZAP_PID=$!
  sleep 10
}

# Vérifier si ZAP est accessible
check_zap() {
  echo "Test de la connexion à ZAP sur http://localhost:${ZAP_PORT}..."
  curl -s "http://localhost:${ZAP_PORT}/JSON/core/view/version/" --data-urlencode "apikey=${API_KEY}" > /dev/null
  if [ $? -ne 0 ]; then
    echo "Impossible de se connecter à ZAP. Arrêt."
    kill "${ZAP_PID}"
    exit 1
  fi
  echo "ZAP est accessible."
}

# Lancer le scan sur une URL
scan_url() {
  local endpoint=$1
  local full_url="${URL_BASE}${endpoint}"
  echo "Lancement du scan pour ${full_url}..."
  response=$(curl -s -X POST "http://localhost:${ZAP_PORT}/JSON/spider/action/scan" \
    --data-urlencode "url=${full_url}" \
    --data-urlencode "apikey=${API_KEY}")
  scan_id=$(echo "${response}" | jq -r '.scan')
  
  if [[ "${scan_id}" == "null" ]]; then
    echo "Erreur lors du démarrage du scan pour ${full_url}."
    return
  fi
  
  echo "Scan démarré avec l'ID : ${scan_id}"
  
  # Suivre la progression du scan
  progress=0
  while [ "${progress}" -lt 100 ]; do
    progress=$(curl -s "http://localhost:${ZAP_PORT}/JSON/spider/view/status/" --data-urlencode "scanId=${scan_id}" --data-urlencode "apikey=${API_KEY}" | jq -r '.status')
    echo -ne "Progression du scan : ${progress}%\r"
    sleep 2
  done
  echo "Scan terminé pour ${full_url}."
}

# Récupérer les alertes
fetch_alerts() {
  echo "Récupération des alertes..."
  alerts_json=$(curl -s "http://localhost:${ZAP_PORT}/JSON/core/view/alerts/" --data-urlencode "apikey=${API_KEY}")
  echo "$alerts_json" > "alerts.json"
  echo "Alertes sauvegardées dans le fichier : alerts.json"
}

# Affichage des alertes dans le terminal
display_alerts() {
  echo "Alertes détectées :"
  cat alerts.json | jq
}

# Arrêter ZAP
stop_zap() {
  echo "Arrêt de ZAP..."
  kill "${ZAP_PID}"
}

# Exécution
start_zap
check_zap
for endpoint in "${ENDPOINTS_GET[@]}"; do
  scan_url "${endpoint}"
done
fetch_alerts
display_alerts
stop_zap
