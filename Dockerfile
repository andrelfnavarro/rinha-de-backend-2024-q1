FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

RUN npm run build

ENV NODE_ENV=production

CMD ["node", "build/index.js"]
