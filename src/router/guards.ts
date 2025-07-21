import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAuth0 } from "@auth0/auth0-vue";

export const authGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const verify = () => {
    // If the user is authenticated, continue
    if (isAuthenticated.value) {
      return next();
    }

    // Otherwise, log in
    loginWithRedirect({
      appState: { targetUrl: to.fullPath },
    });
  };

  // If loading has already finished, check the auth state
  if (!isLoading.value) {
    return verify();
  }

  // Watch for the loading property to change and then check
  const checkInterval = setInterval(() => {
    if (!isLoading.value) {
      clearInterval(checkInterval);
      return verify();
    }
  }, 100);
};