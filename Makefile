# Docker compose commands

.PHONY: up down logs build clean

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v

start: build up
	@echo "Stack is running on http://localhost:8080"







# docker build and run Manual commands

# 	DATABASE_URL:=postgresql://postgres:supersmall@postgres-db:5432/postgres

#  .PHONY: docker-build-all
#  docker-build-all:
# 	docker build -t ecommerce-backend ./ecommerce-backend
# 	docker build -t ecommerce-frontend ./ecommerce-frontend
# 	docker build -t ecommerce-frontend-vite -f ./ecommerce-frontend/Dockerfile.3 ./ecommerce-frontend

 
# .PHONY: docker-run-all
# docker-run-all:
# 	@echo Starting postgres container
# # 	docker network create toystore-network

# 	docker run -d \
# 	--name postgres-db \
# 	--network toystore-network \
# 	-e POSTGRES_PASSWORD=supersmall \
# 	-v pgdata:/var/lib/postgresql/data \
# 	-p 5432:5432 \
# 	--restart unless-stopped \
# 	postgres:15.1-alpine


# 	docker run -d \
# 	--name ecommerce-backend \
# 	--network toystore-network \
# 	-e DATABASE_URL=${DATABASE_URL} \
# 	-p 3001:3001 \
# 	--restart unless-stopped \
# 	--link=postgres-db:postgres \
# 	ecommerce-backend

# 	docker run -d \
# 	--name ecommerce-frontend-vite \
# 	--network toystore-network \
# 	-v ${PWD}/ecommerce-frontend/vite.config.js:/usr/src/app/vite.config.js \
# 	-p 5173:5173 \
# 	--restart unless-stopped \
# 	--link=ecommerce-backend:ecommerce-backend \
# 	ecommerce-frontend-vite


# 	docker run -d \
# 		--name ecommerce-frontend \
# 		--network toystore-network \
# 		-p 80:8080 \
# 		--restart unless-stopped \
# 		--link=ecommerce-backend:ecommerce-backend \
# 		ecommerce-frontend







# docker build-only commands alone

# .PHONY: run-postgres run-ecommerce-backend run-ecommerce-frontend

# run-postgres:
# 	@echo Starting postgres container
# 	docker run \
# 	-e POSTGRES_PASSWORD=supersmall \
# 	-v pgdata:/var/lib/postgresql/data \
# 	-p 5432:5432 \
# 	postgres:15.1-alpine

# run-ecommerce-backend:
# 	@echo Starting ecommerce-backend
# 	cd ecommerce-backend && node server.js \
# 	DATABASE_URL=${DATABASE_URL} \
# 	npm run dev

# run-ecommerce-frontend:
# 	@echo Starting frontend
# 	cd ecommerce-frontend && \
# 	npm run dev