<p align="center">
  <img src="./.github/readme-assets/signal.gif" alt="Animated signal / product visual for yashraj-ghemud.github.io" width="100%" />
</p>

<h1 align="center">yashraj-ghemud.github.io</h1>

<p align="center"><strong>A static, client-only single-page weather web app implemented with HTML, CSS and vanilla JavaScript that queries OpenWeatherMap APIs from the browser.</strong></p>

<p align="center"><code>REPO//SIGNAL</code> · <code>SIGNAL / PRODUCT</code> · <code>LOOPING README EXPERIENCE</code></p>

## Live signal

| Lens | Readout |
| --- | --- |
| Portfolio lane | **SIGNAL / PRODUCT** |
| Code surface | **5** tracked files observed |
| Primary materials | **Markdown, HTML, JavaScript, CSS** |
| Verification | **0** test-related files observed |

> A moving scan of the project surface. The animated frame above is a lightweight visual signature; the sections below remain the source of truth for implementation details.

## Motion map

`SIGNAL` → `SHAPE` → `RELEASE`

Use the animated banner as the first signal, then move into the implementation dossier. The recommended next step is to verify the documented setup command against the repository scripts before extending the project.

<details open>
<summary><strong>Open the full project dossier</strong></summary>

## Overview
This repository contains a static SPA (index.html, style.css, script.js) that displays current weather, forecast, and air-quality information by calling OpenWeatherMap APIs directly from the client. The app includes UI features such as theme and unit toggles, recent searches, and animated backgrounds.

## What it does
- Accepts city search input or uses browser geolocation to fetch weather and AQI data (OpenWeatherMap).
- Renders current conditions, forecast/hourly placeholders, and a set of detailed weather metrics (humidity, wind, UV index, sunrise/sunset).
- Provides UI controls: theme toggle (dark/light), temperature unit toggle (°C/°F), recent searches, loader/error UI, and animated backgrounds (clouds, stars, rain, snow).

## Key capabilities
- City search and geolocation-based weather lookup
- Current weather display and forecast/hourly sections (DOM placeholders present)
- Air Quality Index (AQI) and pollutant placeholders
- Animated background effects and basic UX components (loader, toast)
- Theme and temperature unit toggles; recent searches UI

## Technology
- HTML (index.html)
- CSS (style.css) with variables and animations
- Vanilla JavaScript (script.js)
- OpenWeatherMap APIs (client-side calls)
- Google Fonts (Poppins) and Font Awesome (via CDN)

## Repository structure
Top-level files:
- API_KEY_SETUP.md
- README.md (this file)
- index.html
- script.js
- style.css

## Getting started
- There is no build system or CI configuration in the repository; this is a static client-side app.
- To inspect or run the app locally, open index.html in a browser or host the folder with a static file server. (No build step is present in the repository evidence.)
- Review script.js for the API integration and API key handling.
- See API_KEY_SETUP.md (present in the repository) for any guidance the author may have provided about API key placement (do not assume contents).

## Configuration
- API key usage: script.js references an API key constant in client-side code. The repository evidence shows a broken/incorrect assignment: `const API_KEY=[REDACTED]';` — this syntax error will prevent the script from running as-is.
- The app performs API requests directly from the browser to OpenWeatherMap endpoints; API keys in client-side code risk exposure unless keys are restricted or calls are proxied through a backend.

If you want to inspect the configuration and manifests:
- Open script.js to review request logic, referenced DOM IDs (e.g., weatherMain, forecastContainer, aqiCircle, toast), and the API key declaration.
- Open index.html to verify the presence of the elements referenced by script.js (the provided dossier had a truncated index.html, so confirm IDs align).
- Open API_KEY_SETUP.md for any documented instructions about where/how to configure API keys.

## Development and quality notes
- Files follow a separation of concerns: markup (index.html), styles (style.css), behavior (script.js).
- The CSS uses variables and animations and provides a clear visual design foundation.
- Missing in the repository evidence: automated tests, linting, formatting, or CI configurations. There are no unit or E2E tests and no linting configs present.
- Known functional/code issue: the API key line in script.js contains a syntax error and must be corrected before the app will function.
- Confirm that the DOM element IDs referenced in script.js exist in index.html; update either file to align IDs where necessary.

## Safety and responsible use
- API keys in client-side code are a security risk: the repository shows an API key constant in script.js (redacted in the supplied evidence). Do not commit real API keys to the repository or history.
- Recommendations based on repository findings:
  - Avoid storing service credentials in frontend code. Use a serverless proxy or backend to keep keys in environment variables.
  - If a client-side key is unavoidable, restrict it by provider controls (HTTP referrers, IPs) where supported.
  - Add input validation/sanitization for user-provided city names before inserting content into the DOM.
  - Consider adding a Content Security Policy (CSP) at hosting time to reduce risk from injected scripts/resources.

## Contributing
If you want to contribute, useful, evidence-based first steps include:
- Fix the broken API_KEY declaration in script.js (correct the syntax) without committing any real secret to the repo.
- Confirm and align DOM IDs between index.html and script.js so referenced elements exist.
- Improve error handling around network/API calls and add clear user-facing messages for failures or rate limiting.
- Remove any real API keys from repository history if they exist and move key usage to a server-side or serverless proxy.
- Add basic tooling: linting configuration (ESLint), formatting (Prettier), and tests for utility functions and API-handling logic; then consider CI to run those checks.

Note: there is no CONTRIBUTING.md present in the documented files.

(For contributors: inspect index.html, script.js, style.css, and API_KEY_SETUP.md in your editor to start.)

--- 

No license file or license metadata was found in the provided repository evidence, so no license is stated here.

</details>

---

<p align="center"><sub>README motion system · visual layer by RepoSignal · implementation details remain project-specific</sub></p>
