# Linkli

A modern, open-source link-in-bio application that allows users to create a personalized page with all their important links in one place.

## Overview

Linkli provides a simple way to share multiple links through a single URL. Users can create a profile, add links, organize them, and share their personalized page with others.

## Tech Stack

### Backend (API)
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB (native driver)
- **Authentication**: Clerk

### Frontend (UI)
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router

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
