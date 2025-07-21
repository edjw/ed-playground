# Auth0 Integration Verification Checklist

## 🧪 Testing Without Auth0 Credentials

The app now supports mock authentication for testing without Auth0 setup:

1. **Start the dev server:**
   ```bash
   pnpm run dev
   ```

2. **Test mock authentication:**
   - Click "Log In" button
   - After 1 second, you'll be "logged in" as Test User
   - Check the Profile page
   - Test "Log Out" functionality

## ✅ Local Development Checklist

### 1. Initial Setup
- [ ] Clone/pull the latest code
- [ ] Run `pnpm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Run `pnpm run dev`

### 2. Without Auth0 (Mock Mode)
- [ ] App starts without errors
- [ ] Console shows "🔧 Using mock Auth0 for development"
- [ ] Login button is visible
- [ ] Clicking login shows loading state
- [ ] After login, user profile appears in navbar
- [ ] Profile link appears in navigation
- [ ] Profile page shows mock user data
- [ ] Logout button works

### 3. With Auth0 Credentials
- [ ] Update `.env` with real Auth0 credentials:
  ```env
  VITE_AUTH0_DOMAIN=your-tenant.auth0.com
  VITE_AUTH0_CLIENT_ID=your-client-id
  VITE_AUTH0_REDIRECT_URI=http://localhost:5173
  ```
- [ ] Restart dev server
- [ ] Login redirects to Auth0
- [ ] After login, redirects back to app
- [ ] Real user data appears
- [ ] Logout works properly

### 4. Code Quality Checks
- [ ] `pnpm run type-check` passes
- [ ] `pnpm run lint` passes
- [ ] `pnpm run test:unit` passes
- [ ] `pnpm run build` completes successfully

## 🚀 Deployment Checklist

### 1. Auth0 Dashboard Setup
- [ ] Create new Single Page Application
- [ ] Configure Allowed Callback URLs:
  - `http://localhost:5173`
  - `https://your-app.netlify.app`
- [ ] Configure Allowed Logout URLs (same as above)
- [ ] Configure Allowed Web Origins (same as above)
- [ ] Note down credentials

### 2. Netlify Setup
- [ ] Add environment variables in Netlify:
  - `VITE_AUTH0_DOMAIN`
  - `VITE_AUTH0_CLIENT_ID`
  - `VITE_AUTH0_REDIRECT_URI` (your Netlify URL)
  - `VITE_AUTH0_AUDIENCE` (if using API)
- [ ] Deploy the app
- [ ] Test authentication on live site

## 🔍 Feature Verification

### Authentication Flow
- [ ] Login button triggers Auth0 login
- [ ] Successful login shows user info
- [ ] Failed login shows error
- [ ] Logout clears session
- [ ] Page refresh maintains auth state

### Protected Routes
- [ ] `/profile` redirects to login when not authenticated
- [ ] `/profile` shows user data when authenticated
- [ ] AuthGuard component works properly

### API Integration
- [ ] Netlify function deploys successfully
- [ ] Token verification works
- [ ] API calls include auth token

### UI/UX
- [ ] Loading states display correctly
- [ ] Error states are handled
- [ ] Mobile responsive design works
- [ ] Navigation updates based on auth state

## 📊 Test Commands

Run these commands to verify everything works:

```bash
# Install dependencies
pnpm install

# Run type checking
pnpm run type-check

# Run linting
pnpm run lint

# Run unit tests
pnpm run test:unit

# Build for production
pnpm run build

# Start dev server
pnpm run dev
```

## 🐛 Common Issues

### Issue: "Auth0 domain not found"
**Solution:** Check `.env` file has correct values without quotes

### Issue: "Redirect URI mismatch"
**Solution:** Ensure callback URL in Auth0 matches exactly (including trailing slash)

### Issue: "Cannot read property 'loginWithRedirect' of undefined"
**Solution:** Auth0 not initialized properly - check console for errors

### Issue: Tests failing
**Solution:** Mock implementations might need updating - check test files

## 📝 Notes

- Mock auth mode allows full testing without Auth0 account
- Real Auth0 integration requires account setup
- Environment variables must start with `VITE_`
- Netlify functions need separate dependencies