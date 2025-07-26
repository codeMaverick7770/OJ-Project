# Use Node.js 18 as the base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Install system-level dependencies for compiling & formatting code
RUN apt update && \
    apt install -y \
    g++ \
    clang-format \
    python3 \
    python3-pip \
    default-jdk \
    curl \
    git && \
    pip install autopep8 && \
    npm install -g prettier && \
    curl -L -o google-java-format.jar https://github.com/google/google-java-format/releases/download/v1.17.0/google-java-format-1.17.0-all-deps.jar && \
    ln -s /app/google-java-format.jar /usr/local/bin/google-java-format && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# Add a simple wrapper script for java formatting
RUN echo '#!/bin/bash\njava -jar /usr/local/bin/google-java-format "$@"' > /usr/local/bin/google-java-format && \
    chmod +x /usr/local/bin/google-java-format

# Expose the port your app listens on
EXPOSE 8001

# Start the server
CMD ["node", "index.js"]
