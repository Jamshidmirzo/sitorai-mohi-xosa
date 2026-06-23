# Sitorai Mohi Xosa — Museum Website

## Goal
Build a multilingual museum website with a full admin panel for "Sitorai Mohi Xosa" (historical palace-museum in Bukhara, Uzbekistan). All content is managed through the admin panel — nothing hardcoded.

## Non-Goals
- Mobile app
- E-commerce / online ticket purchasing
- User registration for visitors (only admin auth)
- Real-time features (chat, notifications)

## Tech Stack
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 App Router, TypeScript | SSR + API routes in one project, Vercel-ready |
| Styling | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design system |
| Database | PostgreSQL + Prisma ORM | Relational data with strong typing, easy migrations |
| Auth | NextAuth.js (Credentials) | Simple admin-only auth, no OAuth needed |
| Rich Text | TipTap | Headless, extensible, good i18n support |
| Charts | Recharts | Lightweight, React-native charting |
| File Upload | Local /public/uploads + API route | Simple MVP, can switch to S3/uploadthing later |
| i18n | next-intl | Best Next.js App Router i18n library |
| QR Codes | qrcode (npm) | Generate QR codes server-side |
| Icons | Lucide React | Consistent with shadcn/ui |

## Data Model (Main Entities)

### Admin / User
- id, email, password (hashed), name, role, createdAt

### Exhibit
- id, slug, categoryId, hallId, period, material, createdAt, updatedAt
- ExhibitTranslation: exhibitId, locale (uz/ru/en), name, description
- ExhibitImage: exhibitId, url, alt, order

### Category
- id, slug
- CategoryTranslation: categoryId, locale, name

### Hall
- id, slug, number
- HallTranslation: hallId, locale, name, description

### Post (News/Articles)
- id, slug, coverImage, published, createdAt, updatedAt
- PostTranslation: postId, locale, title, excerpt, content (rich text)

### GalleryImage
- id, url, alt, category, order, createdAt

### Survey (Questionnaire)
- id, exhibitId (nullable — null = museum-wide), active, createdAt
- SurveyTranslation: surveyId, locale, title, description
- SurveyQuestion: id, surveyId, type (single/multiple/rating/text), order, required
- QuestionTranslation: questionId, locale, text
- QuestionOption: id, questionId, order
- OptionTranslation: optionId, locale, text

### SurveyResponse
- id, surveyId, exhibitId, sessionId, locale, createdAt
- ResponseAnswer: id, responseId, questionId, optionId (nullable), textValue (nullable), ratingValue (nullable)

### VisitorInfo (singleton-ish)
- id, locale, hours, ticketPrices, address, phone, email, mapEmbedUrl

### SiteSettings
- id, locale, siteName, siteDescription, heroTitle, heroSubtitle

## Architecture
```
/src
  /app
    /[locale]           # Public pages (uz, ru, en)
      /page.tsx         # Landing
      /exhibits/...     # Exhibits listing + detail
      /gallery/...      # Photo gallery
      /news/...         # News listing + detail
      /survey/[id]/...  # Survey form
      /about/...        # About / visitor info
      /contact/...      # Contact
    /admin              # Admin panel (no locale prefix)
      /dashboard
      /exhibits
      /posts
      /gallery
      /surveys
      /settings
      /visitor-info
    /api                # API routes
      /auth
      /exhibits
      /posts
      /gallery
      /surveys
      /upload
      /visitor-info
      /settings
  /components
    /ui                 # shadcn/ui components
    /public             # Public site components
    /admin              # Admin panel components
  /lib
    /prisma.ts          # Prisma client singleton
    /auth.ts            # NextAuth config
    /i18n.ts            # next-intl config
    /utils.ts           # Helpers
  /messages             # i18n translation files
    /uz.json
    /ru.json
    /en.json
  /prisma
    /schema.prisma
    /seed.ts
```

## Milestones

### M1: Foundation (Tasks 1-3)
Project scaffolding, DB schema, auth system

### M2: Admin Panel Core (Tasks 4-8)
Admin layout, exhibits CRUD, posts CRUD, gallery, visitor info

### M3: Public Website (Tasks 9-13)
Landing page, exhibits page, gallery, news, visitor info, i18n

### M4: Surveys & Analytics (Tasks 14-17)
Survey builder (admin), survey form (public), response viewer, dashboard analytics

### M5: Polish (Tasks 18-20)
Dark/light mode, QR codes, responsive polish, search/filter

## Risks
- PostgreSQL must be available locally or via connection string
- File uploads in local storage won't persist on serverless (OK for MVP)
- TipTap adds bundle size — consider lazy loading
