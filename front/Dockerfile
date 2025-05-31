FROM node:18-alpine AS build-stage

ARG API_URL
ENV VITE_API_URL=${API_URL:-http://localhost:8081}

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build-docker

# Final stage
FROM nginx:stable-alpine AS final

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENV UI_PORT=${UI_PORT:-3000}

# al arrancar, sustituye el puerto en la plantilla y lanza nginx
CMD [ "sh", "-c", "envsubst '$$UI_PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'" ]