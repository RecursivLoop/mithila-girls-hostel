# Majanki Girls Hostel — Website

Home away from home. Girls' hostel in Kankarbagh, Patna.

## Local preview

```bash
npm install
npm start          # static preview at http://localhost:3000
# or
npm run dev        # vercel dev — includes /api routes (needs vercel CLI)
```

## Environment variables (Vercel dashboard)

Copy `.env.example` to `.env.local` for local API testing.

| Var | Purpose |
|-----|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Service role key (server-only) |
| `RESEND_API_KEY` | Resend email API key |
| `NOTIFY_EMAIL` | Where enquiries are emailed |

## Deploy

```bash
vercel --prod
```

## Supabase schema

Run `supabase/schema.sql` in the Supabase SQL editor once.
