# Neev Official Website & Sanctuary Showcase

The official website, visual sanctuary showcase, compliance disclosures, and legal documentation for **Neev — The Modern Indian Family OS**.

Deployed globally to Cloudflare Workers edge network via Wrangler with custom domain routing.

- **Live Site**: [https://neev.devamit.co.in](https://neev.devamit.co.in)
- **Cloudflare Edge**: [https://neev-site.amit98ch.workers.dev](https://neev-site.amit98ch.workers.dev)
- **Privacy Policy**: [https://neev.devamit.co.in/privacy-policy](https://neev.devamit.co.in/privacy-policy)
- **Terms of Service**: [https://neev.devamit.co.in/terms](https://neev.devamit.co.in/terms)
- **Mobile App**: [https://github.com/devamitch/neev](https://github.com/devamitch/neev)
- **Web App**: [https://github.com/devamitch/neev-v2](https://github.com/devamitch/neev-v2)
- **Architect & Author**: [Amit Chakraborty](https://devamit.co.in) (@devamitch)

---

## Architecture & Design

- **Vite 6 + React 19** with TypeScript
- **Tailwind CSS v4** featuring authentic Pista (`#7D8C7D`) and Terracotta (`#D35400`) palettes
- **Motion & Physics**: GSAP and Framer Motion layout transitions
- **Comprehensive Compliance**: Full Google API Limited Use disclosure, granular permission breakdowns for Google Maps Platform, Gemini AI, Calendar, Tasks, Drive, Gmail, Photos, and Contacts
- **Advanced SEO, GEO & AEO**:
  - Full Schema.org JSON-LD graph (`WebSite`, `Organization`, `SoftwareApplication`, `BreadcrumbList`, `FAQPage`)
  - Precise Geotagging (`geo.region`, `geo.placename`, `geo.position`, `ICBM`)
  - AI Crawler optimization and explicit crawler directives (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`)
  - Verified `sitemap.xml` and `robots.txt`

---

## Local Development

```bash
pnpm install
pnpm run dev
```

## Production Build & Deploy

```bash
# Build optimized static distribution
pnpm run build

# Deploy directly to Cloudflare Workers with custom domain binding
npx wrangler deploy
```

---

## License

MIT © Amit Chakraborty
