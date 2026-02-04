import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useClientsStore } from "@/stores/clients.store";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: () => import("@/views/LoginView.vue") },
  { path: "/register", component: () => import("@/views/RegisterView.vue") },
  { path: "/reset", component: () => import("@/views/ResetView.vue") },
  { path: "/agency", component: () => import("@/views/AgencyView.vue"), meta: { requiresAuth: true } },
  {
    path: "/client/:clientId",
    component: () => import("@/views/ClientWorkspaceView.vue"),
    meta: { requiresAuth: true, requiresClient: true },
    children: [
      { path: "connections", component: () => import("@/views/client/ConnectionsView.vue") },
      { path: "assets", component: () => import("@/views/client/AssetsView.vue") },
      { path: "posts", component: () => import("@/views/client/PostsView.vue") },
      { path: "approvals", component: () => import("@/views/client/ApprovalsView.vue") },
      { path: "calendar", component: () => import("@/views/client/CalendarView.vue") },
      { path: "logs", component: () => import("@/views/client/LogsView.vue") },
      { path: "", redirect: (to) => ({ path: `/client/${to.params.clientId}/connections` }) }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!auth.user) {
    auth.initAuthListener();
  }

  if (to.meta.requiresAuth && !auth.user) {
    return "/login";
  }

  if (to.meta.requiresClient) {
    const clients = useClientsStore();
    const clientId = String(to.params.clientId || "");
    if (!clientId) {
      return "/agency";
    }
    if (clients.selectedClientId !== clientId) {
      clients.selectClient(clientId);
    }
  }

  return true;
});

export default router;
