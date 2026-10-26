# Timesheet Studio

Buildless, private-review browser tool for W024. Serve `dist/` directly. Korean is the root; English, Spanish, Simplified Chinese, Japanese and German use `/en/`, `/es/`, `/zh/`, `/ja/`, `/de/`. Every route includes a manual language menu and uses the same calculation code with complete static locale catalogs. No uploads, tracking, remote calls or automatic storage.

## Scope and assumptions

- Add, edit and delete up to 200 work records. Each record has an explicit start date, start/finish clock times, an explicit next-day finish checkbox, and integer break minutes.
- Dates are strictly validated within 1900–2100. Clock input is `HH:MM` from `00:00` through `23:59`. A work interval must be longer than zero and no longer than 24 hours. Breaks must be nonnegative integers and shorter than the interval.
- Calculations use local wall-clock minutes, without timezone transitions or daylight-saving adjustments. This is a user-entered timesheet calculator, not a punch-clock instant converter.
- Duplicate and overlapping intervals are rejected, including overlap with a previous day's overnight shift. Adjacent intervals are allowed. Break timing is unspecified, so breaks cannot justify overlapping records.
- Daily and weekly net-minute totals belong to the shift's start date. Weeks begin on Monday. Overnight shifts are not apportioned across calendar dates because no break timestamp is provided. This assumption is visible in all languages.
- Decimal hours are minutes divided by 60, rounded to two decimal places for display/export. Exact integer-minute totals remain available. CSV exports provide both records and daily/weekly summaries in UTF-8 with BOM and quoted fields.
- No wage, statutory allowance or legal overtime classification.

## Verification

Executed from this app directory with the explicit workspace RTK `proxy` wrapper and bundled Node runtime:

```text
node --check dist/core.js
node --check dist/app.js
node test.mjs
```

All commands exited 0. Independent expected-value fixtures passed 480-minute normal/overnight shifts, 421-minute decimal conversion, a 24-hour interval, leap dates, invalid dates and times, pause validation, duplicate and cross-day overlap rejection, adjacent interval acceptance, daily and Monday-week allocation across a week boundary, CSV formatting, and six complete locale catalogs/routes. Browser visual QA is not claimed.

Date/time format reference: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#dates . All interface, code and samples are original. No third-party assets are included.

Release route regression: `node test.mjs` rerun after repairing static route generation. All six HTML titles now match their locale catalogs. Every page has the correct document language and exactly one menu identity each for ko/en/es/zh/ja/de. All existing functional fixtures and the new static-title/menu regression exited 0.

## Public GitHub Pages release

Launch: https://nanalab.kr/timesheet-studio/

Korean is at the root. English, Spanish, Chinese, Japanese and German use `/en/`, `/es/`, `/zh/`, `/ja/`, `/de/`.
GitHub Pages serves `main` → `/docs` using the branch build. No project CNAME is used.

Build: `node scripts/build-public.mjs`. The `dist/` snapshot and its original generators/tests are preserved as the application source. The public build adds metadata, six-locale sitemaps, original JPEG cards, More Apps styling and the existing NaNa publisher integrations. It does not upload selected user files.

Publisher integrations: AdSense, Google Tag Manager, Google Analytics and Cloudflare Web Analytics, with the same publisher settings as the NaNa Lab homepage. These scripts can make network requests independently of local file processing.

Original JPEG cards are rendered from original text and geometry using an installed system font; no font files are redistributed. Existing source references and third-party notices remain applicable.
