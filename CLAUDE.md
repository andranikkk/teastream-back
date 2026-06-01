# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev        # Hot-reload dev server (port 4000)
npm run build            # Compile TypeScript to dist/
npm run start:prod       # Run compiled production build

# Code quality
npm run lint             # ESLint with auto-fix
npm run format           # Prettier formatting

# Testing
npm run test             # Jest unit tests
npm run test:watch       # Jest watch mode
npm run test:cov         # Jest with coverage
npm run test:e2e         # End-to-end tests

# Database
npm run db:push          # Sync Prisma schema to DB (no migration)
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Seed from src/core/prisma/prisma.seed.ts

# Local infrastructure
docker compose up -d     # Start PostgreSQL, Redis, MinIO
```

## Architecture

NestJS 11 + TypeScript backend for a live video streaming platform. API is **GraphQL-first** (Apollo) with a few REST endpoints for file uploads. Sessions stored in Redis; database via Prisma + PostgreSQL.

### Module layout

```
src/
├── main.ts                    # Bootstrap: session middleware, CORS, ValidationPipe
├── core/
│   ├── core.module.ts         # Root module
│   ├── config/                # Per-service configs (GraphQL, LiveKit, Stripe, Mailer, Telegraf)
│   ├── prisma/                # Global PrismaModule + seed data
│   └── redis/                 # Global RedisModule (ioredis)
├── modules/
│   ├── auth/                  # account, session, profile, verification, password-recovery, totp, deactivate
│   ├── stream/                # Stream CRUD + LiveKit ingress
│   ├── chat/                  # Live chat messages
│   ├── channel/               # Channel profiles
│   ├── category/              # Stream categories
│   ├── follow/                # Follow relationships
│   ├── notification/          # Notifications + user settings
│   ├── sponsorship/           # plan, subscription, transaction (Stripe)
│   ├── webhook/               # Stripe webhook handler
│   ├── cron/                  # Scheduled cleanup/automation tasks
│   └── libs/                  # Thin wrappers: mail, storage (S3/MinIO), livekit, stripe, telegram
└── shared/
    ├── decorators/            # @AuthDecoration(), @Authorized(), @UserAgent(), @IsPasswordMatching()
    ├── guards/                # GqlAuthGuard
    ├── pipes/                 # FileValidationPipe
    └── utils/                 # ms, generate-token, session, session-metadata, file, parse-boolean
```

### Feature module convention

Each module under `modules/` follows the same shape:

```
*.module.ts      NestJS module
*.resolver.ts    GraphQL resolvers
*.service.ts     Business logic (injected PrismaService, RedisService, ConfigService)
*.controller.ts  REST controller (only where file uploads are needed)
inputs/          GraphQL @InputType() DTOs
models/          GraphQL @ObjectType() return types
```

### Authentication & Authorization

- **Session-based** – `express-session` backed by Redis (`connect-redis`).
- `req.session.userId` is the identity source of truth.
- `@AuthDecoration()` – throws `UnauthorizedException` if no session.
- `@Authorized()` – parameter decorator that resolves the full `User` from `PrismaService` and injects it into the resolver/controller argument.
- `GqlAuthGuard` – wraps the above for GraphQL context.

### GraphQL

- Schema auto-generated; output written to `src/core/graphql/schema.gql`.
- Subscriptions enabled (WebSocket transport).
- File uploads via `graphql-upload`.

### External services

| Service | Purpose | Config file |
|---|---|---|
| LiveKit | Video streaming / RTMP ingress | `core/config/livekit.config.ts` |
| Stripe | Sponsorship payments + webhooks | `core/config/stripe.config.ts` |
| MinIO / S3 | Avatar & asset storage | `modules/libs/storage/` |
| Telegram | Bot notifications (2FA, stream alerts) | `core/config/telegraf.config.ts` |
| Mailer (SMTP) | Email verification, password reset | `core/config/mailer.config.ts` |

### Cron jobs (`modules/cron/cron.service.ts`)

- **1 AM daily** – hard-delete accounts deactivated 7+ days ago.
- **Every 4 days** – nudge users without 2FA enabled.
- **2 AM daily** – auto-verify channels that have ≥ 10 followers.
- **3 AM daily** – purge notifications older than 7 days.

## Key conventions

- **Tabs, single quotes, no semicolons, no trailing commas** (see `.prettierrc`).
- Path alias `@/*` maps to `src/*`; `@prisma/generated` maps to generated Prisma client types.
- `strictNullChecks` and `noImplicitAny` are **off** — the codebase relies on this.
- No tests exist yet; Jest is configured and targets `*.spec.ts` files under `src/`.
- Raw body is enabled on the Express adapter (needed by the Stripe webhook controller).

## Environment

Copy `.env` and fill in values. Required groups:

- `DATABASE_URL` – PostgreSQL connection string.
- `REDIS_URI` – Redis connection.
- `SESSION_*` – secret, name, domain, maxAge, secure, httpOnly.
- `S3_*` – endpoint, access key, secret key, bucket name.
- `LIVEKIT_*` – server URL, API key, API secret.
- `STRIPE_*` – secret key, webhook signing secret.
- `TELEGRAM_BOT_TOKEN`
- `MAIL_*` – SMTP host, port, user, password.
- `ALLOWED_ORIGIN` – CORS allowed origin.

Local infrastructure (PostgreSQL 15.2, Redis 5.0, MinIO) is defined in `docker-compose.yaml`.
