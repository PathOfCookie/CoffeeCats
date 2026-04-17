# Этап 1: Сборка React приложения
FROM node:20-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json
COPY package.json ./

# Устанавливаем зависимости через yarn
RUN yarn install --network-timeout 100000

# Копируем исходный код
COPY . .

# Собираем приложение
RUN yarn build

# Этап 2: Nginx сервер для раздачи статики
FROM nginx:alpine

# Копируем собранные файлы из этапа сборки
COPY --from=build /app/build /usr/share/nginx/html

# Копируем кастомную конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]