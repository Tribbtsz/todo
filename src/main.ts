import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// 添加自动聚焦指令
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

app.mount('#app')