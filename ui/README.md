# Linktree Clone

A modern link-in-bio application built with React, TypeScript, and Vite.

## Current Features

- ✅ Profile display (avatar, name, bio)
- ✅ Link management (add, edit, delete, reorder)
- ✅ Copy short link functionality
- ✅ Dark/Light theme support with system preference detection
- ✅ Responsive design
- ✅ Context-based state management (Links & Theme)

## Roadmap

### Immediate/Near-term Features

- [ ] **Backend Integration**
  - [ ] User authentication (signup/login)
  - [ ] CRUD operations for links and profile
  - [ ] Public profile pages (/:username route)
  - [ ] Database integration

- [ ] **Analytics & Tracking**
  - [ ] Click tracking for each link
  - [ ] View counts, geographic data, referrer information
  - [ ] Simple dashboard showing link performance

- [ ] **Link Scheduling**
  - [ ] Set start/end dates for links
  - [ ] Automatically activate/deactivate links based on schedule

- [ ] **Custom Slugs**
  - [ ] Allow users to edit the slug when creating/editing links
  - [ ] Validate uniqueness
  - [ ] Show the full shareable URL in the UI

- [ ] **Profile Customization**
  - [ ] Upload custom avatar
  - [ ] Add social media links
  - [ ] Custom bio with markdown support
  - [ ] Custom colors/themes per profile

- [ ] **Link Organization**
  - [ ] Group links by category with visual separation
  - [ ] Collapsible sections
  - [ ] Search/filter links

- [ ] **QR Code Generation**
  - [ ] Generate QR codes for each link or profile
  - [ ] Download as image

- [ ] **Animations**
  - [ ] Add smooth animations when reordering links (using framer-motion)
  - [ ] Drag and drop functionality for reordering

### Medium-term Features

- [ ] **Multiple Link Types**
  - [ ] Embed YouTube videos, Spotify tracks
  - [ ] Contact forms
  - [ ] File downloads
  - [ ] Email/phone call buttons

- [ ] **Custom Domain Support**
  - [ ] Allow users to use their own domains
  - [ ] Subdomain per user (e.g., username.yourapp.com)

- [ ] **Link Appearance Customization**
  - [ ] Different button styles/shapes
  - [ ] Custom colors per link
  - [ ] Add icons/thumbnails to links
  - [ ] Animations/effects

- [ ] **Visitor Engagement**
  - [ ] Email capture form
  - [ ] Newsletter signup integration
  - [ ] Social share buttons for the profile

- [ ] **A/B Testing**
  - [ ] Test different titles/descriptions
  - [ ] Rotate links to test performance

- [ ] **Link Preview**
  - [ ] Show preview of the destination URL
  - [ ] Fetch and display Open Graph metadata

### Advanced Features

- [ ] **Multi-user/Team Support**
  - [ ] Organizations with multiple profiles
  - [ ] Role-based permissions

- [ ] **Integrations**
  - [ ] Zapier/webhook support
  - [ ] Connect with email marketing tools
  - [ ] Social media auto-posting

- [ ] **Advanced Analytics**
  - [ ] Conversion tracking
  - [ ] UTM parameter support
  - [ ] Export analytics data

- [ ] **White-label/Branding**
  - [ ] Remove branding for premium users
  - [ ] Custom CSS injection

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
