api:
	docker compose up -d drf_ws_chat_api

api_logs:
	docker compose logs -f drf_ws_chat_api

down:
	docker compose down

build:
	docker compose build

api_bash:
	docker compose run drf_ws_chat_api bash
