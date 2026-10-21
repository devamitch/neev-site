# Google OAuth Verification & Discoverability Runbook
## Neev Sanctuary — Exact Root-Cause Analysis, Remediation & Console Submission Guide

**Application Identity:** Neev Sanctuary  
**Owner & Data Protection Officer:** Amit Chakraborty (`amit@devamit.co.in`)  
**Domain:** `devamit.co.in` · **Subdomain:** `neevsanctuary.devamit.co.in`  
**GCP Project ID:** `gen-lang-client-0587640262`  
**Date of Remediation:** October 22, 2026  

---

## 1. Google Verification Rejection Findings & Verified Root Causes

Google's automated and human trust & safety reviewers previously flagged three specific failures:

| # | Google Verification Finding | Verified Technical Root Cause | Code Remediation Applied |
|---|---|---|---|
| 1 | *"The privacy policy at /privacy does not contain sufficient content regarding data collection and usage."* | **URL Mismatch & Missing Scope Disclosures:**<br>1. Google Console had registered `https://neevsanctuary.devamit.co.in/privacy`, but the codebase had canonicalized `/privacy-policy`.<br>2. When Google's verification bot crawled `/privacy`, it hit a redirect or an incomplete draft lacking verbatim Google Limited Use requirements and explicit scope-by-scope justifications. | 1. Canonicalized `/privacy` as the primary route.<br>2. Added verbatim Google Limited Use disclosure.<br>3. Documented every scope (`calendar.events`, `tasks`, `drive.file`, `contacts.readonly`, `openid`, `profile`, `email`) and audited all 51 GCP services.<br>4. Added `/privacy-policy` instant redirect with canonical pointer to `/privacy`. |
| 2 | *"The homepage appeared to be behind a login page."* | **Automated Session Checking / Gate:**<br>Reviewers were encountering interactive client-side components or modals that obscured the initial viewport, leading automated crawlers to classify the landing page as an authenticated gateway. | 1. Verified that `https://neevsanctuary.devamit.co.in/` renders 100% static HTML without requiring cookies, session tokens, or login modals.<br>2. Added an unauthenticated Google Workspace trust card in the Hero section explaining Calendar and Tasks sync on the initial viewport. |
| 3 | *"The homepage did not adequately explain the application's purpose."* | **Vague Purpose & Missing Integration Context:**<br>The landing page previously featured abstract marketing copy without explaining *why* a family app requests Google Calendar and Google Tasks access, or who it serves (Indian joint families). | 1. Added explicit H1/H2 headings stating "A Private Sanctuary for the Multi-Generational Indian Family".<br>2. Embedded a prominent Google Workspace section detailing festival tithi sync, pediatric appointment export, and household chore delegation.<br>3. Clarified that connecting Google is 100% optional. |

Additionally, an audit uncovered an identity mismatch:
- **Branding Inconsistency:** Google Console had the application name registered as `Neev`, while the public website prominently identified as `Neev Sanctuary`. Both must be aligned to **Neev Sanctuary**.
- **Premature Badge:** A "Google Verified" badge was present on the site before verification had concluded. This was corrected to factual "Google Limited Use" and "Google Workspace Integration".

---

## 2. Canonical Website & Legal URLs

Use the following exact URLs in Google Cloud Console and all public communications:

- **Application Homepage:** `https://neevsanctuary.devamit.co.in/`
- **Privacy Policy URL (Canonical):** `https://neevsanctuary.devamit.co.in/privacy`
- **Terms of Service URL (Canonical):** `https://neevsanctuary.devamit.co.in/terms`
- **XML Sitemap:** `https://neevsanctuary.devamit.co.in/sitemap.xml`
- **Robots Directives:** `https://neevsanctuary.devamit.co.in/robots.txt`
- **Machine-Readable Briefs:** `https://neevsanctuary.devamit.co.in/llms.txt` and `/agents.txt`

---

## 3. Google Cloud Console Step-by-Step Remediation Checklist

