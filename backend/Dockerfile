FROM node:20.18.1-alpine AS base

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

COPY . .

EXPOSE 3000
CMD ["/bin/sh", "-c" , "npm install && npm run dev"]
