# Этап сборки React (Vite)
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Этап раздачи статики через Nginx
FROM nginx:stable-alpine
# У Vite папка сборки называется dist
COPY --from=build /app/dist /usr/share/nginx/html

# Добавляем конфиг, чтобы React Router (если он есть) не выдавал 404
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]