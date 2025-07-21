<template>
  <div v-if="isLoading" class="text-gray-500">Loading...</div>
  <div v-else-if="isAuthenticated && user" class="flex items-center space-x-4">
    <img
      v-if="user.picture"
      :src="user.picture"
      :alt="user.name"
      class="w-10 h-10 rounded-full"
    />
    <div>
      <p class="font-semibold">{{ user.name }}</p>
      <p class="text-sm text-gray-600">{{ user.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";

const { isAuthenticated, isLoading, user } = useAuth();
</script>