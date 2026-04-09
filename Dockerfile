FROM node:20-alpine

WORKDIR /app

# Install build dependencies for sqlite3
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

COPY package*.json ./

RUN npm install
RUN npm rebuild sqlite3

COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
