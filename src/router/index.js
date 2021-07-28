import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    meta:{
      requireAuth:true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 导航守卫
// 参数1 : to 目标路由对象
// 参数2 : from 来源路由对象
// 参数3 : next() 下一步
router.beforeEach((to, from, next) => {
	if (to.meta.requireAuth) {     // 判断该路由是否需要登录权限
    let token = localStorage.getItem('token')
    if (token) {              // 通过localStorage.getItem()获取当前的 token 是否存在
         next()
      }
        else {
          next({
              path: '/',
              query: {
                redirect: to.fullPath    // 将跳转的路由path作为参数，登录成功后跳转到该路由
              }  
          })
        }
	}
	else {
     next()
	}
})

export default router
