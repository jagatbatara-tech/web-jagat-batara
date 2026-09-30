---
title: "Automated Data Quality Program for Industrial Operations"
slug: "data-quality-automation"
kicker: "Case Study · Process Automation & Analytics"
date: 2026-09-30
featured: true
summary: >
  Designed and shipped a rule-based data quality engine and executive
  dashboard that replaced a weekly manual audit process with a fully
  automated, statistically grounded daily pipeline — built for a mining
  & logistics operation and scaled to a growing portfolio of datasets.
tags:
  - Low-code Automation
  - Rule Engine Design
  - Statistical Anomaly Detection
  - Power BI
  - Data Governance
hero_stats:
  - value: "~4 hrs → 0"
    label: "Manual QA effort / week"
  - value: "80+"
    label: "Automated validation rules"
  - value: "Daily"
    label: "Unattended execution"
  - value: "2 → 5"
    label: "Datasets on the roadmap"
architecture_image: "/portfolio-project-images/architecture-diagram.png"
architecture_caption: >
  End-to-end pipeline: scheduled trigger → rule engine → AI narration
  with fallback → audit log → dashboard
dashboard_image: "/portfolio-project-images/dashboard-mockup.png"
dashboard_caption: >
  Illustrative mockup — dataset names and figures are representative,
  not production data
tech_stack:
  - "Low-code Workflow Automation"
  - "TypeScript (Office Scripts)"
  - "Power BI & DAX"
  - "Power Query (M)"
  - "Statistical Process Control (3σ)"
  - "Rule-Based Validation Design"
  - "Data Modeling"
  - "Applied Generative AI (narrative layer)"
impact_summary:
  - value: "100%"
    label: "Manual audit effort eliminated"
  - value: "80+"
    label: "Business rules codified"
  - value: "Days"
    label: "To replicate to a new domain"
  - value: "1"
    label: "Unified dashboard, growing portfolio"
disclaimer: >
  Company name, dataset names, and all figures shown here are
  illustrative and have been generalized to protect confidential
  operational data. The architecture, rule logic, and design decisions
  described reflect the actual system built and deployed in production.
---

## Situation

A mid-sized mining and logistics operation managed daily vessel berthing
and cargo data entirely through manual spreadsheet tracking. Data
quality checks were performed weekly by hand — a process taking
approximately four hours per cycle, prone to reviewer fatigue, limited
to format-level checks, and lacking any statistical baseline or audit
trail. Errors routinely surfaced only after reports had already reached
management.

## Task

Design and build an automated, rule-based data quality system that
could:

- Validate operational data daily without manual intervention
- Detect statistical anomalies dynamically, rather than against fixed
  thresholds
- Surface a portfolio-level view across multiple data domains as the
  program scaled beyond a single dataset

## Action

- **Authored a tiered validation rulebook** (Critical / High / Info
  severity) covering completeness, chronological sequence, cross-field
  reconciliation, and reference-data integrity — 80+ rules in total,
  developed rule-by-rule with domain stakeholders before any code was
  written.
- **Built a dynamic statistical outlier layer** using 3-sigma
  detection, segmented by operational context (e.g. terminal × cargo
  type × vessel class) rather than fixed limits.
- **Refined the statistical model through iterative tuning** —
  including correcting a real bias where downtime metrics scaled with
  operation duration; re-expressing them as a ratio of total time
  removed false positives without losing sensitivity.
- **Externalized all reference data and thresholds** into a
  master-data workbook, eliminating hardcoded business logic so
  non-technical stakeholders could adjust rules without a code change.
- **Orchestrated the full pipeline** in a low-code automation platform:
  scheduled daily trigger → rule engine execution → AI-assisted
  narrative summary (with a deterministic fallback for resilience when
  AI capacity was unavailable) → severity-routed email alerts →
  append-only audit log.
- **Extended the architecture to a second data domain**, designing a
  scalable data model (append-only run history + refreshable finding
  detail) so the same pipeline pattern could serve a growing portfolio
  of monitored datasets without redesign.
- **Designed and built a two-tier Power BI dashboard**: an executive
  summary aggregating readiness scores across all monitored domains,
  and a drill-down view per domain showing top failing rules, affected
  records, and quality trend over time.

## Result

- Reduced manual QA effort from ~4 hours/week to zero ongoing manual
  work.
- Established an auditable, repeatable rule catalog that surfaced
  systemic data issues invisible to manual spot-checks.
- Delivered a reusable blueprint successfully replicated to a second
  operational domain in days, not months.
- Gave leadership a live, portfolio-wide view of data quality trends —
  a capability that did not exist before.

## Design Principles

**Deterministic core, AI narrates** — All numbers and findings are
computed by rule-based logic. AI is used only to generate readable
summaries, eliminating hallucination risk on the underlying data.

**Zero hardcoded thresholds** — Reference lists and business
thresholds live in an external master-data source, so operational
adjustments don't require a code change or redeployment.

**Statistically sound outliers** — Metrics that naturally scale with
an uncontrolled factor are compared as normalized ratios rather than
raw totals, avoiding bias toward larger or longer-running records.

## Dashboard Notes

The dashboard was designed around a simple question hierarchy: *is the
portfolio healthy?* (executive summary) followed by *what specifically
is wrong, and where?* (per-dataset drill-down). A dataset scorecard
pattern lets new domains join the program by adding a row — not a
redesign.
