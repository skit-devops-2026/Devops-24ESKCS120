.PHONY: install test build run docker-build docker-up

# ---------------------------------------------------------------------------
# Project: Project Management SaaS
# Stack: HTML + CSS + Vanilla JavaScript
# ---------------------------------------------------------------------------

install:
	@echo "Checking project dependencies..."
	node --version
	@echo "No external packages required - static frontend project."
	@echo "Dependencies check passed."

test:
	@echo "Running project tests..."
	node scripts/test.js

build:
	@echo "Building production application..."
	node scripts/build.js

run:
	@echo "Starting Project Management SaaS..."
	npx --yes http-server . -p 3000

# Needed from M4 onwards
docker-build:
	docker build --build-arg GIT_SHA=$$(git rev-parse --short HEAD) -t project-management-saas:latest .

docker-up:
	docker compose up --build