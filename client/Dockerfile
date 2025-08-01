# Etapa de construcción
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# Etapa final con Nginx y HTTPS
FROM nginx:alpine

# Creamos carpetas para los certificados si no existen
RUN mkdir -p /etc/ssl/certs /etc/ssl/private

# Copiar certificados desde el symlink `certs/` que apunta a `../server/certs/`
COPY certs/infracod.local.pem /etc/ssl/certs/infracod.local.pem
COPY certs/infracod.local-key.pem /etc/ssl/private/infracod.local-key.pem

# Copiamos configuración de nginx personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos de build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
