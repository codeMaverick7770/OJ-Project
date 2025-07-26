# Use Node.js 18 as the base image
FROM node:18

# Set working directory
WORKDIR /app

# Install system-level dependencies and formatters
RUN apt update && \
    apt install -y \
    g++ \
    clang \
    clang-format \
    python3 \
    python3-pip \
    default-jdk \
    curl \
    git && \
    pip install --break-system-packages autopep8 && \
    npm install -g prettier && \
    curl -L -o /usr/local/bin/google-java-format.jar https://github.com/google/google-java-format/releases/download/v1.17.0/google-java-format-1.17.0-all-deps.jar && \
    echo '#!/bin/bash\nexec java -jar /usr/local/bin/google-java-format.jar "$@"' > /usr/local/bin/google-java-format && \
    chmod +x /usr/local/bin/google-java-format && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# Set up Node.js app
COPY package*.json ./
RUN npm install
COPY . .

# Expose the port
EXPOSE 8001

# Start server
CMD ["node", "index.js"]
