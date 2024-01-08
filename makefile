api:
	docker compose up -d drf_ws_chat_api

api_logs:
	docker compose logs -f drf_ws_chat_api

down:
	docker compose down

build:
	docker compose build --no-cache

api_bash:
	docker compose run drf_ws_chat_api bash

serve:
	docker compose up

migrate:
	docker compose run drf_ws_chat_api python manage.py migrate