import { createRouter, createWebHistory } from '@ionic/vue-router';
const routes = [
  {
    path: '/',
    redirect: '/home'
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
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;