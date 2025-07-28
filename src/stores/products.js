// stores/products.js
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    cart: [],
    userName: 'Ingresa tu nombre',
    orden: {
      id: null,
      username: '',
      pagado: false,
    },
    loading: false,
    error: null,
  }),

  getters: {
    cartTotal: (state) => {
      return state.cart.reduce((total, item) => total + item.precio * item.cantidad, 0)
    },

    cartItemsCount: (state) => {
      return state.cart.reduce((total, item) => total + item.cantidad, 0)
    },

    isCartEmpty: (state) => {
      return state.cart.length === 0
    },
  },

  actions: {
    // Método para obtener productos del backend
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const response = await fetch('http://localhost:8000/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        this.products = data
      } catch (error) {
        this.error = error.message
        console.error('Error fetching products:', error)

        // Fallback a productos de prueba en caso de error
        this.products = [
          { id: 1, nombre: 'Product 1', precio: 100 },
          { id: 2, nombre: 'Product 2', precio: 200 },
          { id: 3, nombre: 'Product 3', precio: 300 },
        ]
      } finally {
        this.loading = false
      }
    },

    // Método para crear la orden de compra
    async createOrder() {
      this.loading = true
      this.error = null

      try {
        const response = await fetch('http://localhost:8000/api/orden', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.userName,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        this.orden = data.data
      } catch (error) {
        this.error = error.error
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    // Método para actualizar la orden de compra
    async updateOrder() {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(`http://localhost:8000/api/orden/${this.orden.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.userName,
          }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        this.orden = data.data
      } catch (error) {
        this.error = error.error
        console.error('Error fetching products:', error)
      } finally {
        this.loading = false
      }
    },

    // Agregar producto al carrito
    async addToCart(product) {
      const existingItem = this.cart.find((item) => item.id === product.id)

      if (existingItem) {
        existingItem.cantidad += 1

        this.createOrderItem(existingItem, `orden/item/${existingItem.id}`, 'PUT')
      } else {
        const orderItem = {
          id: null,
          id_orden: this.orden.id,
          id_producto: product.id,
          cantidad: 1,
        }

        await this.createOrderItem(orderItem, 'orden/item', 'POST')
        const items = await this.getOrderDetails()

        this.cart = items.map((item) => ({
          id: item.id,
          id_orden: item.id_orden,
          id_producto: item.id_producto,
          nombre_producto: item.nombre_producto,
          precio: item.precio,
          cantidad: item.cantidad,
        }))
      }
    },

    async getOrderDetails() {
      const response = await fetch(`http://localhost:8000/api/orden/${this.orden.id}/items`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      try {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const orderItems = data

        return orderItems
      } catch (error) {
        this.error = error.error
        console.error('Error getting order item:', error)
      }
    },

    async createOrderItem(ordenItem, endpoint, method) {
      try {
        const response = await fetch(`http://localhost:8000/api/${endpoint}`, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ordenItem),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        const ordenItemCreated = data.data

        return ordenItemCreated
      } catch (error) {
        this.error = error.error
        console.error('Error creating order item:', error)
      }
    },

    // Remover producto del carrito
    async removeFromCart(productId) {
      const itemIndex = this.cart.findIndex((item) => item.id === productId)
      if (itemIndex > -1) {
        if (this.cart[itemIndex].cantidad > 1) {
          this.cart[itemIndex].cantidad -= 1
          await this.createOrderItem(
            this.cart[itemIndex],
            `orden/item/${this.cart[itemIndex].id}`,
            'PUT',
          )
        } else {
          await this.removeOrderItem(this.cart[itemIndex].id)
          this.cart.splice(itemIndex, 1)
        }
      }
    },

    async removeOrderItem(ordenItemId) {
      try {
        const response = await fetch(`http://localhost:8000/api/orden/item/${ordenItemId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        this.error = error.error
        console.error('Error removing order item:', error)
      }
    },

    // Limpiar carrito
    clearCart() {
      this.cart = []
    },

    clearOrden() {
      this.orden = {
        id: null,
        username: '',
        pagado: false,
      }
    },

    // Actualizar nombre de usuario
    setUserName(name) {
      this.userName = name
    },

    // Confirmar pago (opcional: también puede hacer llamada al backend)
    async confirmPayment() {
      if (!this.userName.trim()) {
        throw new Error('Por favor, ingresa tu nombre')
      }

      if (this.isCartEmpty) {
        throw new Error('El carrito está vacío')
      }

      try {
        // Descomentar si quieres enviar la orden al backend
        const response = await fetch(`http://localhost:8000/api/orden/${this.orden.id}/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Error al procesar el pago')
        }

        return `¡Gracias ${this.orden.username}! Tu compra de $${this.cartTotal} ha sido confirmada.`
      } catch (error) {
        console.error('Error confirming payment:', error)
        throw error
      }
    },
  },
})
