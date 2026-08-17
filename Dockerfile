#  Fast & Lightweight Comonk AI Runtime 
FROM python:3.11-slim

WORKDIR /app

# Build deps for chromadb (onnxruntime) + pdfplumber
RUN apt-get update && apt-get install -y --no-install-recommends     build-essential gcc libgomp1     && rm -rf /var/lib/apt/lists/*

# Install Python deps first (layer cache)
COPY requirements_comonk.txt .
RUN pip install --no-cache-dir -r requirements_comonk.txt

# App code
COPY *.py ./
COPY Ahmedabad_IT_AIML_FINAL_MASTER.xlsx .

# Copy our modern world-class frontend to frontend/out (which comonk_backend.py serves)
COPY backend/static/ ./frontend/out/
COPY backend/static/ ./static/

ENV PORT=7860
EXPOSE 7860

CMD ["python", "comonk_backend.py"]
