# KNOWLEDGE.md — Data Visualization Rules Distilled

Sources (keep in `reference/` if available):
- **SWD** = *Storytelling with Data*, Cole Nussbaumer Knaflic (Wiley, 2015)
- **BBD** = *The Big Book of Dashboards*, Wexler / Shaffer / Cotgreave (Wiley, 2017)
- **HTML** = "From Showing Data to Telling a Story" (study guide derived from SWD; contains 9 clinic cases, 7 exercises, labs, checklist)

Page numbers are PDF page indexes. Use them to verify a rule before writing an explanation.
Do not copy figures or text from the books; write original cases and original wording.

---

## 1. Process (SWD)
1. **Context** (SWD 35-49): who (named decision maker), what (know/do), how (data as evidence). Mechanism: live talk vs written/dashboard vs "slideument". Tone. Big Idea = point of view + stake + complete sentence. 3-minute story. Storyboard on paper first.
2. **Choose visual** (SWD 51-85).
3. **Eliminate clutter** (SWD 87-114).
4. **Focus attention** (SWD 115-142).
5. **Think like a designer** (SWD 143-166): affordances, accessibility, aesthetics, acceptance.
6. **Tell a story** (SWD 181-201): setup / conflict / resolution; horizontal & vertical logic; reverse storyboarding; bing-bang-bongo.

Exploratory vs explanatory: show the pearls, not the oysters (SWD 35-36).

## 2. Hard rules
| Rule | Detail | Source |
|---|---|---|
| Bars start at zero | Eyes compare bar ends. Line/dot plots may use non-zero baseline, but say so. Ethics: manipulating a scale destroys credibility. | SWD 66-69, BBD 62, 331 |
| No pie / donut / 3D / secondary y-axis | Angles/arcs are hard to judge; 3D skews values; dual axis implies false relationship. Alternatives: sorted horizontal bars, direct labels, two panels sharing x. | SWD 77-85 |
| Exceptions (BBD) | Donut for a single bounded KPI (occupancy, max 100%); pies on maps for part-to-whole; if boss insists, pair with bar chart/highlight one slice. | BBD 191, 415-421 |
| Sort categories | Natural order if exists, else descending. Keep the same order across a story sequence. | SWD 74, 235-243 |
| Horizontal bars for long labels | Label read before data. | SWD 73 |
| Stacked bars | Only the base segment shares a baseline: put the key series there. 100% stacked horizontal for Likert (common baselines both ends). | SWD 70-75, BBD 247-248 |
| Lines | Even time steps; forecast = thinner dotted + light shading; label directly. | SWD 62, 170-172 |
| Small numbers | One or two numbers: use text, not a chart. | SWD 54-55 |
| Tables | Lookup, mixed units, mixed audience. Light/no borders, right-align numbers. Heatmap/highlight table to add cues. | SWD 56-59, BBD 384, 320 |
| Clutter | Remove chart border, gridlines (or light grey), markers, trailing zeros, diagonal text. Direct labels, matching colors. Keep $, %, thousands separators. | SWD 106-114 |
| White space | Not wasted. Never add data to fill space. Left-align; title/axis title top-left. | SWD 98-103 |
| Contrast | Hawk among pigeons: only the point differs. | SWD 102, 134 |
| Preattentive attributes | Quantity-capable: position, length (width/size/intensity limited). Category-only: hue, shape, orientation, enclosure, added marks. Avoid blinking/flying animation. | SWD 118-132 |
| Color recipe | Grey base, one accent. Highlight at most ~10% of the design. Consistent color meaning. Rainbow = nothing stands out. | SWD 133-137, 145 |
| Colour-blindness | ~8% men, ~0.5% women. Avoid red/green together or add second cue (arrow, +/-, size, value). Blue/orange is safe. Also watch brown/orange/green, blue/purple, pink/grey. | SWD 137; BBD 36-39, 408-413 |
| Short-term memory | About 4 chunks. Avoid 7-series legends; 8 colors is the limit. | SWD 117, BBD 388 |
| Titles | Action title (conclusion/ask), every chart and axis titled, annotate spikes. Rare exception: deliberately unlabeled axis. | SWD 157-160 |
| Dark backgrounds | Avoid; if forced, grey base + white accent; neon on black is loud. | SWD 224-226, BBD 144, 162 |
| Fonts | One legible font; fussy font = "hard to read, hard to do". | SWD 155-156 |

