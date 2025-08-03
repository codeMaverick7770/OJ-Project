FROM node:18

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y \
    g++ \
    clang \
    clang-format \
    python3 \
    python3-pip \
    default-jdk \
    curl \
    git && \
    ln -sf /usr/bin/python3 /usr/bin/python && \
    pip install --break-system-packages autopep8 && \
    npm install -g prettier && \
    curl -L -o /usr/local/bin/google-java-format.jar https://github.com/google/google-java-format/releases/download/v1.17.0/google-java-format-1.17.0-all-deps.jar && \
    printf '#!/bin/bash\nexec java -jar /usr/local/bin/google-java-format.jar "$@"\n' > /usr/local/bin/google-java-format && \
    chmod +x /usr/local/bin/google-java-format && \
    rm -rf /var/lib/apt/lists/*

# Node setup
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8001

CMD ["node", "index.js"]
