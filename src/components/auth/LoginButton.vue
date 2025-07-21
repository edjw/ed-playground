<template>
  <button
    @click="login"
    class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
  >
    Log In
  </button>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";

const { login } = useAuth();
</script>