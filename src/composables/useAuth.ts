import { useAuth0 } from "@auth0/auth0-vue";
import { computed, inject } from "vue";

export function useAuth() {
  // Try to get real Auth0 instance first, fall back to mock
  let auth0: any;
  
  try {
    auth0 = useAuth0();
  } catch {
    // If useAuth0 fails, we're using mock auth
    auth0 = inject("auth0");
    if (!auth0) {
      throw new Error("Auth0 not properly initialized");
    }
  }

  const login = () => {
    auth0.loginWithRedirect();
  };

  const logout = () => {
    if (auth0.logout) {
      auth0.logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    }
  };

  const isAuthenticated = computed(() => auth0.isAuthenticated.value);
  const isLoading = computed(() => auth0.isLoading.value);
  const user = computed(() => auth0.user.value);
  const error = computed(() => auth0.error.value);

  return {
    login,
    logout,
    isAuthenticated,
    isLoading,
    user,
    error,
  };
}