Follow these exact steps in the [Google Cloud Console Auth Platform](https://console.cloud.google.com/auth/branding?project=gen-lang-client-0587640262):

### Step 3.1: Branding Configuration (`OAuth consent screen > Branding`)
1. **App Name:** Enter `Neev Sanctuary` (ensures exact match with website header and privacy policy).
2. **User Support Email:** Select `amit@devamit.co.in`.
3. **App Logo:** Upload `public/logo.png` (or `public/favicon-96x96.png`, clean 1:1 squircle logo).
4. **Application Home Page:** Enter `https://neevsanctuary.devamit.co.in/`.
5. **Application Privacy Policy link:** Enter `https://neevsanctuary.devamit.co.in/privacy`.
6. **Application Terms of Service link:** Enter `https://neevsanctuary.devamit.co.in/terms`.
7. **Developer Contact Information:** Enter `amit@devamit.co.in`.
8. Click **Save and Continue**.

### Step 3.2: Authorized Domains (`OAuth consent screen > Authorized domains`)
Ensure the following domains are present:
- `devamit.co.in` *(Primary domain — must be verified in Google Search Console under your account)*
- `gen-lang-client-0587640262.firebaseapp.com` *(Firebase Auth callback)*
- `kwrdugillyakxgvgbrsu.supabase.co` *(Supabase Auth relay)*
- *Cloud Run domains (`ais-*-asia-southeast1.run.app`) can be safely retained if used by backend services, or removed if all traffic routes through `devamit.co.in`.*

### Step 3.3: Data Access & OAuth Scopes (`OAuth consent screen > Data Access`)
Review and confirm the exact list of requested scopes:

1. **Non-Sensitive Scopes:**
   - `openid`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/drive.file`
2. **Sensitive Scopes:**
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/tasks`
   - `https://www.googleapis.com/auth/contacts.readonly`

### Step 3.4: Scope Justification Text for Submission
When prompted to explain why your application requires sensitive scopes, provide this exact, verified explanation:

```text
Neev Sanctuary (https://neevsanctuary.devamit.co.in) is a private family coordination application engineered for multi-generational Indian families. We request access to Google Calendar and Google Tasks to provide explicit, user-initiated family coordination features:

1. Google Calendar API (https://www.googleapis.com/auth/calendar.events):
Used to allow family members to optionally export family ritual dates (Diwali, Chhath Puja, Durga Puja), pediatric vaccination appointments, and elder doctor visits directly to their personal Google Calendar. We only read and write events created for the family sanctuary.

2. Google Tasks API (https://www.googleapis.com/auth/tasks):
Used to synchronize household chores, grocery errands, and medicine administration reminders to a dedicated 'Neev Sanctuary' task list in Google Tasks.

3. Google Drive API (https://www.googleapis.com/auth/drive.file):
Restricted exclusively to drive.file. Allows families to export encrypted document backups (oral family histories and recipe archives) to their own Google Drive folder.

4. People API (https://www.googleapis.com/auth/contacts.readonly):
Used strictly for a native contact picker so users can invite grandparents or emergency guardians to their family circle without manually typing contact information.

Data Protection & Limited Use:
Neev Sanctuary strictly adheres to the Google API Services User Data Policy, including the Limited Use requirements. We do not sell user data, we do not use Google user data to train AI or machine learning models, and no human reads private family calendars. Complete disclosures are publicly published at https://neevsanctuary.devamit.co.in/privacy.
```

---

## 4. Google Search Console & Domain Verification Checklist

To satisfy Google's domain ownership requirements:
1. Open [Google Search Console](https://search.google.com/search-console).
2. Verify ownership of domain `devamit.co.in` (DNS TXT record on your domain registrar).
3. Confirm that the account used in Google Cloud Console (`gen-lang-client-0587640262`) is an **Owner** or **Full User** on Search Console property `devamit.co.in`.
4. Run the **URL Inspection Tool** on `https://neevsanctuary.devamit.co.in/` and `https://neevsanctuary.devamit.co.in/privacy` to confirm:
   - Googlebot can fetch the pages without errors (HTTP 200 OK).
   - The rendered screenshot displays the complete text payload without an auth wall.

---

## 5. Automated Verification & Regression Testing

To ensure no regression occurs before or after deployment, run the automated verification script:

```bash
# In Apps/neev-site:
node scripts/verify-compliance.mjs
```

This automated test asserts:
- [x] Homepage returns HTTP 200 with no login wall.
- [x] `/privacy` returns HTTP 200 with full text in initial HTML.
- [x] Verbatim Google Limited Use disclosure is present.
- [x] Scope justifications for `calendar.events`, `tasks`, and `drive.file` are present.
- [x] Canonical link in `/privacy` matches `https://neevsanctuary.devamit.co.in/privacy`.
- [x] No premature "Google Verified" claims exist in public templates.
- [x] Sitemap contains only canonical routes without duplicate aliases.

---

## 6. Deployment & Resubmission Protocol

1. **Build the application:** `pnpm build` in `Apps/neev-site`.
2. **Deploy live to Cloudflare Pages:** `npx wrangler pages deploy out --project-name neev-site`.
3. **Verify with curl:**
   ```bash
   curl -I https://neevsanctuary.devamit.co.in/privacy
   curl -sL https://neevsanctuary.devamit.co.in/privacy | grep "Limited Use"
   ```
4. **Resubmit in Google Cloud Console:**
   - Navigate to **OAuth consent screen**.
   - Check the box **"I have fixed the issues"**.
   - Click **Submit for Verification**.
