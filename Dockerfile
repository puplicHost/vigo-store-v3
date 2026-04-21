# =========================
# Phase 1: Build
# =========================
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm install

# Copy all project files
COPY . .

# Dummy DATABASE_URL so prisma generate does not fail during build
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Generate Prisma Client
RUN npx prisma generate

# Build Nuxt app
RUN npm run build


# =========================
# Phase 2: Production
# =========================
FROM node:22-alpine

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Set working directory
WORKDIR /app

# Copy built app
COPY --from=build /app/.output ./.output

# Copy Prisma files
COPY --from=build /app/prisma ./prisma

# Copy package files
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

# Copy generated Prisma binaries
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Install only production dependencies
RUN npm install --omit=dev

# Security: run as non-root
RUN chown -R node:node /app
USER node

# Expose port
EXPOSE 3000

# Start Nuxt server
CMD ["node", ".output/server/index.mjs"]