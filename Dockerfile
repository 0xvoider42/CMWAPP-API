# Build stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy package files
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

COPY --chown=node:node . .

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# Start the server using the production build
CMD ["npm", "run", "start:prod"]