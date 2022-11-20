FROM node:18.5.0-alpine as deps

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json ./

CMD ls -al && npm config set prefer-offline true && \
    npm install && \
    npm run start:dev
