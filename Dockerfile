# Build frontend
FROM oven/bun AS builder-bun
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile

ARG DOMAIN_NAME
ARG PLAUSIBLE_API_HOST
RUN echo "VITE_DOMAIN=${DOMAIN_NAME}\nVITE_PLAUSIBLE_API_HOST=${PLAUSIBLE_API_HOST}" > .env

RUN bun run build:client

# Build backend
FROM golang:1.26-alpine AS builder-go
WORKDIR /app

COPY --from=builder-bun /app/backend .
RUN go mod download
RUN CGO_ENABLED=0 go build -tags production -o longhabit

# Deploy binary
FROM alpine:latest AS runner
WORKDIR /app

COPY --from=builder-go /app/longhabit .
RUN chmod +x /app/longhabit

EXPOSE 8090

CMD ["/app/longhabit", "serve", "--http=0.0.0.0:8090"]