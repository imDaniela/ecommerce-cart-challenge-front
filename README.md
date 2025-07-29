# Ecommerce Cart Challenge Frontend

## Descripción del proyecto

Este frontend fue construido con Vue 3 + Vite, y sirve como interfaz de usuario para consumir la API del carrito de compras desarrollada en Symfony. A través de esta interfaz, es posible visualizar productos, crear órdenes, agregar productos a una orden, actualizar cantidades, eliminar productos y finalizar el proceso marcando la orden como pagada.

**NOTA:** La interfaz es una vista simple que simula una redirección desde otra pantalla. Al montarse automáticamente, se crea una nueva orden en el backend para comenzar la experiencia de compra.

## Estructura del proyecto

La estructura del frontend sigue una organización sencilla basada en componentes, con enfoque en el consumo de la API del backend. A continuación, se destacan los elementos principales:

- Vista principal: Main.vue

  - Contiene el diseño de la interfaz del carrito y la lógica de interacción con el usuario.

- Store: product.js
  - Implementa la lógica de gestión del estado usando Pinia, encargándose de realizar las peticiones HTTP a los endpoints del backend (productos, orden, items, checkout, etc.).

## Tecnología utilizada

- **Lenguaje:** JavaScript
- **Framework:** Vue 3
- **Compilador:** Vite
- **Routing:** Vue Router
- **Estado global:** Pinia
- **Consumo de API:** Fetch

## Requisitos previos

- Node.js >= 18
- npm >= 9 (Recomendado usar nvm para gestionar versiones de Node.js)

## Instrucciones para levantar el entorno con Docker

Asegúrate de tener instalado Docker y Docker Compose.
Clona el repositorio. Se incluye el archivo .env que apunta a la url del backend.
Seguidamente puede ejecutar los siguientes comandos:

- Build: docker compose build
- Levantar normalmente: docker compose up

La aplicación estará disponible por defecto en http://localhost:5173.
