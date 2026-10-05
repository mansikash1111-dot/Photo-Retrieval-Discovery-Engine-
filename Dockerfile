# Multi-stage production container for Railway deployment
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies needed for compiling packages and database drivers
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend, config, and data files into the container
COPY backend/ ./backend/
COPY config/ ./config/
COPY data/ ./data/

# Default environment variables
ENV PYTHONUNBUFFERED=1
ENV APP_ENV=production
ENV PORT=8000

EXPOSE 8000

# Start Uvicorn bound to 0.0.0.0 and dynamic Railway PORT
CMD ["sh", "-c", "uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port ${PORT:-8000}"]
