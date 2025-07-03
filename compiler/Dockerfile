FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


RUN apt update && \
    apt install -y g++ python3 default-jdk && \
    apt clean

EXPOSE 8001

CMD ["node", "index.js"]
