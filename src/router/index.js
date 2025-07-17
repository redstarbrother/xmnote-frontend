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

export default router
