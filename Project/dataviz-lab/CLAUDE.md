# CLAUDE.md

Data-visualisation learning tools: **Bad Chart Clinic** (quiz game) and **Chart Advisor** (rule-based chart recommender). Self-contained HTML, English UI, no external requests.

## Read before changing anything
1. `KNOWLEDGE.md`: distilled design rules with page references.
2. `PROJECT_MEMORY.md`: how to review, how rules collide, design decisions, past bugs, Chart Advisor fixes and the planned "alternatives" feature.
3. `reference/SWD_text.txt` and `reference/BBD_text.txt`: plain-text book extracts with `[[pN]]` PDF-page markers. Use grep to verify a rule. They are personal study material: never commit them (they are in `.gitignore`) and never copy their text into the product.

## Rules of work
- Small diffs; do not rewrite files that work. Commit in small steps.
- Keep each tool self-contained and scoped (`#dvq` for the Clinic). Namespace new CSS classes and never reuse a spec key for two meanings.
- Escape all text that goes into HTML or SVG. Clamp colour scales. Test at 360px width.
- The tools must obey the rules they teach: action titles, grey base with one accent, no pie/3D/secondary axis in "recommended" outputs, colour-blind-safe colours.
- All cases, data and wording are original and fictional. Keep the attribution text ("inspired by", not affiliated, may be wrong) on both tools.
- Add tests with every new chart or case: render without `NaN`/`undefined`, scoring maths, fixtures with expected results.

## Current priorities
1. Fix the Chart Advisor heatmap bug and emphasis logic (see `PROJECT_MEMORY.md` section 6).
2. Add alternative chart options, Phase A first (slopegraph, waterfall, Pareto, strip), then Phase B.
3. Link the two tools to each other with a shared theme and attribution.

## When done
Report what changed and how you tested it. The owner will send screenshots to the original design chat for a review against the books, so list which screens to capture.
