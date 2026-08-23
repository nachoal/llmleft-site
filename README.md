# LLM Left site

The public marketing and download site for [LLM Left](https://llmleft.com).

## Local work

```sh
npm ci
npm run check
npm run build
npm run dev
```

Brand PNG files are deterministic and can be rebuilt with `npm run assets` on macOS.

## Release data

The product version, download URL, SHA-256 value, and system requirements live in `src/config.ts`. Verify the signed release before changing them.

## Deployment

The Cloudflare Pages project is `llmleft-site`. Pushes to `main` deploy to production. The canonical host is the apex domain. The `www` host redirects to it.

## Analytics

No analytics script is installed. This matches the product privacy boundary.

