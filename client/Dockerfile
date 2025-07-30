# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

# Copiamos solo lo necesario para instalar dependencias primero (cache efectiva)
COPY package.json package-lock.json* ./
RUN npm install

# Luego copiamos el resto del proyecto
COPY . .

# Ejecutamos el build de producción
RUN npm run build

# Etapa final: Servimos con Nginx
FROM nginx:alpine

# Eliminamos archivos por defecto de Nginx (opcional)
RUN rm -rf /usr/share/nginx/html/*

# Copiamos la build generada
COPY --from=build /app/dist /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

# Arrancamos Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
