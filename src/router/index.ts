import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import HomePage from '@/pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },

    {
      path: '/jobs',
      name: 'jobs',
      component: () =>
        import('@/pages/JobsPage.vue'),
    },

    {
      path: '/jobs/:id',
      name: 'job-detail',
      component: () =>
        import('@/pages/JobDetailPage.vue'),
    },
  ],
});

export default router;