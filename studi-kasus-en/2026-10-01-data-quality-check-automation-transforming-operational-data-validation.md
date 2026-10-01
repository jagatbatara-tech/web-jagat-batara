---
title: 'Data Quality Check Automation: Transforming Operational Data Validation'
kicker: Case Study · Process Automation & Analytics
date: 2026-10-02T07:35:00
summary: Designing and building a data quality rule engine and executive dashboard that replaced a weekly manual audit process with a daily automated statistical-based pipeline — built for mining & logistics operations and scaled for a growing portfolio of datasets.
tags:
  - Low-code Automation
  - Rule Engine Design
hero_stats:
  - value: "~4 hours → 0"
    label: Manual QA effort / week
  - value: "80+"
    label: Automated validation rules
  - value: Daily
    label: Unattended execution
  - value: "2 → 5"
    label: Datasets in roadmap
thumbnail: ''
architecture_image: /images/architecture-diagram.png
architecture_caption: 'End-to-end pipeline: scheduled trigger → rule engine → AI narrative with fallback → audit log → dashboard'
dashboard_image: /images/dashboard-mockup.png
dashboard_caption: Illustrative mockup — dataset names and figures are representative, not production data
tech_stack:
  - Low-code Workflow Automation
  - TypeScript (Office Scripts)
  - Power BI & DAX
  - Power Query (M)
  - Statistical Process Control (3σ)
  - Rule-Based Validation Design
  - Data Modeling
  - Applied Generative AI (narrative layer)
impact_summary:
  - value: "100%"
    label: Manual audit effort eliminated
  - value: "80+"
    label: Business rules codified
  - value: Days
    label: Time to replicate to a new domain
  - value: "1"
    label: Unified dashboard for a growing portfolio
disclaimer: Company names, dataset names, and all figures are illustrative and generalized to protect confidential operational data. The architecture and rule logic described reflect a real system built and operated in production.
id_link: studi-kasus/2026-09-29-otomasi-data-quality-check-transformasi-validasi-data
---

## Situation

A mid-scale mining & logistics operation managed daily vessel berthing and cargo data entirely through manual spreadsheet entry. Data quality checks were conducted weekly by hand — a process taking approximately four hours per cycle, prone to reviewer fatigue, limited to format-level checks, and lacking any statistical baseline or audit trail. New errors only became visible after reports had already reached management.

## Task

Designing and building a rule-based data quality system capable of:

- Validating operational data daily without manual intervention.
- Detecting anomalies statistically and dynamically, rather than based on fixed thresholds.
- Presenting a portfolio-level view across multiple data domains as the program scales beyond a single dataset.

## Action

- **Compiling a tiered validation rulebook** (Critical / High / Info severity) covering data completeness, chronological order, cross-column reconciliation, and reference data integrity — 80+ rules in total, developed rule by rule with domain stakeholders before a single line of code was written.
- **Building a statistical outlier detection layer** using the 3-sigma method, segmented by operational context (e.g., terminal × cargo type × vessel class) instead of fixed thresholds.
- **Refining the statistical model through tuning iterations** — including fixing a real bias where downtime metrics naturally scaled with operation duration; by restating it as a ratio against total time, false positives were eliminated without losing detection sensitivity.
- **Externalizing all reference data and thresholds** into a master data workbook, eliminating hardcoded business logic so non-technical stakeholders can adjust rules without code changes.
- **Orchestrating the entire pipeline** within a low-code automation platform: scheduled daily trigger → rule engine execution → AI-assisted narrative summary (with deterministic fallback for resilience when AI capacity is unavailable) → severity-based email alerts → growing audit log (append-only).
- **Expanding the architecture to a second data domain**, designing a scalable data model (append-only run history + constantly refreshed findings details) so the same pipeline pattern could serve a growing portfolio of datasets without redesign.
- **Designing and building a two-tiered Power BI dashboard**: an executive summary aggregating data readiness scores across monitored domains, and a per-domain drill-down view showing the most frequently failing rules, impacted records, and data quality trends over time.

## Result

- Reduced manual QA effort from \~4 hours/week to zero ongoing manual work.
- Built an auditable and repeatable rule catalog that successfully uncovered systemic data issues previously unseen through manual spot-checks.
- Produced a reusable blueprint that was successfully replicated to a second operational domain in a matter of days, not months.
- Provided management with an immediate, comprehensive view of data quality trends across the portfolio — a previously nonexistent capability.

## Design Principles

**Deterministic core, AI for narrative only** — All numbers and findings are calculated by rule-based logic. AI is solely used to generate human-readable summaries, eliminating hallucination risks on the underlying data.

**Zero hardcoded thresholds** — Reference lists and business thresholds are stored in an external master data source, so operational adjustments do not require code changes or redeployments.

**Statistically sound outliers** — Metrics that naturally scale with uncontrolled factors are compared as normalized ratios, not raw numbers — avoiding bias against larger or longer-duration records.

## Dashboard Notes

The dashboard was designed following a simple hierarchy of questions: _is the portfolio healthy?_ (executive summary) followed by _what exactly went wrong, and where?_ (per-dataset drill-down). The dataset scorecard pattern allows new domains to join the program just by adding a single row — rather than a redesign.
