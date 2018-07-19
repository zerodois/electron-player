import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: require('@/components/Home').default,
      children: [
        {
          path: '',
          name: 'HomePage',
          component: require('@/components/Home/Index').default
        },
        {
          path: '/search',
          name: 'Search',
          component: require('@/components/Home/Search').default
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: require('@/components/Login').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

export default router
