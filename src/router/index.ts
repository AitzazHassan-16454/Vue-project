import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'overview',
      component: () => import('@/views/OverviewView.vue'),
      meta: { title: 'Executive Overview' },
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/AnalyticsView.vue'),
      meta: { title: 'Revenue & Metrics Analytics' },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/TransactionsView.vue'),
      meta: { title: 'Transaction Ledger' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { title: 'Platform Settings' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || 'Executive Dashboard'
  document.title = `${title} | Nexus Analytics`
})

export default router
