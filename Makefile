all: back front

env:
	source backend/venv_python/bin/activate

back:
	cd backend && python3 init.py
	# cd backend && uvicorn main:app --reload 

front:
	cd frontend && npm start

debug:
	cd backend && python3 -i debug.py

kill8000:
	kill -9 $(lsof -t -i:8000)

install:
	pip install -r backend/requirements.txt





#DOCKER
start: build run

build:
	docker-compose up --build -d

run:
	docker-compose up -d

exec:
	docker-compose exec backend_fastapi fish

down:
	docker-compose down

clean:
	docker container prune -f	docker-compose up --build -d
