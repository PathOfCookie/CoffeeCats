FROM node:24-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

FROM base AS development

CMD ["yarn", "start:dev"]

FROM base AS builder

RUN yarn build

FROM node:24-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./

COPY .env ./

RUN yarn install --production --frozen-lockfile

EXPOSE 3000 3001 3002 3003 3004

CMD ["node", "dist/apps/api-service/main"]