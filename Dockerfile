# Build stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

COPY --chown=node:node . .

USER node