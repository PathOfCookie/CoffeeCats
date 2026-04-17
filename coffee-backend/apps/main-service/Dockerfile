FROM node:20-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

FROM base AS development

CMD ["yarn", "start:dev", "main-service"]

FROM base AS builder

RUN yarn build main-service

FROM node:20-alpine AS production

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=builder /app/dist/apps/main-service ./dist

RUN apk add --no-cache curl

CMD ["node", "dist/main"]