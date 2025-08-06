# ---------- Base stage ----------
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies early to cache them
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy the rest of your app source code
COPY . .

# ---------- Build stage ----------
FROM base AS build

RUN npm run build

# ---------- Production stage ----------
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy only package.json to install prod deps
COPY package*.json ./
RUN npm install --frozen-lockfile --only=production

# Copy built dist folder
COPY --from=build /app/dist ./dist

# If you have static files or configs, copy them too
# COPY --from=build /app/public ./public

# Expose NestJS default port

CMD ["node", "dist/main"]
