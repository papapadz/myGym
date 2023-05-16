import { createRouter, createWebHistory } from '@ionic/vue-router';
const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/views/LoginPage.vue'),
  },
  {
    path: '/home',
    name: 'MenuPage',
    component: () => import('@/views/MenuPage.vue'),
  },
  {
    path: '/members',
    name: 'MembersPage',
    component: () => import('@/views/MembersPage.vue'),
  },
  {
    path: '/attendance',
    name: 'AttendancePage',
    component: () => import('@/views/AttendancePage.vue'),
  },
  {
    path: '/user',
    name: 'UserPage',
    component: () => import('@/views/UserPage.vue'),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;