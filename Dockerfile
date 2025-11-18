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
# Install OpenSSL, socat and glibc compat for Prisma runtime and test tooling
RUN apk add --no-cache curl openssl libc6-compat socat
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/test ./test
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/nest-cli.json ./nest-cli.json
COPY --from=builder /app/tsconfig*.json ./
COPY --from=builder /app/types ./types
COPY --from=builder /app/scripts ./scripts
RUN chmod +x ./scripts/set-database-url.sh
EXPOSE 3000
EXPOSE 9229
CMD ["./scripts/set-database-url.sh"]
