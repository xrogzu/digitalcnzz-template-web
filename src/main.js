import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'

import { api, axios } from './api'
Vue.prototype.$api = api
Vue.prototype.$axios = axios

import dayjs from 'dayjs'
Vue.prototype.$dayjs = dayjs

import util from './util/index'
Vue.use(util)

import cookies from 'vue-cookies'
Vue.use(cookies)

import meta from 'vue-meta'
Vue.use(meta)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import hotkeys from 'hotkeys-js'
Vue.prototype.$hotkeys = hotkeys

// 全局组件自动注册
import '@/components/autoRegister'

// 自动加载 svg 图标
const req = require.context('./assets/icons', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

import '@/assets/styles/reset.scss'

Vue.config.productionTip = false

Vue.prototype.$eventBus = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
