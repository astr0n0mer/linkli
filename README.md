# Linkli

A modern, open-source link-in-bio application that allows users to create a personalized page with all their important links in one place.

## Overview

Linkli provides a simple way to share multiple links through a single URL. Users can create a profile, add links, organize them, and share their personalized page with others.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (native driver)
- **Authentication**: Clerk
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui, Radix UI primitives
- **Icons**: Lucide React

## Features

### Completed
- [x] User authentication (Clerk integration)
- [x] Profile management (bio editing)
- [x] Public profile pages (`/u/:username`)
- [x] Link CRUD operations (create, read, update, delete)
- [x] Link ordering and reordering with persistence
- [x] Public/private link visibility
- [x] Dark/light theme support with system preference detection
- [x] Auto-detected link icons based on domain (GitHub, Twitter, YouTube, etc.)
- [x] Responsive design
- [x] Context-based state management

### In Progress / Planned
- [ ] Webhook signature verification (Svix) for production
- [ ] Short URL redirect feature (`/:slug` → actual URL)
- [ ] Input validation (URL format, unique slugs)
- [ ] Database indexes for performance
- [ ] Click tracking and basic analytics
- [ ] SEO meta tags (Open Graph, Twitter Cards)
- [ ] Error toast notifications

### Future Features
- [ ] Link scheduling (start/end dates)
- [ ] QR code generation
- [ ] Drag and drop reordering
- [ ] Custom themes per profile
- [ ] Custom domain support
- [ ] Advanced analytics (geographic data, referrers)
- [ ] Multiple link types (embeds, contact forms)
- [ ] Team/organization support

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- Clerk account (for authentication)

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

Required variables:
- `MONGODB_URI` - MongoDB connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key
- `CLERK_SECRET_KEY` - Clerk secret key

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Project Structure

```
app/
├── api/              # API routes (Next.js Route Handlers)
│   ├── lib/          # Database connection, services
│   └── v1/           # API v1 endpoints
├── components/       # React components
├── contexts/         # React context providers
├── lib/              # Utilities, types, API client
├── reducers/         # State reducers
├── u/[username]/     # Dynamic user profile pages
└── page.tsx          # Home page
```

## License

MIT
