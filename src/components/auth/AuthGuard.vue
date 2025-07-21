<template>
  <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
    <p class="text-gray-500">Loading authentication...</p>
  </div>
  <div v-else-if="!isAuthenticated" class="flex flex-col items-center justify-center min-h-screen space-y-4">
    <p class="text-lg text-gray-700">You need to be logged in to access this page.</p>
    <LoginButton />
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import LoginButton from "./LoginButton.vue";

const { isAuthenticated, isLoading } = useAuth();
</script>