<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import LoginButton from "@/components/auth/LoginButton.vue";
import LogoutButton from "@/components/auth/LogoutButton.vue";
import UserProfile from "@/components/auth/UserProfile.vue";

const { isAuthenticated, isLoading } = useAuth();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <RouterLink to="/" class="text-gray-900 hover:text-gray-700 font-medium">Home</RouterLink>
            <RouterLink to="/about" class="text-gray-900 hover:text-gray-700 font-medium">About</RouterLink>
            <RouterLink v-if="isAuthenticated" to="/profile" class="text-gray-900 hover:text-gray-700 font-medium">Profile</RouterLink>
          </div>
          <div class="flex items-center space-x-4">
            <UserProfile v-if="isAuthenticated && !isLoading" />
            <LoginButton v-if="!isAuthenticated && !isLoading" />
            <LogoutButton v-if="isAuthenticated && !isLoading" />
          </div>
        </div>
      </nav>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>
