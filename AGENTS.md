# LLM Left marketing site

## Mission

Build a fast, accessible, search-grounded marketing and download site for LLM Left. The app source of truth is `/Users/ia/code/ios/CodexMeter`.

## Source of truth

1. `docs/REQUIREMENTS.md`
2. `docs/SEO_BRIEF.md`
3. `/Users/ia/code/ios/CodexMeter/README.md`
4. `/Users/ia/code/ios/CodexMeter/PRIVACY.md`
5. `src/config.ts`

Do not invent testimonials, user counts, compatibility claims, provider support, or release availability.

## Architecture

- Astro, TypeScript, and Tailwind CSS v4.
- Product and URL data lives in `src/config.ts`.
- Design tokens live in `src/styles/global.css`.
- SEO metadata and schema live in `src/layouts/Layout.astro`.
- Use static HTML and CSS. Add client JavaScript only when it has a clear need.
- Keep runtime assets local.

## Launch rules

- `https://llmleft.com` is canonical.
- `https://www.llmleft.com` redirects to the canonical host.
- Analytics stay off unless the privacy page and product policy change.
- The Mac release URL must be verified before it changes.
- Do not publish an iPhone download link until a public TestFlight or App Store URL exists.

## Verification

Run `npm ci`, `npm run check`, `npm run build`, and the shared SEO launch checker. Review 1440px and 390px screenshots before release.

