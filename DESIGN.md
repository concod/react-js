---
name: Hello Dashboard
colors:
  surface: "#fcfcfb"
  page: "#f9f9f7"
  ink-primary: "#0b0b0b"
  ink-secondary: "#52514e"
  ink-muted: "#898781"
  gridline: "#e1e0d9"
  baseline: "#c3c2b7"
  primary: "#2a78d6"
  series-2: "#eb6834"
  series-3: "#1baf7a"
  status-good: "#0ca30c"
  status-warning: "#fab219"
  status-critical: "#d03b3b"
  delta-up: "#006300"
  dark-surface: "#1a1a19"
  dark-page: "#0d0d0d"
  dark-ink-primary: "#f0efec"
  dark-ink-secondary: "#c3c2b7"
  dark-gridline: "#2c2c2a"
  dark-primary: "#3987e5"
typography:
  hero:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: 28px
    fontWeight: 600
  title:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: 20px
    fontWeight: 600
  label:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: 13px
    fontWeight: 500
  body:
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
    fontSize: 14px
    fontWeight: 400
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
rounded:
  card: 12px
  bar: 4px
  pill: 999px
---

# Hello Dashboard

## Overview

Calm, quiet, and data-first. The page is mostly neutral warm grays so the
data is the only loud thing on screen. One blue carries the brand and the
primary series.

## Colors

- **Primary blue** is for the main series, active controls, and focus rings.
- Text always uses the ink colors, never a series color.
- **Status colors** (good, warning, critical) are reserved for state. They
  always come with an icon and a label, never color alone.
- Dark mode uses its own selected steps (the `dark-*` tokens), not an
  automatic inversion.

## Typography

One system sans everywhere, including big numbers. Use tabular figures only
in columns that must line up (tables, axis ticks).

## Layout

Cards on a slightly darker page plane, 12px corners, a hairline border
instead of shadows. A 16px gutter on phones; cards reflow to one column.

## Components

- **Stat tile:** label, hero number, and a delta with an arrow.
- **Charts:** 2px lines, bars at most 24px thick with 4px rounded tops,
  hairline solid gridlines, and a hover tooltip on every chart.
- **Filters:** one row of pill buttons above the charts.
