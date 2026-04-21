# Use official Node.js minimum required version for Nuxt 3 (LTS recommended)
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Enable corepack and pnpm/npm (here using npm since package-lock is present)
# COPY package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate prisma client (if applicable)
RUN npx prisma generate

# Build the Nuxt application
RUN npm run build

# --- Phase 2: Production environment ---
FROM node:20-alpine

# Set to production
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Copy package and server files from build stage
COPY --from=build /app/.output /app/.output
COPY --from=build /app/prisma /app/prisma

# If you use Prisma, copy package for running prisma scripts in prod or handling DB migrations
COPY --from=build /app/package.json ./package.json

# You may also want to install production dependencies only for Prisma if needed (not strictly necessary with .output but needed for prisma deploy)
RUN npm install prisma --omit=dev

# Change ownership to a non-root user for security
RUN chown -R node:node /app
USER node

# Expose port (Cloud providers like Railway override this through PORT env var)
EXPOSE 3000
ENV PORT=3000
ENV HOST=0.0.0.0

# Start command
CMD ["node", ".output/server/index.mjs"]
