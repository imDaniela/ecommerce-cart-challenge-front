# Etapa de build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos estáticos compilados al contenedor de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar archivo de configuración si lo necesitas
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]