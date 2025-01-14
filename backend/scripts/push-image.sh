#!/bin/bash
user="andydck"

docker login

docker tag grafana/grafana $user/grafana:latest
docker push $user/grafana:latest

docker tag t-dev-702-api-app $user/api-app:latest
docker push $user/api-app:latest

docker tag prom/prometheus $user/prometheus:latest
docker push $user/prometheus:latest

docker tag gcr.io/cadvisor/cadvisor:latest $user/cadvisor:latest
docker push $user/cadvisor:latest

docker tag postgres:16 $user/postgres:16
docker push $user/postgres:16