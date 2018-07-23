import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
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
          path: '/songs',
          name: 'Minhas Músicas',
          component: require('@/components/Home/Songs').default
        },
        {
          path: '/playlists',
          name: 'Playlists',
          component: require('@/components/Home/Playlists').default
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
