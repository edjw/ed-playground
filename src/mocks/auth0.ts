import { ref } from "vue";

// Mock Auth0 for development/testing
export const createMockAuth0 = () => {
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const user = ref<any>(null);
  const error = ref<any>(null);

  const mockUser = {
    sub: "auth0|123456789",
    name: "Test User",
    email: "test@example.com",
    email_verified: true,
    picture: "https://via.placeholder.com/150",
    updated_at: new Date().toISOString(),
  };

  const loginWithRedirect = async (options?: any) => {
    console.log("Mock login called with options:", options);
    isLoading.value = true;
    
    // Simulate async login
    setTimeout(() => {
      isAuthenticated.value = true;
      user.value = mockUser;
      isLoading.value = false;
      console.log("Mock login successful");
    }, 1000);
  };

  const logout = (options?: any) => {
    console.log("Mock logout called with options:", options);
    isAuthenticated.value = false;
    user.value = null;
    console.log("Mock logout successful");
  };

  const getAccessTokenSilently = async () => {
    if (!isAuthenticated.value) {
      throw new Error("Not authenticated");
    }
    // Return a mock JWT token
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHwxMjM0NTY3ODkiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  };
};

// Export a mock useAuth0 hook
export const useMockAuth0 = createMockAuth0;