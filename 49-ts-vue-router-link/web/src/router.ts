import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/Home.vue";
import Settings from "./views/Settings.vue";
import User from "./views/User.vue";
import Files from "./views/Files.vue";

export const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    { path: "/", component: Home },
    { path: "/settings", component: Settings },
    { path: "/users/:id", component: User },
    { path: "/files/:path*", name: "Files", component: Files },
  ],
});

// Every navigation renews the session first.
router.beforeEach(async () => {
  await fetch("/api/renew");
});
