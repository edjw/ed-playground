# Project: ed-playground

## Development Server

### Quick Start

```bash
pnpm run dev
```

### Server Details

- **Framework**: Vite with Vue 3
- **Default Port**: 5173
- **Dev Command**: `pnpm run dev`
- **Build Command**: `pnpm run build`
- **Type Check**: `pnpm run type-check`

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

- **Unit Tests**: `pnpm run test:unit` (Vitest)
- **E2E Tests**: `pnpm run test:e2e` (Playwright)

### Code Quality

- **Lint**: `pnpm run lint`
- **Format**: `pnpm run format`

### Development Notes

- Server starts on port 5173 by default
- Vue DevTools available at <http://localhost:5173/__devtools__/>
- Netlify features are emulated locally (blobs, edge functions, environment variables, etc.)
- Use Context7 to get documentation
