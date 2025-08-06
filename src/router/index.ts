import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AnagramFinderView from "../views/AnagramFinderView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "Home" },
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
      meta: { title: "About" },
    },
    {
      path: "/medicine-tracker",
      name: "medicine-tracker",
      component: () => import("../views/MedicineTrackerView.vue"),
      meta: { title: "Medicine Tracker" },
    },
    {
      path: "/anagram-finder",
      name: "anagram-finder",
      component: AnagramFinderView,
      meta: { title: "Anagram Finder" },
    },
  ],
});

router.beforeEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Ed Playground` : "Ed Playground";
});

export default router;
