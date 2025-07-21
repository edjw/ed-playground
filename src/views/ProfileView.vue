<template>
  <AuthGuard>
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">User Profile</h1>
      
      <div v-if="user" class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center space-x-6 mb-6">
          <img
            v-if="user.picture"
            :src="user.picture"
            :alt="user.name"
            class="w-24 h-24 rounded-full"
          />
          <div>
            <h2 class="text-2xl font-semibold">{{ user.name }}</h2>
            <p class="text-gray-600">{{ user.email }}</p>
          </div>
        </div>
        
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold mb-4">User Information</h3>
          <dl class="grid grid-cols-1 gap-4">
            <div v-if="user.email_verified !== undefined">
              <dt class="text-sm font-medium text-gray-500">Email Verified</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ user.email_verified ? 'Yes' : 'No' }}</dd>
            </div>
            <div v-if="user.sub">
              <dt class="text-sm font-medium text-gray-500">User ID</dt>
              <dd class="mt-1 text-sm text-gray-900 font-mono">{{ user.sub }}</dd>
            </div>
            <div v-if="user.updated_at">
              <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ new Date(user.updated_at).toLocaleString() }}</dd>
            </div>
          </dl>
        </div>
        
        <div class="border-t pt-6 mt-6">
          <h3 class="text-lg font-semibold mb-4">Raw User Data</h3>
          <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ JSON.stringify(user, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </AuthGuard>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import AuthGuard from "@/components/auth/AuthGuard.vue";

const { user } = useAuth();
</script>