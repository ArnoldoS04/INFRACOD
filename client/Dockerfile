# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Etapa final con Nginx
FROM nginx:alpine

# Copiamos configuración personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiamos archivos de la build de producción
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
