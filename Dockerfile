# Use an official Rust image as base for building mdbook
FROM rust:1.70 as builder

# Install mdbook and mdbook-mermaid
RUN cargo install mdbook mdbook-mermaid

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
