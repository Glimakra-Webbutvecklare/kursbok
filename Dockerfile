# Use a newer Rust image that supports the required versions
FROM rust:1.75 as builder

# Install specific versions that work (matching your local setup)
RUN cargo install mdbook --version 0.4.48
RUN cargo install mdbook-mermaid --version 0.15.0

# Set working directory
WORKDIR /app

# Copy the mdbook project
COPY . .

# Build the book
RUN mdbook build

# Use nginx to serve the static files
FROM nginx:alpine

# Copy the built book to nginx html directory
COPY --from=builder /app/book /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
