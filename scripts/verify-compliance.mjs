import fs from 'node:fs'
import path from 'node:path'

console.log('--- NEEV SANCTUARY COMPLIANCE & OAUTH VERIFICATION AUDIT ---')

let passed = true
function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`)
  } else {
    console.error(`[FAIL] ${message}`)
    passed = false
  }
}

const outDir = path.resolve('out')
if (!fs.existsSync(outDir)) {
  console.log('[WARN] "out" directory does not exist yet. Run `pnpm build` first to verify static output.')
  process.exit(0)
}

// 1. Verify Homepage
const homeHtmlPath = path.join(outDir, 'index.html')
assert(fs.existsSync(homeHtmlPath), 'Homepage index.html exists in static output')
if (fs.existsSync(homeHtmlPath)) {
  const homeHtml = fs.readFileSync(homeHtmlPath, 'utf8')
  assert(!homeHtml.includes('Sign in with password to continue'), 'Homepage has no blocking authentication wall')
  assert(homeHtml.includes('Neev Sanctuary'), 'Homepage prominently identifies application as Neev Sanctuary')
  assert(homeHtml.includes('Google Workspace Integration'), 'Homepage explicitly mentions Google Workspace Integration')
  assert(homeHtml.includes('/privacy'), 'Homepage links directly to canonical /privacy')
}

// 2. Verify Privacy Policy
const privacyHtmlPath = fs.existsSync(path.join(outDir, 'privacy/index.html'))
  ? path.join(outDir, 'privacy/index.html')
  : path.join(outDir, 'privacy.html')
assert(fs.existsSync(privacyHtmlPath), 'Canonical privacy HTML exists in static output')
if (fs.existsSync(privacyHtmlPath)) {
  const privacyHtml = fs.readFileSync(privacyHtmlPath, 'utf8')
  assert(privacyHtml.includes('Google API Services User Data Policy'), 'Privacy policy contains Google API Services User Data Policy reference')
  assert(privacyHtml.includes('Limited Use requirements'), 'Privacy policy contains verbatim Limited Use clause')
  assert(privacyHtml.includes('calendar.events'), 'Privacy policy documents calendar.events scope')
  assert(privacyHtml.includes('tasks'), 'Privacy policy documents tasks scope')
  assert(privacyHtml.includes('Strict Scope Minimization'), 'Privacy policy documents scope minimization commitment')
  assert(!privacyHtml.includes('https://www.googleapis.com/auth/drive'), 'Privacy policy does not request broad restricted drive scope')
  assert(privacyHtml.includes('firebaseinstallations.googleapis.com'), 'Privacy policy audits firebase installations service')
  assert(privacyHtml.includes('generativelanguage.googleapis.com'), 'Privacy policy audits Gemini AI service & minimization')
  assert(privacyHtml.includes('securetoken.googleapis.com'), 'Privacy policy audits Token Service API')
  assert(privacyHtml.includes('canonical" href="https://neevsanctuary.devamit.co.in/privacy"'), 'Privacy policy has correct canonical tag pointing to /privacy')
}

// 3. Verify Privacy-Policy Redirect
const privacyPolicyHtmlPath = fs.existsSync(path.join(outDir, 'privacy-policy/index.html'))
  ? path.join(outDir, 'privacy-policy/index.html')
  : path.join(outDir, 'privacy-policy.html')
assert(fs.existsSync(privacyPolicyHtmlPath), 'privacy-policy HTML exists in static output')
if (fs.existsSync(privacyPolicyHtmlPath)) {
  const ppHtml = fs.readFileSync(privacyPolicyHtmlPath, 'utf8')
  assert(ppHtml.includes('canonical" href="https://neevsanctuary.devamit.co.in/privacy"'), '/privacy-policy points canonical to /privacy')
  assert(ppHtml.includes('url=/privacy'), '/privacy-policy has meta refresh pointing to /privacy')
}

// 4. Verify No Premature "Google Verified" Claims
const allHtmlFiles = []
function findHtml(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    const full = path.join(dir, item.name)
    if (item.isDirectory()) {
      findHtml(full)
    } else if (item.name.endsWith('.html')) {
      allHtmlFiles.push(full)
    }
  }
}
findHtml(outDir)

let prematureClaims = 0
for (const file of allHtmlFiles) {
  const content = fs.readFileSync(file, 'utf8')
  // We check for "Google Verified" as a standalone badge or claim (ignoring "Google API Verified Policy" title if any)
  if (content.includes('<span>Google Verified</span>') || content.includes('badge: \'Google Verified\'')) {
    prematureClaims++
    console.error(`[FAIL] Found premature "Google Verified" claim in ${file}`)
  }
}
assert(prematureClaims === 0, 'Zero premature "Google Verified" badges found across public templates')

// 5. Verify Sitemap
const sitemapPath = path.join(outDir, 'sitemap.xml')
assert(fs.existsSync(sitemapPath), 'sitemap.xml exists in static output')
if (fs.existsSync(sitemapPath)) {
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf8')
  assert(sitemapXml.includes('https://neevsanctuary.devamit.co.in/privacy<'), 'sitemap.xml contains canonical /privacy')
  assert(!sitemapXml.includes('https://neevsanctuary.devamit.co.in/privacy-policy<'), 'sitemap.xml excludes redirect alias /privacy-policy')
  assert(sitemapXml.includes('https://neevsanctuary.devamit.co.in/terms<'), 'sitemap.xml contains canonical /terms')
  assert(!sitemapXml.includes('https://neevsanctuary.devamit.co.in/terms-of-service<'), 'sitemap.xml excludes redirect alias /terms-of-service')
}

console.log('------------------------------------------------------------')
if (passed) {
  console.log('✅ ALL COMPLIANCE CHECKS PASSED SUCCESSFULLY!')
  process.exit(0)
} else {
  console.error('❌ ONE OR MORE COMPLIANCE CHECKS FAILED.')
  process.exit(1)
}
