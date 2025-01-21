FROM node:20.18.1-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD ["/bin/sh", "-c" , "npm install && npm run dev"]
