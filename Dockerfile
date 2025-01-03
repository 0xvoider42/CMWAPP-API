# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

# Install netcat for database connection checking and dos2unix
RUN apk add --no-cache netcat-openbsd dos2unix

WORKDIR /app

# Copy package files
COPY package*.json ./

# For development, install all dependencies including devDependencies
RUN npm ci

# Copy source code and built assets
COPY . .
COPY --from=builder /app/dist ./dist

# Handle entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN dos2unix /usr/local/bin/entrypoint.sh && \
    chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

CMD ["/usr/local/bin/entrypoint.sh"]