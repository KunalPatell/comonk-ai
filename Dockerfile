#  Fast & Lightweight Comonk AI Runtime 
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends     build-essential gcc libgomp1     && rm -rf /var/lib/apt/lists/*

COPY requirements_comonk.txt .
RUN pip install --no-cache-dir -r requirements_comonk.txt

COPY . .
COPY backend/static/ ./static/

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
