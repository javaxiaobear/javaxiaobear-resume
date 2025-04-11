import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  Button, Layout, Menu, Card, Form, Input, Select, Avatar,
  Dropdown, Divider, Tooltip, Radio, Tag, Modal, Row, Col,
  Checkbox, message, Tabs, InputNumber, Progress, Slider,
  Spin, Collapse, Empty
} from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'
import App from './App.vue'
import router from './router'

// Create Vue app
const app = createApp(App)

// Create and use Pinia for state management
const pinia = createPinia()
app.use(pinia)

// Register Ant Design Vue components
app.use(Button)
app.use(Layout)
app.use(Menu)
app.use(Card)
app.use(Form)
app.use(Input)
app.use(InputNumber)
app.use(Select)
app.use(Avatar)
app.use(Dropdown)
app.use(Divider)
app.use(Tooltip)
app.use(Radio)
app.use(Tag)
app.use(Modal)
app.use(Row)
app.use(Col)
app.use(Checkbox)
app.use(Tabs)
app.use(Progress)
app.use(Slider)
app.use(Spin)
app.use(Collapse)
app.use(Empty)

// Global properties
app.config.globalProperties.$message = message

// Use router
app.use(router)

// Mount app
app.mount('#app')
