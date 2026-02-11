FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
# This runs the custom build script which bundles server dependencies and builds the client
RUN npm run build

# --- Runner Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy package files again to install ONLY production dependencies
# This is needed because the build script treats some dependencies as external
COPY package*.json ./
RUN npm ci --only=production

# Copy the built artifacts from the builder stage
COPY --from=builder /app/dist ./dist

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the port (Google Cloud Run will inject PORT env var, but 5000 is our default)
EXPOSE 5000

# Start the application
CMD ["node", "dist/index.cjs"]
