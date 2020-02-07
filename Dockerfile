FROM node:10.15.3 AS build

WORKDIR /app

COPY . .

RUN npm install --unsafe
RUN npm run-script prod

FROM nginx:1.17.8

COPY Docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/day-off-planner-angular-app /usr/share/nginx/html

EXPOSE 80
