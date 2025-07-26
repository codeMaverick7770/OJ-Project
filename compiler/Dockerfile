# Use Node.js 18 as the base image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

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
    pip install autopep8 && \
    npm install -g prettier && \
    curl -L -o /usr/local/bin/google-java-format.jar https://github.com/google/google-java-format/releases/download/v1.17.0/google-java-format-1.17.0-all-deps.jar && \
    echo -e '#!/bin/bash\nexec java -jar /usr/local/bin/google-java-format.jar "$@"' > /usr/local/bin/google-java-format && \
    chmod +x /usr/local/bin/google-java-format && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

# Expose the port your Node.js app listens on
EXPOSE 8001

# Start the Node.js server
CMD ["node", "index.js"]
