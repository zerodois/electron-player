import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faGoogle)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (!store.getters['User/getToken'] && to.name !== 'Login') {
    return next('/login')
  }
  if (store.getters['User/getToken'] && to.name === 'Login') {
    return next('/')
  }
  return next()
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
