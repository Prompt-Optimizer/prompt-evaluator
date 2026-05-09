FROM node:24.11-alpine3.21

WORKDIR /usr/src/app

COPY . .

EXPOSE 3000
