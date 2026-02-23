# =========================================
# Builder stage (mdbook + mermaid support)
# =========================================
FROM rust:1.89 AS builder

# Install system dependencies + node (required for mermaid CLI)
RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install mdBook (stable & plugin-compatible version)
RUN curl -L https://github.com/rust-lang/mdBook/releases/download/v0.4.40/mdbook-v0.4.40-x86_64-unknown-linux-gnu.tar.gz \
    | tar -xz -C /usr/local/bin

# Install mdbook-mermaid (compatible with mdBook 0.4.x)
RUN cargo install mdbook-mermaid --version 0.15.0 --locked

# Install Mermaid CLI (required by mdbook-mermaid)
RUN npm install -g @mermaid-js/mermaid-cli

WORKDIR /app
COPY . .

# =========================================
# Development stage (live reload)
# =========================================
FROM builder AS dev

EXPOSE 3000
CMD ["mdbook", "serve", "--hostname", "0.0.0.0"]

# =========================================
# Production stage (nginx static hosting)
# =========================================
FROM builder AS build

RUN mdbook build

FROM nginx:alpine AS runtime

COPY --from=build /app/book /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]