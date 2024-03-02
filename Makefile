all: back front

#NORMAL
back:
	cd backend && uvicorn main:app --reload 

front:
	cd frontend && npm start

debug:
	cd backend && python3 -i debug.py


#DOCKER
build:
	docker-compose up --build -d

run:
	docker-compose up -d

exec:
	docker-compose exec backend_fastapi fish


stop:
	docker-compose down

clean:
	docker container prune -f	docker-compose up --build -d

