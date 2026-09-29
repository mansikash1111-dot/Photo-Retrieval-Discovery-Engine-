# Public Data Collection Sources & Responsible Access

## Supported Sources & Permitted Access Methods

| Source | Slug | Permitted Method / API | Rate Limits & Fallback |
| :--- | :--- | :--- | :--- |
| **Google Play Store** | `google-play` | `google-play-scraper` Python package / Public Play Store RSS | Respects store rate limits; falls back gracefully |
| **Apple App Store** | `apple-app-store` | Apple iTunes RSS Customer Reviews API (`itunes.apple.com/us/rss/...`) | Public RSS API, max 500 items per call |
| **Reddit** | `reddit` | Public Reddit JSON API / PRAW Client (`reddit.com/r/.../search.json`) | Requires descriptive User-Agent header; respects 60 req/min |
| **Google Community**| `google-photos-community` | Google Support Public Threads / RSS Feed | Public community web index |
| **YouTube** | `youtube` | YouTube Data API v3 (`googleapis.com/youtube/v3/...`) | Configurable via `YOUTUBE_API_KEY` |
| **Public Forums** | `forums` | Modular Extensible Interface | Configurable for sites permitting public data indexing |

## Responsible Collection Guidelines
1. **Terms & Robots Restrictions**: The engine does NOT bypass CAPTCHAs, paywalls, or authentication barriers.
2. **Privacy**: Only publicly posted user comments/reviews are collected. PII is not extracted.
3. **Traceability**: All reviews retain original clickable source URLs (`source_url`).
