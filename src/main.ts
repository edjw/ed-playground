import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { setupAuth0 } from "./plugins/auth0";

const app = createApp(App);

app.use(createPinia());
app.use(router);

// Configure Auth0 (with mock fallback for development)
setupAuth0(app);

app.mount("#app");
