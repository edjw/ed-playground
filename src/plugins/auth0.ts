import { createAuth0 } from "@auth0/auth0-vue";
import { createMockAuth0 } from "@/mocks/auth0";
import type { App } from "vue";

export const setupAuth0 = (app: App) => {
  const isDevelopment = import.meta.env.DEV;
  const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === "true";
  const hasAuth0Config = 
    import.meta.env.VITE_AUTH0_DOMAIN && 
    import.meta.env.VITE_AUTH0_CLIENT_ID;

  if (!hasAuth0Config && isDevelopment) {
    console.warn(
      "⚠️  Auth0 credentials not found. Using mock authentication.\n" +
      "To use real Auth0, set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in .env"
    );
  }

  if (hasAuth0Config && !useMockAuth) {
    // Use real Auth0
    app.use(
      createAuth0({
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        authorizationParams: {
          redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      })
    );
  } else {
    // Use mock Auth0 for development
    console.log("🔧 Using mock Auth0 for development");
    
    // Create a plugin that provides the mock auth
    app.provide("auth0", createMockAuth0());
  }
};