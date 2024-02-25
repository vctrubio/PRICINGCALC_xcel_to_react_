all: back front

back:
	cd backend && uvicorn main:app --reload

front:
	cd frontend && npm start

debug:
	cd backend && python3 -i debug.py