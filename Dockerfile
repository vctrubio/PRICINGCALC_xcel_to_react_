FROM python:3.9

RUN apt-get update && apt-get install -y fish
RUN python -c "import os; print(os.name)"

WORKDIR /app

COPY dataDir/Models/ dataDir/Models

WORKDIR /app/backend/

COPY backend/data_imports data_imports
COPY backend/requirements.txt .
COPY backend/models models
COPY backend/*.py .

# RUN pip install --no-cache-dir -r requirements.txt

SHELL ["fish", "-c"]

EXPOSE 8000

#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

#CMD ["echo", "Hello, there!"]

#CMD ["tail", "-f", "/dev/null"]

CMD ["fish"]

