import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Inbox from "./views/Inbox.vue";
import Drafts from "./views/Drafts.vue";
import Settings from "./views/Settings.vue";
import Reports from "./views/Reports.vue";

export const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    { path: "/", component: Home },
    { path: "/inbox", component: Inbox },
    { path: "/drafts", component: Drafts },
    { path: "/settings", component: Settings },
    { path: "/reports", component: Reports },
  ],
});
