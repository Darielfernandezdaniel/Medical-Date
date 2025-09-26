# 1️⃣ Imagen base ligera Alpine con Node
FROM node:24.7.0-alpine

# 2️⃣ Instalar dependencias necesarias del sistema
RUN apk add --no-cache bash git python3 make g++ 

# 3️⃣ Crear y usar directorio de trabajo
WORKDIR /app

# Expone el puerto de Angular
EXPOSE 4200

# 4️⃣ Copiar package.json y package-lock.json
COPY package*.json ./

# 5️⃣ Instalar dependencias de Node
RUN npm install

# 6️⃣ Copiar el resto del código (solo para la primera build)
COPY . .

# 7️⃣ Comando para desarrollo con hot reload
CMD ["npm", "start"]