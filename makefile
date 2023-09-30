api:
	docker-compose up mock_code_api

web:
	docker-compose up mock_code_web

api_bash:
	docker-compose run mock_code_api bash

build:
	docker-compose build

down:
	docker-compose down

ecr_login:
	aws ecr get-login-password --region eu-west-1 --profile shaibu_volomn | docker login --username AWS --password-stdin 206722258093.dkr.ecr.eu-west-1.amazonaws.com

build_api_prod_image:
	cd backend && docker build -t 206722258093.dkr.ecr.eu-west-1.amazonaws.com/mock_code_api:prod -f Dockerfile .

build_web_prod_image:
	cd frontend && docker build --build-arg APP_BASE_URL=https://api.mockcode.volomn.io/api -t 206722258093.dkr.ecr.eu-west-1.amazonaws.com/mock_code_web:prod -f Dockerfile .

push_api_prod_image:
	docker push 206722258093.dkr.ecr.eu-west-1.amazonaws.com/mock_code_api:prod

push_web_prod_image:
	docker push 206722258093.dkr.ecr.eu-west-1.amazonaws.com/mock_code_web:prod

build_and_push_web_to_prod: ecr_login build_web_prod_image push_web_prod_image

build_and_push_api_to_prod: ecr_login build_api_prod_image push_api_prod_image

build_and_push_images_to_prod: build_and_push_web_to_prod build_and_push_api_to_prod
