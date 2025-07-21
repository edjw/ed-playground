# Quick Start Guide

## 🚀 Getting Started in 2 Minutes

### 1. Install and Run (No Auth0 Required!)

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

Visit http://localhost:5173 - The app will use **mock authentication** automatically!

### 2. Test Authentication Flow

1. Click **"Log In"** button
2. Wait 1 second (simulated login)
3. See your profile in the navbar
4. Visit the **Profile** page
5. Click **"Log Out"**

No Auth0 account needed for testing! 🎉

## 🔐 Setting Up Real Auth0 (When Ready)

### 1. Create Auth0 Account
- Sign up at [auth0.com](https://auth0.com)
- Create a new Single Page Application

### 2. Configure Auth0 App
Add these URLs in your Auth0 app settings:
- **Allowed Callback URLs**: `http://localhost:5173, https://your-app.netlify.app`
- **Allowed Logout URLs**: Same as above
- **Allowed Web Origins**: Same as above

### 3. Update Local Environment
Edit `.env` file:
```env
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

### 4. Restart Dev Server
```bash
pnpm run dev
```

Now login will use real Auth0!

## 📦 What's Included

- **Vue 3** + **TypeScript** + **Vite**
- **Auth0 Vue SDK** with mock fallback
- **Protected routes** (Profile page)
- **User management** components
- **Netlify Functions** for API auth
- **Tailwind CSS** for styling
- **Full test suite**

## 🧪 Available Commands

```bash
pnpm run dev          # Start dev server
pnpm run build        # Build for production
pnpm run type-check   # Check TypeScript
pnpm run lint         # Run ESLint
pnpm run test:unit    # Run tests
```

## 🎯 Next Steps

1. **Customize the UI** - Update components in `src/components/auth/`
2. **Add more protected routes** - Use `AuthGuard` component
3. **Implement API calls** - Use `src/services/api.ts`
4. **Deploy to Netlify** - Push to GitHub and connect

## 💡 Tips

- Mock auth is perfect for development and demos
- Environment variables must start with `VITE_`
- Check browser console for auth status messages
- All auth state is reactive (updates automatically)