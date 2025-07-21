# Auth0 Setup Guide

This guide explains how to set up Auth0 authentication for this Vue 3 + Netlify application.

## Prerequisites

1. An Auth0 account (create one at [auth0.com](https://auth0.com))
2. A Netlify account for deployment

## Auth0 Configuration

### 1. Create a New Application

1. Log in to your Auth0 Dashboard
2. Navigate to Applications > Create Application
3. Choose "Single Page Web Applications"
4. Select Vue.js as your technology

### 2. Configure Application Settings

In your Auth0 application settings, configure the following:

**Allowed Callback URLs:**
```
http://localhost:5173,
https://your-netlify-app.netlify.app
```

**Allowed Logout URLs:**
```
http://localhost:5173,
https://your-netlify-app.netlify.app
```

**Allowed Web Origins:**
```
http://localhost:5173,
https://your-netlify-app.netlify.app
```

### 3. Note Your Credentials

From the Settings tab, note down:
- Domain (e.g., `your-tenant.auth0.com`)
- Client ID
- Client Secret (keep this secure!)

## Local Development Setup

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in your Auth0 credentials:

```bash
cp .env.example .env
```

Update `.env`:
```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_REDIRECT_URI=http://localhost:5173
VITE_AUTH0_AUDIENCE=your-api-audience # Optional: only if you have an API
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm run dev
```

## Netlify Deployment

### 1. Environment Variables

In your Netlify dashboard:
1. Go to Site settings > Environment variables
2. Add the following variables:
   - `VITE_AUTH0_DOMAIN`
   - `VITE_AUTH0_CLIENT_ID`
   - `VITE_AUTH0_REDIRECT_URI` (set to your Netlify URL)
   - `VITE_AUTH0_AUDIENCE` (if using)

### 2. Deploy

```bash
git push
```

Netlify will automatically build and deploy your application.

## Using the Auth0 Extension (Optional)

If you installed the Netlify Auth0 extension:

1. Go to your Netlify site dashboard
2. Navigate to Integrations > Auth0
3. Follow the setup wizard
4. The extension will automatically create environment variables

## Features Implemented

### Authentication Components
- **LoginButton**: Triggers Auth0 login flow
- **LogoutButton**: Logs out the user
- **UserProfile**: Displays user information
- **AuthGuard**: Protects routes/components

### Composables & Stores
- **useAuth**: Auth0 composable for authentication state
- **useAuthStore**: Pinia store for centralized auth management

### Protected Routes
- Profile page (`/profile`) - requires authentication
- Route guards can be added to any route

### API Integration
- Netlify Function for token verification
- API service for authenticated requests

## Usage Examples

### Using Authentication in Components

```vue
<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";

const { isAuthenticated, user, login, logout } = useAuth();
</script>

<template>
  <div v-if="isAuthenticated">
    Welcome, {{ user.name }}!
    <button @click="logout">Logout</button>
  </div>
  <button v-else @click="login">Login</button>
</template>
```

### Protecting Routes

```vue
<template>
  <AuthGuard>
    <!-- Protected content -->
  </AuthGuard>
</template>
```

### Making Authenticated API Calls

```typescript
import { api } from "@/services/api";

// Check auth status
const authStatus = await api.checkAuth();
```

## Troubleshooting

### Common Issues

1. **Redirect URI Mismatch**
   - Ensure your callback URLs in Auth0 match exactly
   - Include both localhost and production URLs

2. **Token Verification Fails**
   - Check that audience is correctly configured
   - Verify environment variables are set in Netlify

3. **Login Redirects to Wrong Page**
   - Check `VITE_AUTH0_REDIRECT_URI` environment variable
   - Ensure it matches Auth0 settings

## Next Steps

1. Customize the login/logout UI
2. Add more protected routes
3. Implement role-based access control
4. Add user metadata handling
5. Set up refresh token rotation

## Resources

- [Auth0 Vue SDK Documentation](https://github.com/auth0/auth0-vue)
- [Auth0 Dashboard](https://manage.auth0.com)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/)