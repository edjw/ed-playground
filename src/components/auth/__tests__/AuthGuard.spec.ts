import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import AuthGuard from "../AuthGuard.vue";
import LoginButton from "../LoginButton.vue";

// Create a mock auth provider
const createMockAuthProvider = (authState: any) => {
  return {
    global: {
      provide: {
        auth0: authState,
      },
      stubs: {
        LoginButton: true,
      },
    },
  };
};

// Mock the useAuth composable
vi.mock("@/composables/useAuth", () => ({
  useAuth: () => {
    const { auth0 } = (globalThis as any).__mockAuth || {};
    return auth0 || {
      isAuthenticated: ref(false),
      isLoading: ref(false),
      user: ref(null),
      error: ref(null),
      login: vi.fn(),
      logout: vi.fn(),
    };
  },
}));

describe("AuthGuard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state when auth is loading", () => {
    (globalThis as any).__mockAuth = {
      auth0: {
        isAuthenticated: ref(false),
        isLoading: ref(true),
        user: ref(null),
        error: ref(null),
        login: vi.fn(),
        logout: vi.fn(),
      },
    };

    const wrapper = mount(AuthGuard);
    expect(wrapper.text()).toContain("Loading authentication...");
  });

  it("shows login prompt when not authenticated", () => {
    (globalThis as any).__mockAuth = {
      auth0: {
        isAuthenticated: ref(false),
        isLoading: ref(false),
        user: ref(null),
        error: ref(null),
        login: vi.fn(),
        logout: vi.fn(),
      },
    };

    const wrapper = mount(AuthGuard, {
      global: {
        components: {
          LoginButton,
        },
      },
    });
    
    expect(wrapper.text()).toContain("You need to be logged in");
    expect(wrapper.findComponent(LoginButton).exists()).toBe(true);
  });

  it("renders slot content when authenticated", () => {
    (globalThis as any).__mockAuth = {
      auth0: {
        isAuthenticated: ref(true),
        isLoading: ref(false),
        user: ref({ name: "Test User" }),
        error: ref(null),
        login: vi.fn(),
        logout: vi.fn(),
      },
    };

    const TestComponent = defineComponent({
      template: "<div>Protected Content</div>",
    });

    const wrapper = mount(AuthGuard, {
      slots: {
        default: TestComponent,
      },
    });

    expect(wrapper.text()).toContain("Protected Content");
  });
});