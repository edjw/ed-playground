# Project: ed-playground

## Development Server

### Quick Start

```bash
pnpm run dev
```

### Server Details

- **Framework**: Vite with Vue 3
- **Default Port**: 5173
- **Dev Command**: `pnpm dev:netlify`
- **Build Command**: `pnpm build`
- **Type Check**: `pnpm type-check` not `pnpm run type-check`

### Key Features

- Vue 3 with TypeScript
- Tailwind CSS v4
- Pinia for state management
- Vue Router
- Netlify integration with local emulation
- Vue DevTools integration
- ShadCN Vue for components
- Lucide Icons

### Testing

- **Unit Tests**: `pnpm test:unit` (Vitest)
- **E2E Tests**: `pnpm test:e2e` (Playwright)

### Code Quality

- **Lint**: `pnpm lint`
- **Format**: `pnpm format`

### Development Notes

- Server starts on port 5173 by default
- Vue DevTools available at <http://localhost:5173/__devtools__/>
- Netlify features are emulated locally (blobs, edge functions, environment variables, etc.)
- Use Context7 to get documentation
- Use ShadCN for components
- Use VueUse for composables and common functions like date formatting, dialogs etc (<https://vueuse.org/functions.html>)
- Use Lucide for icons
- Use Netlify Blobs for simple data storage even in dev mode thanks to "@netlify/vite-plugin". See `useMedicineData` composable for example.
