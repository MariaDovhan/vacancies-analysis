.PHONY: all install build build-shared build-backend build-frontend test lint format format-check check dev-backend dev-frontend

all: check

install:
	npm install

build-shared:
	npm run build:shared

build-backend:
	npm run build:backend

build-frontend:
	npm run build:frontend

build:
	npm run build

test:
	npm run test

lint:
	npm run lint

format:
	npm run format

format-check:
	npm run format:check

check:
	npm run check

dev-backend:
	npm run start:backend

dev-frontend:
	npm run start:frontend