## 3. Dashboard principles (BBD)
- Definition: a visual display of data used to monitor conditions and/or facilitate understanding (BBD 16).
- Match the scenario to the pattern, then to the audience mechanism (static PDF/email, mobile, wall screen, interactive).
- Overview first → zoom and filter → details on demand (Shneiderman) (BBD 130, 225, 429).
- KPIs as big numbers, doubling as color legend (BBD 252, 303, 309).
- Reference lines/targets give context; bullet/pace charts for actual vs target (BBD 112, 349).
- Filters: top-left for occasional users; right side OK only when users are trained (BBD 94-95, 234).
- Every decision is a compromise; one chart cannot answer every question (BBD 53).
- Challenge the brief: why so many KPIs? (BBD 123). Review KPIs, track usage, talk to users, starter dashboards (BBD 400-407).
- Make dashboards personal rather than "flashy"; avoid packed bubbles / word clouds; lollipop is a compromise (BBD 356-369, 422-427).
- All dashboards are incomplete: unknown unknowns (BBD 428-434).
- Design to a grid; light separators; avoid borders around everything (BBD 248, 264, 284, 321, 353).
- Interactivity only when it adds insight; not on small touch screens by default (BBD 344).
- Do not rotate text; place labels left of bars (BBD 96, 115, 321).
- Static email dashboards: key findings as bullets on top, readable in 2 minutes (BBD 112-114).
- Individual-level data beats aggregates when each record is a person/event (BBD 159-160, 180).
- Show distributions, not just averages; NPS: show neutrals, not only the score (BBD 211-213).

## 4. Scenario → pattern (BBD chapter map)
| Need | Pattern | Ch. |
|---|---|---|
| Individual vs peer/college | dot plot (aggregated) / jitterplot (individual) | 2, 3 |
| What-if | sliders + linked charts, consistent color | 4 |
| This quarter vs prior / YoY | index chart (x = week of quarter), key numbers | 5, 10 |
| Rank now vs then | sorted bars + reference line + % diff + sparkline + significance dot | 6 |
| On pace to goal | pace chart / bullet, normalized to goal | 7 |
| Hundreds of KPIs | filtered KPI list with shapes + sparklines + definitions | 8 |
| Operations monitoring | area sparklines + bullets + last-inspection flag | 9 |
| Mobile YTD/YoY | vertical cards, bars + ref lines + lines | 10 |
| Player/individual history | normalized dot plot with latest/recent/all colors | 11 |
| Running score story | cumulative lines + spatial map | 12 |
| Simple web metrics | bars + one color + tooltips | 13 |
| Individual event histories | dot timeline per patient | 14 |
| Range/spread | band + average line, indexed values | 15 |
| Sentiment distribution | histogram + jitter dot plot + sparkbars | 16 |
| NPS / Likert | divergent stacked bars (+ neutrals) | 17 |
| Process failures | bar overview → Gantt → detail | 18 |
| Single index many views | map + sorted bar + timeline | 19 |
| Complaints | stacked bar (open at base) + hex map as filter | 20 |
| Schedule accuracy | calendar heat map + Gantt scheduled vs actual | 21 |
| Rank and magnitude | sorted bars; bump chart only if magnitude irrelevant | 22 |
| Many measures/dimensions | everything is a filter, KPI selector | 23 |
| Gains/losses, churn | waterfall + highlight table | 24 |
| Actual vs potential | bullet + stacked + KPI dots | 25 |
| Provider productivity | small multiples with median reference, print-friendly | 26 |
| Executive telecom | goal rows + exec summary column, trailing labels | 27 |
| Economy snapshot | responsive cards + commentary + source links | 28 |
| Call center wall screen | grid, bullet, 60s refresh | 29 |
| Time questions | slope, cycle plot, heat table, bump, index, Gantt, jump plot | 31 |

## 5. Seed bad-chart patterns (from HTML clinic; recreate with original data)
1. Rainbow 3D pie → sorted bars, top 3 accent.
2. Dual axis, rotated labels → two panels sharing x.
3. Truncated bar axis → zero baseline + target line.
4. Spaghetti line chart → grey context, one accent, direct labels.
5. Wall of 12 equal KPI tiles → vital few + target + trend.
6. Rainbow stacked column → focus series at base, rest grey.
7. Heavy-border data dump table → light rules, sorted, outliers only.
8. Donut gauges → sorted bars + ceiling line.
9. Neon on black → grey base + white accent.

## 6. Skill axes and tags (for scoring)
`CTX` context and message · `VIS` visual choice · `CLU` clutter · `FOC` focus and color · `TXT` text and titles · `INT` data integrity · `ACC` accessibility · `DSH` dashboard design

Every flaw in a case carries exactly one primary tag (optionally one secondary). Aim for balanced coverage across all 50 cases (about 25-35 flaws per axis).

## 7. Rules for writing cases
- All data fictional; wording original; no copied figures.
- Each case: context sentence (audience + decision), "bad" spec, 5-8 candidate flaws (2 decoys with explanation), 3-4 fix options (1 best, 1-2 partial, 1 harmful), "good" spec, per-flaw reason and source page.
- Action titles in the "good" version must be computed from the data shown.
