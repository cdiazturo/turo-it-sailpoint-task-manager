FROM node:22.14-alpine AS base
ENV NODE_ENV=production
ENV PORT=80

# Build stage for dependencies
FROM base AS dependencies
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Build stage for application
FROM dependencies AS build
WORKDIR /app

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM base AS production
WORKDIR /app

# Copy package files for production
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production=true && \
    yarn cache clean

# Copy built application from build stage
COPY --from=build /app/build ./build

# Use the start command from package.json
CMD ["yarn", "start"]
