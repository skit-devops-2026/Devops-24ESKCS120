# Stage 1: Build React 19 + Vite 8 frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy frontend manifests
COPY frontend/package*.json frontend/.npmrc* ./

# Install frontend dependencies deterministically
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Copy frontend source files
COPY frontend/ ./

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

# Build production bundle
RUN npm run build

# Stage 2: Production Nginx web server
FROM nginx:1.27-alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
