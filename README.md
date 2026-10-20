# Neev Sanctuary Official Website

The official website, visual sanctuary showcase, compliance disclosures, and legal documentation for **Neev Sanctuary: The Modern Indian Family OS**.

Engineered alongside **Setu** and **BlinkQuest** in the Amit Chakraborty ecosystem. Deployed globally to Cloudflare Workers edge network via Wrangler with dual custom domain routing (`neev.devamit.co.in` & `neevsanctuary.devamit.co.in`).

- **Live Primary Site**: [https://neev.devamit.co.in](https://neev.devamit.co.in)
- **Sanctuary Domain**: [https://neevsanctuary.devamit.co.in](https://neevsanctuary.devamit.co.in)
- **Cloudflare Edge**: [https://neev-site.amit98ch.workers.dev](https://neev-site.amit98ch.workers.dev)
- **Sitemap XML**: [https://neev.devamit.co.in/sitemap.xml](https://neev.devamit.co.in/sitemap.xml)
- **Robots TXT**: [https://neev.devamit.co.in/robots.txt](https://neev.devamit.co.in/robots.txt)
- **Privacy Policy**: [https://neev.devamit.co.in/privacy-policy](https://neev.devamit.co.in/privacy-policy)
- **Terms of Service**: [https://neev.devamit.co.in/terms](https://neev.devamit.co.in/terms)
- **Mobile App**: [https://github.com/devamitch/neev](https://github.com/devamitch/neev)
- **Web App**: [https://github.com/devamitch/neev-v2](https://github.com/devamitch/neev-v2)
- **Architect & Author**: [Amit Chakraborty](https://devamit.co.in) (@devamitch)

---

## Architecture & Design (Parity with Setu & BlinkQuest)

- **Next.js 16 (Turbopack)** with Static HTML Export (`output: 'export'`)
- **Lenis** smooth wheel and touch inertia scrolling
- **Tailwind CSS v4** featuring authentic Pista (`#6B856E`) and Terracotta (`#DA7756`) harmonies
- **Apple Large Title Header Pattern** with Fraunces serif grand titles & Geist subtitles
- **Living Mascot Animation Engine**: Breathing, curious tilt, joyful hop, and sprout leaf motion
- **Flat Zero-Shadow Squircle UI/UX**: Crisp hairlines (`rgba(14, 30, 27, 0.07)`), porcelain ivory surfaces (`#FAFBF9`), and obsidian grounding (`#192216`)
- **Comprehensive Google Compliance**: Full Google API Limited Use disclosure, granular permission breakdowns for Google Maps Platform, Gemini AI, Calendar, and Tasks
- **Ultra SEO, GEO & AEO**:
  - Full Schema.org JSON-LD graph (`WebSite`, `Organization`, `SoftwareApplication`, `FAQPage`)
  - Precise Geotagging (`geo.region`, `geo.placename`, `geo.position`, `ICBM`)
  - AI Crawler optimization and explicit crawler directives (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`)
  - Dynamic `app/sitemap.ts` and `app/robots.ts`

---

## Local Development

```bash
pnpm install
pnpm run dev
```

## Production Build & Deploy

```bash
# Build optimized static distribution into out/
pnpm run build

# Deploy directly to Cloudflare Workers with custom domain binding
npx wrangler deploy
```

---

## License

MIT © Amit Chakraborty
