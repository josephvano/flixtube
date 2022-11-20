FROM node:18.5.0-alpine as deps

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production


FROM node:18.5.0-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install && npm run build

FROM node:18.5.0-alpine

WORKDIR /usr/src/app

COPY public ./public
COPY package*.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]
