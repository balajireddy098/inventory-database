FROM node:20-slim

WORKDIR /app

# Install build dependencies for sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install
RUN npm rebuild sqlite3

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
