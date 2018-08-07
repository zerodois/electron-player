import Vue from 'vue'
import axios from 'axios'
import VueSnackbar from 'vue-snack'
import 'vue-snack/dist/vue-snack.min.css'
import App from './App'
import router from './router'
import store from './store'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'material-icons/iconfont/material-icons.css'

library.add(faGoogle)
for (let fa in fas) {
  library.add(fas[fa])
}

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(VueSnackbar, {
  close: true
})
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
