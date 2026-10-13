# PROJECT_MEMORY.md

Context carried over from a long design session. `KNOWLEDGE.md` holds the rules; this file holds the judgement, decisions and lessons. Read both before changing anything.

Limits: this is a summary written from memory of the session. Page numbers are PDF page indexes and may be off by a page or two. Verify a rule in `reference/*_text.txt` (grep the `[[pN]]` markers) before you rely on a quote or page.

---

## 1. Projects in this repo

1. **Bad Chart Clinic** (`bad-chart-clinic.html`): 50 flawed charts/dashboards. Player diagnoses flaws, picks a fix, sees Before/After, gets a skill radar and a level.
2. **Chart Advisor** (`Chart_Advisor.html`): upload CSV/XLSX, confirm columns, get two chart recommendations with an action title. Rule-based, no AI, runs in the browser.

Both are self-contained HTML, English UI, scoped CSS/JS. They should look like one family (same theme, same attribution text) and link to each other.

## 2. How to review a chart or dashboard (order of questions)

1. **Decision first.** Who decides what? If unknown, say so and ask, or state an assumption.
2. **Message.** Can the main point be said in one sentence? Is it in the title (an action title, not a topic)?
3. **Right visual for the question.** Categories: sorted bars. Time: lines. One or two numbers: text. Two periods across many groups: slopegraph. Build-up: waterfall. Distribution: show points, not only the mean.
4. **Integrity.** Zero baseline for bars; no 3D; no secondary axis; even time steps; no over-zoomed line; forecasts dotted.
5. **Clutter.** Remove borders, heavy gridlines, markers, legends (label directly), rotated text, trailing decimals.
6. **Focus.** Grey base, ONE accent, ~10% highlighted. Colour keeps one meaning across the whole page.
7. **Accessibility.** No red/green alone (add sign, arrow, or use blue/orange). Horizontal text. Readable at the intended distance (phone, wall screen).
8. **Dashboards add:** headline and hierarchy, KPIs with target and trend, key view top-left and large, overview then filter then details, filters labelled where occasional users look, prune KPIs that never change, track usage.

## 3. Weighing rules that collide (examples)

- **"Highlight what matters" vs "colour = value".** A heatmap that darkens the highest values hides a story about the lowest. Colour direction must follow the user's "which direction is good" and make the PROBLEM the most visible thing.
- **Zero baseline vs useful zoom.** Bars: always zero. Lines: non-zero is fine if stated and not over-zoomed (0.4 pts must not look like a surge).
- **No pies vs client insists.** Prefer bars. If forced, flat, few slices, highlight one, pair with a bar. A donut is acceptable for ONE bounded KPI (max 100%). Never use rings for values that can exceed 100%.
- **Averages vs outliers.** If the decision depends on rare slow cases, show every point (strip), not the mean.
- **Complete vs incomplete period.** Exclude it from headline figures, draw it distinctly, and never let it break the colour scale.
- **Tables vs charts.** Tables are right for lookup and exact values; use light rules and emphasise only the exceptions.
- **Headline vs figure labels.** If the headline quotes an average of two periods and the chart label shows the last value, name the basis ("Jul to Aug average") or readers see a contradiction.
- **Rules are strong defaults, not laws.** The UI copy says so.

## 4. Design decisions (Bad Chart Clinic) and why

