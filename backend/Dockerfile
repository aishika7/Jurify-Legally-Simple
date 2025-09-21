FROM node:20-alpine
RUN apk add --no-cache bash git python3 make g++ libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x ./node_modules/.bin/tsc
RUN npx tsc
EXPOSE 4000
CMD ["node", "dist/index.js"]