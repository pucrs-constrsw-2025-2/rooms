# syntax=docker/dockerfile:1.7-labs
# NOTE: resources are served by another microservice. Do not implement here.

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY scripts ./scripts
ENV SKIP_PRISMA_GENERATE=1
# Use npm ci para builds reprodutíveis
RUN npm install --package-lock-only || true
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
# Install OpenSSL and glibc compat for Prisma on Alpine
RUN apk add --no-cache openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# ensure curl exists so the docker-compose healthcheck (uses curl) works
# Install OpenSSL and glibc compat for Prisma runtime
RUN apk add --no-cache curl openssl libc6-compat
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY scripts/set-database-url.sh ./scripts/
RUN chmod +x ./scripts/set-database-url.sh
EXPOSE 3000
CMD ["./scripts/set-database-url.sh"]
