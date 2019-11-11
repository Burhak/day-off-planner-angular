FROM node:10.15.3-alpine

WORKDIR /app

COPY . .

RUN npm install --unsafe

RUN npm run-script prod

EXPOSE 8080

CMD ["node", "server.js"]
