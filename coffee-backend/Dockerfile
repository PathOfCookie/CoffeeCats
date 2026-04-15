FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY apps/*/package.json ./apps/
COPY libs/*/package.json ./libs/

RUN yarn install

COPY . .

EXPOSE 3000 3001 3002 3003 3004

CMD ["yarn", "start:dev"]