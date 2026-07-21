# ── Stage 1: build the Next.js frontend (static export) ──
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Python runtime ──
FROM python:3.11-slim

WORKDIR /app

# Build deps for chromadb (onnxruntime) + pdfplumber
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first (layer cache)
COPY requirements_comonk.txt .
RUN pip install --no-cache-dir -r requirements_comonk.txt

# App code
COPY *.py ./
COPY Ahmedabad_IT_AIML_FINAL_MASTER.xlsx .

# Only the built static export is needed at runtime - comonk_backend.py's
# _FRONTEND_DIR points at frontend/out (see that file for why).
COPY --from=frontend-build /app/frontend/out ./frontend/out

# HF Spaces requires 7860
ENV PORT=7860
EXPOSE 7860

CMD ["python", "comonk_backend.py"]
