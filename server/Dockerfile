# Etapa base con Node
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Exponer el puerto (ajusta si usas otro)
EXPOSE 3000

