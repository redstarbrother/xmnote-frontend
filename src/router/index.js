import { createRouter, createWebHistory } from 'vue-router'
import NoteView from '../views/NoteView.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/note',
      name: 'note',
      component: NoteView,
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.name !== 'login' && !token) {
    next({ name: 'login' })
  } else if (to.name === 'login' && token) {
    next({ name: 'note' })
  } else {
    next()
  }
})

export default router
