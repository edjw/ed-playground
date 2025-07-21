import { defineStore } from "pinia";
import { computed } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

export const useAuthStore = defineStore("auth", () => {
  const auth0 = useAuth0();
  
  const isAuthenticated = computed(() => auth0.isAuthenticated.value);
  const isLoading = computed(() => auth0.isLoading.value);
  const user = computed(() => auth0.user.value);
  const error = computed(() => auth0.error.value);

  const login = async () => {
    await auth0.loginWithRedirect();
  };

  const logout = () => {
    auth0.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const getAccessToken = async () => {
    try {
      const token = await auth0.getAccessTokenSilently();
      return token;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    logout,
    getAccessToken,
  };
});