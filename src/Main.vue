<script setup>
import { onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'

// Usar el store de Pinia
const store = useProductsStore()

// Computed properties del store
const products = computed(() => store.products)
const cart = computed(() => store.cart)
const userName = computed({
  get: () => store.userName,
  set: (value) => store.setUserName(value),
})
const cartTotal = computed(() => store.cartTotal)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const isCartEmpty = computed(() => store.isCartEmpty)

// Cargar productos al montar el componente
onMounted(async () => {
  await store.createOrder()
  await store.fetchProducts()
})

// Métodos del store
const addToCart = (product) => {
  store.addToCart(product)
}

const removeFromCart = (productId) => {
  store.removeFromCart(productId)
}

const confirmPayment = async () => {
  try {
    const message = await store.confirmPayment()
    alert(message)
    // Limpiar el carrito y el nombre de usuario después del pago exitoso
    store.clearCart()
    store.clearOrden()
    store.setUserName('Ingresa tu nombre')
    await store.createOrder()
  } catch (error) {
    alert(error.message)
  }
}

// Método para recargar productos
const reloadProducts = async () => {
  await store.fetchProducts()
}
</script>

<template>
  <div class="shopping-container">
    <!-- Cuadrante izquierdo - Lista de productos -->
    <main class="products-section">
      <div class="products-header">
        <h2 class="section-title">Productos Disponibles</h2>
        <button @click="reloadProducts" class="reload-button" :disabled="loading">
          {{ loading ? 'Cargando...' : 'Recargar' }}
        </button>
      </div>

      <!-- Estado de carga -->
      <div v-if="loading" class="loading-state">
        <p>Cargando productos...</p>
      </div>

      <!-- Estado de error -->
      <div v-else-if="error" class="error-state">
        <p>Error al cargar productos: {{ error }}</p>
        <button @click="reloadProducts" class="retry-button">Reintentar</button>
      </div>

      <!-- Lista de productos -->
      <div v-else class="products-grid">
        <div
          class="card pointer"
          v-for="product in products"
          :key="product.id"
          @click="addToCart(product)"
        >
          <h3>{{ product.nombre }}</h3>
          <p class="price">${{ product.precio }}</p>
          <button class="add-button">Agregar al carrito</button>
        </div>
      </div>
    </main>

    <!-- Cuadrante derecho - Carrito de compras -->
    <aside class="cart-section">
      <h2 class="section-title">Carrito de Compras</h2>

      <!-- Formulario de usuario -->
      <div class="user-form">
        <label class="text-center">Nombre de usuario:</label>
        <input
          type="text"
          v-model="userName"
          placeholder="Ingresa tu nombre"
          class="text-center user-input"
          @change="store.updateOrder()"
        />
      </div>

      <!-- Items del carrito -->
      <div class="cart-items">
        <div v-if="isCartEmpty" class="empty-cart">
          <p>Tu carrito está vacío</p>
        </div>

        <div v-else>
          <div class="cart-item" v-for="item in cart" :key="item.id">
            <div class="item-info">
              <h4>{{ item.nombre_producto }}</h4>
              <p class="item-price">${{ item.precio }} x {{ item.cantidad }}</p>
            </div>
            <div class="item-controls">
              <button class="quantity-btn" @click="removeFromCart(item.id)">-</button>
              <span class="quantity">{{ item.cantidad }}</span>
              <button class="quantity-btn" @click="addToCart(item)">+</button>
            </div>
          </div>

          <!-- Total -->
          <div class="cart-total">
            <h3>Total: ${{ cartTotal.toFixed(2) }}</h3>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="cart-actions">
        <button class="pay-button" @click="confirmPayment" :disabled="isCartEmpty">
          Confirmar Pago
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.shopping-container {
  display: flex;
  min-height: 100vh;
  gap: 20px;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Header de productos */
.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.reload-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reload-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.reload-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Estados de carga y error */
.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-state {
  color: #dc3545;
}

.retry-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
  margin-top: 10px;
}

.retry-button:hover {
  background-color: #c82333;
}

/* Sección de productos (cuadrante izquierdo - más grande) */
.products-section {
  flex: 2;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  background-color: white;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.card h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.price {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
  margin: 10px 0;
}

.add-button {
  width: 100%;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #0056b3;
}

/* Sección del carrito (cuadrante derecho - más pequeño) */
.cart-section {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.section-title {
  margin: 0 0 20px 0;
  color: #333;
  text-align: center;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.user-form {
  margin-bottom: 20px;
}

.user-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.user-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
}

.cart-items {
  flex: 1;
  margin-bottom: 20px;
}

.empty-cart {
  text-align: center;
  color: #666;
  padding: 40px 0;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  background-color: #f8f9fa;
  margin-bottom: 10px;
  border-radius: 5px;
}

.item-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.item-price {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover {
  background-color: #0056b3;
}

.quantity {
  font-weight: bold;
  min-width: 20px;
  text-align: center;
  color: gray !important;
}

.cart-total {
  text-align: center;
  padding: 20px 0;
  border-top: 2px solid #007bff;
  margin-top: 10px;
}

.cart-total h3 {
  margin: 0;
  color: #007bff;
  font-size: 24px;
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pay-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.pay-button:hover:not(:disabled) {
  background-color: #218838;
}

.clear-button {
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 12px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.clear-button:hover:not(:disabled) {
  background-color: #c82333;
}

.pay-button:disabled,
.clear-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.pointer {
  cursor: pointer;
}

.text-center {
  text-align: center;
}

/* Responsive design */
@media (max-width: 768px) {
  .shopping-container {
    flex-direction: column;
    padding: 10px;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .products-header {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
