# Paddle — The Daily Sale

A daily auction game. Each day players see five real auction lots and a purse, and try to bid as close to each hammer price as they can.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | The game |
| `lots.json` | The catalogue: every lot, in the order it will appear |
| `about.html`, `privacy.html` | About / How to play and Privacy pages (ad networks require a privacy page) |
| `page.css` | Styling for the About and Privacy pages |
| `favicon.svg` | The little gavel icon in the browser tab |
| `og-image.png` | The preview image shown when the link is shared |
| `robots.txt` | Lets search engines index the site |
| `netlify/functions/scores.mjs` | The small server behind "Better than X% of bidders today" |
| `package.json`, `netlify.toml` | Settings that tell Netlify how to run that server |

## "Better than X% of players"

When someone finishes the daily sale, the game sends their score (just the day number and the score, no personal information) to `/api/scores`. The game then reads back the day's scores to show their percentile and a small chart. Scores are stored in Netlify Blobs, which is free at this scale. Practice games are never sent. If the server can't be reached, the line is simply left off and the game still works.

## How the daily rotation works

Nothing needs to run each day. The game counts days since launch (17 November 2026 is Catalogue No. 1). Day N shows lots `5(N-1)+1` to `5N` from `lots.json`, the same way Wordle stored its answers in advance. Everyone gets the same five lots on the same day, and a new set appears at midnight in each player's own time zone.

There are 117 lots now, which covers 23 days. After that the catalogue loops back to the start, so **keep adding lots**.

## Adding lots

Add new lots to the **end** of `lots.json`, five at a time, one day's sale per group of five. Adding to the end never changes days that have already been played. Each lot looks like this:

```json
{"id": 118, "t": "Title of the lot", "house": "Christie's, New York", "date": "May 2026",
 "p": 1234567, "icon": "watch", "d": "One or two sentences describing it.", "f": "Optional fun fact."}
```

- `p` is the price realised in US dollars, including buyer's premium. Check it against the auction house's own results page.
- `icon` must be one of: watch, bag, dino, car, jersey, card, comic, guitar, shoe, dress, wine, whisky, document, violin, frame, sneaker, cow, sheep, fish, bird, coin, gem, book, toilet, screen, drum, hat, ball.
- Within each group of five, try to mix categories (not two cars on the same day).
- Keep `"f"` short, or leave it out.

## Publishing (GitHub + Netlify, free)

The percentile feature needs Netlify to run a small server function, and **a drag-and-drop deploy won't run it**, so connect the site through GitHub instead (one-time setup, about 10 minutes):

1. Make a free account at github.com, then click **New repository**, name it `paddle`, and create it.
2. On the new repository's page, click **uploading an existing file**, drag in **everything inside this folder** (including the `netlify` folder), and click **Commit changes**.
3. At app.netlify.com, choose **Add new site → Import an existing project → GitHub**, then pick `paddle`. Leave every setting as it is and click **Deploy**. Netlify reads `netlify.toml` on its own.
4. Your site is live at `something.netlify.app`. From now on, any file you change on GitHub goes live within a minute or so.
5. Buy a domain (Namecheap, Porkbun or Cloudflare). In Netlify, go to **Domain management → Add a domain** and follow the steps.

## After you have a domain

- In `index.html`, set `const SITE_URL = "https://your-domain.com";` so shared results link back to your site.
- In `index.html`, change `<meta property="og:image" content="og-image.png">` to the full URL, e.g. `https://your-domain.com/og-image.png` (some apps need the full address).
- In `privacy.html`, replace `hello@YOUR-DOMAIN` with a real email address.
- Paste your analytics snippet where `index.html` says `ANALYTICS`, and uncomment the matching paragraph in `privacy.html`.