- **Two-step cases** (diagnose, then pick a fix): diagnosing and fixing are different skills.
- **Decoy flaws** (about 2 per case): wrong ticks cost 1.5 shares; select-all scores zero (anti-gaming).
- **Scoring per case = 100:** diagnosis 60 + fix 40 (best 40, partial 10 to 25, harmful 0).
- **8 skill axes:** CTX, VIS, CLU, FOC, TXT, INT, ACC, DSH. Axis score = accuracy over items actually seen (real flaw ticked = correct, decoy left unticked = correct, plus the fix quality on the case's fix axis). Show N items per axis and flag N < 4 as low confidence.
- **Level** uses average score AND evenness: Master needs every axis >= 60% and low spread; Expert needs every axis >= 45%.
- **Sampler** for 10/25 modes guarantees each axis has about 3 items and keeps a 60/40 chart/dashboard mix. Seeded, so a run is repeatable.
- **Declarative specs, one renderer**: bad and good (and fix previews) are generated from the same spec with flags (rainbow, 3D, gridlines, markers, legend, rotated labels...). Do not hand-draw SVGs.
- **Items per axis were unbalanced at first** (TXT too many, ACC too few, CTX with no decoys). A balance patch retagged flaws and added decoys. Re-check counts whenever cases are added.
- **Attribution and legal:** original fictional cases; "inspired by", not affiliated, may be wrong; never ship the book text files in a public repo.

## 5. Bugs and lessons (check for these again)

| What happened | Prevention |
|---|---|
| Flag `h` used for both "horizontal" and chart height, so a chart rendered 1px high | Never overload spec keys; keep a documented key list |
| Unescaped `&` in an SVG label ("Focus & colour") broke PNG export | Escape all text going into SVG/HTML; validate generated SVG as XML in a test |
| CSS class `.al` clashed between two components | Namespace every class |
| Value outside the colour domain rendered black (heatmap) | Clamp colour interpolation to [0,1] |
| Legends overflowed on narrow widths | Wrap legends; test at 360px |
| A fix preview that only changes a title looked identical to the others | Keep previews visibly different, or say what differs |

Testing that worked: render every spec in Node and fail on `NaN`/`undefined`; headless-browser run through the whole UI; 360px width check (no horizontal scroll); scoring unit tests (perfect = 100 and Master, random = Newbie, select-all = 0 diagnosis); resume after reload; same seed gives the same run.

## 6. Chart Advisor: review findings (to fix first)

Verified by running it on samples and CSV edge cases. Strengths: own XLSX reader (no library), nothing uploaded, handles messy headers and ambiguous dates/numbers by asking, escapes injected HTML, 150k rows in about 6 s, no horizontal scroll at 360px.

Fix, in this order:
1. **Heatmap colour bug:** the last (incomplete) month rendered black and unreadable because its value fell below the colour domain. Clamp, or style incomplete periods distinctly.
2. **Heatmap emphasis:** darkest = highest, outline = highest, but the story is a decline. Make the colour and outline follow the chosen "good direction" so problem cells stand out.
3. **Headline vs label mismatch** (55% "recently" vs 50% end label): name the basis.
4. **Long headlines** (3 lines): short title plus one detail line.
5. **Accessibility:** use the action title as `aria-label` and `<title>/<desc>`, include it in downloaded SVG; note when a line axis is not zero-based.
6. **Attribution:** "all rules come from Storytelling with Data" overclaims (heatmap, dot plot, outlier labels, thresholds like 60% concentration). Say "based on principles from SWD and BBD; thresholds are our own". Change "Never used" to "Not recommended" (donut for a single bounded KPI is acceptable per BBD).
7. **Untested:** real `.xlsx` files (shared strings, merged cells, serial dates). `DecompressionStream` is missing in older browsers (Safari < 16.4, Firefox < 113): show a clear message.

## 7. Chart Advisor: planned "alternatives" feature

Goal: keep the best-practice chart first and unchanged; add up to 2 alternative designs for variety that carry the SAME message.

Rules:
- Best practice is always option 1. Alternatives never replace it.
- Max 2 alternatives shown; the rest behind "Show more options".
- Each alternative has two fixed lines: **"Choose this when..."** and **"Trade-off: ..."**.
- Never offer pie, 3D or secondary axis, even for variety.
- List every trigger condition on the "How it decides" page and in "Chart types considered".
- Every new chart needs: a renderer, a trigger rule, a fixture dataset with the expected result, SVG/PNG export, alt text, and edge cases (negatives, too many categories, empty data).

Phase A (do first): **slopegraph**, **waterfall**, **Pareto**, **strip/distribution**.
Phase B: **lollipop**, **bullet** (per-group targets), **stacked 100%**, **small multiples**.
Deferred: index chart, Gantt (need more specific columns).

| Chart | Offered as alternative to | Data trigger | Choose when | Trade-off |
|---|---|---|---|---|
| Lollipop | sorted bars | one group, many categories | bars feel heavy | slightly less precise |
| Slopegraph | lines / clustered bars | 2 periods x many groups | the focus is rise or fall per group | only two points in time |
| Waterfall | line / bars | start + signed components + end | explaining why it changed | needs signed components |
| Pareto | sorted bars | counts of causes, long tail | a few causes dominate | cumulative line adds reading effort |
| Strip | bar of averages | many rows per group | averages hide outliers | harder with thousands of points |
| Bullet | bar + target line | target per group | actual vs target at a glance | less familiar |
| Small multiples | many-series line / heatmap | group x time, not too many groups | each group read alone | needs space |
| Stacked 100% | bars | composition columns or Likert | mix, not ranking | middle segments hard to compare |

## 8. Working agreement

- **Claude Code builds and tests.** Screenshots of the results go back to the original chat for a design review.
- Make small diffs, not rewrites. Commit in small steps. Keep reference text files out of version control.
- When unsure about a design rule, grep the reference text, then prefer the stricter, simpler option and say why.
