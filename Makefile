# Variables
DOPPLER=doppler run
DOPPLER_PERSONAL=doppler run --config personnel --project devops
DOCKER_COMPOSE=docker-compose

# Commands
.PHONY: dev prd stop logs clean push scan zap

# Lancer l'env de dev
dev:
	$(DOPPLER) --config dev -- $(DOCKER_COMPOSE) up -d --build $(ARGS)
	docker exec -it mobile /bin/sh -c "npx expo start --tunnel --dev-client --port 8082"

prd:
	$(DOPPLER) --config prd -- $(DOCKER_COMPOSE) --profile prd up --build -d

stop:
	$(DOCKER_COMPOSE) down

# Nettoyer les containers, volumes et images inutilisés
clean:
	$(DOCKER_COMPOSE) down --volumes --remove-orphans
	docker system prune -f

deploy:
	ansible-playbook -i ansible/inventory ansible/playbooks/deploy.yml --ask-become-pass


restart:
	$(DOPPLER) --config dev -- $(DOCKER_COMPOSE) up -d $(ARGS) $(SERVICE)

stop-service:
	$(DOPPLER) --config dev -- $(DOCKER_COMPOSE) stop $(SERVICE)

start-service:
	$(DOPPLER) --config dev -- $(DOCKER_COMPOSE) start $(SERVICE)


# ----------------------------------------------------------------

# Section DevOps
push:
	$(DOPPLER_PERSONAL) -- bash -c '\
		docker login && \
		for image in $${IMAGES}; do \
			docker tag $$image:latest $${DOCKER_USER}/$$image:latest; \
			docker push $${DOCKER_USER}/$$image:latest; \
		done'

scan:
	$(DOPPLER_PERSONAL) -- bash -c '\
		if ! command -v snyk &> /dev/null; then \
			echo "Snyk n'est pas installé. Veuillez l'installer avant de continuer."; \
			exit 1; \
		fi; \
		rm -f snyk_report_summary.txt; \
		for image in $${IMAGES}; do \
			echo "Analyse de l'image: $$image"; \
			snyk container test $$image:latest >> snyk_report_summary.txt; \
			echo "Rapport d'analyse généré pour $$image"; \
			snyk container fix $$image:latest; \
			snyk container test $$image:latest >> snyk_report_summary.txt; \
			echo "Analyse et correction terminées pour $$image"; \
		done'

zap:
	$(DOPPLER_PERSONAL) -- bash -c '\
		$${ZAP_PATH}/zap.sh -daemon -config api.key=$${ZAP_API_KEY} -port $${ZAP_PORT} & \
		sleep 10; \
		curl -s "http://localhost:$${ZAP_PORT}/JSON/core/view/version/" --data-urlencode "apikey=$${ZAP_API_KEY}" > /dev/null || { echo "Impossible de se connecter à ZAP."; exit 1; }; \
		for endpoint in / /profile /user /product /shop /order /orderline /inventory /billing-details; do \
			echo "Scanning $$endpoint"; \
			response=$$(curl -s -X POST "http://localhost:$${ZAP_PORT}/JSON/spider/action/scan" \
				--data-urlencode "url=$${ZAP_URL_BASE}$$endpoint" \
				--data-urlencode "apikey=$${ZAP_API_KEY}"); \
			scan_id=$$(echo $$response | jq -r ".scan"); \
			progress=0; \
			while [ $$progress -lt 100 ]; do \
				progress=$$(curl -s "http://localhost:$${ZAP_PORT}/JSON/spider/view/status/" --data-urlencode "scanId=$$scan_id" --data-urlencode "apikey=$${ZAP_API_KEY}" | jq -r ".status"); \
				echo -ne "Progression du scan $$endpoint : $$progress%\r"; \
				sleep 2; \
			done; \
			echo "Scan terminé pour $$endpoint."; \
		done; \
		curl -s "http://localhost:$${ZAP_PORT}/JSON/core/view/alerts/" --data-urlencode "apikey=$${ZAP_API_KEY}" > alerts.json; \
		echo "Alertes sauvegardées dans alerts.json."; \
		kill $$(pgrep -f "zap.sh")'


		# test pipeline