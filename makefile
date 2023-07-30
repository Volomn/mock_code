api:
	docker-compose up mock_code_api

api_bash:
	docker-compose run mock_code_api bash

build:
	docker-compose build

down:
	docker-compose down
