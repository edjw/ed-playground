<template>
  <button
    @click="logout"
    class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
  >
    Log Out
  </button>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";

const { logout } = useAuth();
</script>