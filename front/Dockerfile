FROM node:18-alpine AS build-stage

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build-docker


# final stage
FROM busybox:1.37

RUN adduser -D static
USER static
WORKDIR /home/static
COPY --from=build-stage /app/dist .
ENV UI_PORT=$UI_PORT

CMD ["sh", "-c", "busybox httpd -f -v -p $UI_PORT"]