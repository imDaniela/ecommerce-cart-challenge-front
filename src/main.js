import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import App from './App.vue'
import Main from './Main.vue'
import router from './router'

const app = createApp(Main)

app.use(createPinia())
app.use(router)

app.mount('#main')
