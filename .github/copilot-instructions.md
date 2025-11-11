# Copilot Instructions for hackaton.smartfloors

## Project Overview
This is a React 19 + Vite hackathon project using modern JavaScript (not TypeScript). It's set up as a minimal SPA with HMR and modern ESLint configuration.

## Tech Stack & Architecture
- **React 19.2.0** with React DOM (latest features including `createRoot`)
- **Vite 7.2.2** for dev server and bundling (not Create React App)
- **ESLint 9.x** with flat config format (`eslint.config.js`, not `.eslintrc`)
- **No TypeScript** - pure JavaScript with JSX files
- **No routing library** - currently single-page app
- **No state management** - using React hooks only

## Development Workflow

### Essential Commands
- `npm run dev` - Start Vite dev server with HMR (default: http://localhost:5173)
- `npm run build` - Production build to `dist/` folder
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint across the project
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without modifying files

### File Structure
```
src/
  main.jsx       # Entry point with StrictMode wrapper
  App.jsx        # Root component
  App.css        # Component-specific styles
  index.css      # Global styles (color scheme, base elements)
  assets/        # Static assets (images, SVGs)
```

## Code Conventions

### ESLint & Prettier
- **ESLint 9.x flat config** - array export format, not legacy `.eslintrc`
- **Prettier integration** - `eslint-config-prettier` disables conflicting rules
- **Custom rules**:
  - `no-unused-vars` allows uppercase variables (`^[A-Z_]` pattern for constants)
  - `react/prop-types` disabled (no TypeScript, runtime validation not enforced)
  - `react-refresh/only-export-components` warns on non-component exports
- **React version**: Explicitly set to `19.2` in ESLint settings
- **Security**: `react/jsx-no-target-blank` enforces `rel="noreferrer"` on external links
- **Prettier config** (`.prettierrc`):
  - Single quotes for JS, JSX single quotes enabled
  - 2 spaces indentation, 99 char line width
  - No trailing commas, semicolons enabled

### React Patterns
- **StrictMode enabled** - all components wrapped in `<StrictMode>` (see `main.jsx`)
- **Functional components only** - no class components
- **React 19 APIs** - using `createRoot` from `react-dom/client`
- **Hook-based state** - `useState` for local state (see `App.jsx` counter example)

### Styling Approach
- **CSS Modules NOT used** - plain CSS files imported directly
- **Global styles** in `index.css` - includes dark/light mode via `prefers-color-scheme`
- **Component styles** in matching `.css` files (e.g., `App.css` for `App.jsx`)
- **CSS custom properties** - root variables defined in `:root` for theming
- **No CSS-in-JS** - stick to plain CSS

### Import Conventions
- **Static assets from `public/`** - referenced with leading slash (e.g., `/vite.svg`)
- **Assets from `src/assets/`** - relative imports (e.g., `./assets/react.svg`)
- **React imports** - named imports from 'react' (e.g., `import { useState } from 'react'`)

## When Adding Features

### New Components
- Create `.jsx` files in `src/` (or subdirectories as needed)
- Add matching `.css` file for component-specific styles
- Export as default: `export default ComponentName`
- Import into parent components with `.jsx` extension explicit

### State Management
- Use React hooks (`useState`, `useEffect`, etc.) directly
- No Redux/Zustand/Context currently - add if complexity grows beyond local state

### Styling New Components
- Add global styles to `index.css` (buttons, links, typography)
- Add component-specific styles to new `.css` files
- Follow existing pattern: centered layouts, dark mode support, hover transitions

### Environment & Build
- Vite handles HMR automatically - save JSX files to see instant updates
- Assets in `public/` served at root, assets in `src/` bundled by Vite
- Build outputs to `dist/` - this folder is ignored by ESLint and git

## Common Patterns to Follow
1. **File naming**: lowercase with dots (e.g., `App.jsx`, `App.css`)
2. **Component structure**: Import dependencies → Define component → Export default
3. **Event handlers**: Inline arrow functions are acceptable (see `onClick` in `App.jsx`)
4. **Accessibility**: Add `alt` attributes to images, semantic HTML elements
5. **External links**: Always include `rel="noreferrer"` with `target="_blank"`
6. **Code formatting**: Run `npm run format` before commits to ensure consistent style

## What NOT to Do
- Don't add TypeScript without discussing migration strategy
- Don't use `.eslintrc.*` files - config is in `eslint.config.js`
- Don't bypass StrictMode - keep it enabled for development
- Don't add CSS frameworks without discussion (project uses custom CSS)
- Don't commit `dist/` folder - it's build output
