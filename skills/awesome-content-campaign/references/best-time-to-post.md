# Best time to post — the shipped table

The windows a campaign schedules into when the user takes the recommended option. This file ships with the skill so an ordinary run spends no time researching what somebody already measured; it is refreshed only when the user asks for it, never silently.

Every time below is **local time in the publication timezone the interview collected**, not UTC, except the two rows that say UTC because their audience is global. Days are named where the measurement names them.

## How to read a row

`Measured` rows come from a published study with its sample size. `Class default` rows have no public dataset of their own, so they carry the window of the class they belong to, and they say so. A class default is a starting point, not a finding: where the user's own `publish-state/performance.md` holds three or more posts for that platform, its median beats everything here.

One window is never a schedule. The campaign spreads slots across the window on a varied minute, so five platforms do not fire at :00 together, and it never puts two posts on one platform inside two hours.

## The table

| Platform | Best window | Best days | Basis |
| --- | --- | --- | --- |
| `linkedin` | 08:00-11:00, second peak 15:00-18:00 | Tue-Thu | Measured, and the two windows come from studies that disagree: Buffer's 5M posts put the peak at 15:00-18:00 Wed-Fri, the 4.8M-post analysis puts it at 08:00-11:00 Tue-Thu. Take the morning window by default and say which was used |
| `x` | 08:00-11:00 | Tue-Thu, Wed strongest | Measured, Buffer, about 8.7M posts |
| `bluesky` | 09:00-12:00, second peak 18:00-21:00 | Tue-Thu, Wed strongest | Measured, several 2026 agency datasets agreeing on the mid-morning peak |
| `threads` | 07:00-12:00 | Tue-Thu, Wed strongest | Measured, Buffer, about 2.5M posts |
| `facebook-wall`, `facebook-page` | 08:00-12:00 | Tue-Thu, Wed strongest | Measured, Buffer, 52M posts across platforms |
| `instagram` | 09:00-11:00, second peak 18:00-20:00 | Tue-Thu | Measured, Buffer plus Metricool's 2026 Instagram study, which also finds a 06:00-09:00 lift and a 14:00 lunch peak |
| `tiktok` | 18:00-23:00, plus weekend mornings | Sat-Sun, then Mon | Measured, Buffer 7.1M posts and Metricool's 2026 study of 2M+ posts |
| `youtube` | 16:00-19:00 for a short, 18:00-22:00 for a long video | Fri-Sat for shorts, Sun-Tue for long | Measured, Buffer |
| `pinterest` | 13:00-15:00, second peak 20:00-23:00 | weekdays | Measured, 2026 platform guides |
| `telegram` | 13:00-16:00 for a work audience, 18:00-22:00 for a general one | Mon-Fri | Measured, 2026 channel datasets |
| `reddit`, `lemmy` | 14:00-17:00 **UTC** | Tue-Thu | Measured, a 2026 analysis of 12 developer-tool subreddits; the window catches the European afternoon and the start of the US East Coast day |
| `hackernews` | 14:00-17:00 **UTC** | Tue-Thu | Measured, the same window in hours: 09:00-12:00 US Eastern, which is when the audience is awake and the author can answer comments |
| `mastodon`, `pixelfed` | 09:00-12:00, second peak 18:00-21:00 | Tue-Thu | Class default, fediverse: no ranking algorithm, so a post reaches the followers who are online at that minute and the window is simply when they are |
| `minds`, `bastyon`, `truthsocial`, `mewe`, `vk-wall`, `flipboard` | 09:00-12:00, second peak 18:00-21:00 | Tue-Thu | Class default, general feed |
| `devto`, `hashnode`, `hackernoon`, `medium`, `substack`, `telegraph`, `teletype`, `blogger`, `mataroa`, `livejournal`, `dreamwidth`, `wonderful-dev`, `daily-dev`, `github-gists` | 08:00-11:00 | Tue-Thu | Class default, article: these surfaces draw from search and from feeds over days, so the slot decides the first hours rather than the life of the post |
| `quora`, `peerlist` | 08:00-11:00 | Tue-Thu | Class default, search-led |
| `tumblr`, `deviantart` | 12:00-15:00, second peak 19:00-22:00 | Thu-Sun | Class default, hobby feed with a weekend skew |
| `imgur`, `flickr` | 11:00-13:00, second peak 19:00-21:00 | Tue-Thu | Class default, visual feed |
| `ko-fi`, `buymeacoffee`, `patreon` | 10:00-12:00 | Tue-Thu | Class default, supporter feed: these notify by email, so the window matters less than the day |

## What the table does not decide

- **The user's own numbers win.** Three or more recorded posts for a platform in the publisher's `publish-state/performance.md` beat every row here, and the manifest says which rows were overridden that way.
- **The audience's timezone, not the author's.** A campaign written in Kyiv for a US audience schedules against the US working day; the interview's publication timezone is what the times are computed in, and a mismatch between the two is worth saying out loud once.
- **Frequency comes from the interview**, not from the window. A window wide enough for three slots does not mean three posts.
- **A platform whose row is a class default is marked as such in the manifest**, so a thin result is traceable to a missing dataset rather than to the schedule.

## Refreshing it

Checked: 2026-09-16. Sources: Buffer's 52M-post analysis, Sprout Social's ~2B engagements across ~307k profiles (Nov 2025 to Feb 2026), Metricool's 2026 Instagram and TikTok studies, a 2026 analysis of 12 developer-tool subreddits, and the platform guides named per row.

A refresh is a user decision, and the run offers it once at the start: use this table, or rescan. On a rescan, replace a row only where a current published study says something different, keep the row's basis and sample size, move the checked date, and report what changed. A row nobody found new data for keeps its old date rather than inheriting today's. Never edit this file during an ordinary run.
