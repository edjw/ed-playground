import { useAuth0 } from "@auth0/auth0-vue";
import { computed } from "vue";

export function useAuth() {
  const auth0 = useAuth0();

  const login = () => {
    auth0.loginWithRedirect();
  };

  const logout = () => {
    auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
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