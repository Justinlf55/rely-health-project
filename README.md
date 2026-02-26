# Space Missions Dashboard

An interactive dashboard for exploring and analyzing historical space mission data from 1957 to the present. Built with React, TypeScript, and Vite.

## Features

- **Summary statistics** — total missions, average missions per year, success rate, most-used rocket, and active rocket types, all reactive to the current filter state
- **Interactive filters** — date range picker, multi-select company dropdown with search, and mission status checkboxes
- **Sortable data table** — all 7 columns sortable ascending/descending with paginated results (50 per page)
- **Three data visualizations** (described below)

## Visualizations

### 1. Missions Per Year — Bar Chart
A vertical bar chart showing total launch count grouped by calendar year. A bar chart was chosen because the data is discrete (one value per year) and the primary goal is to reveal temporal trends — specifically the dramatic acceleration of commercial launches from the 2010s onward. Bar charts make magnitude comparisons across ordered categories immediately readable, which a line chart would also achieve but with less emphasis on the count-per-period nature of the data. When a single company is selected, the chart expands to fill the full width and increases tick density to take advantage of the extra space.

### 2. Mission Status — Donut Chart
A donut (ring) pie chart breaking down all missions by outcome: Success, Failure, Partial Failure, and Prelaunch Failure. A donut chart was chosen because the goal is proportional composition of a whole — exactly the use case where pie/donut charts excel. The hollow center is used to surface the overall success rate at a glance without requiring the user to read individual segments. Four status categories is within the comfortable range for a pie chart (fewer than five slices avoids perceptual clutter).

### 3. Top Companies — Horizontal Bar Chart
A horizontal bar chart ranking companies by total mission count. A horizontal (rather than vertical) bar layout was chosen because company names are long strings that would overlap on a vertical axis. Ranking data — where the order and relative magnitude between entries matters more than time-series trends — is best communicated by a sorted bar chart. The gradient color palette provides visual distinction between entries without implying any categorical meaning.

## Setup

```bash
npm install
npm run dev
```

## Data

`public/space_missions.csv` — sourced from a public dataset of orbital and suborbital launches. Columns: Company, Location, Date, Time, Rocket, Mission, RocketStatus, Price, MissionStatus.

## Analytic Functions

All eight required analytic functions are implemented in `src/data/analytics.ts` as pure TypeScript functions:

| Function | Description |
|---|---|
| `getMissionCountByCompany` | Total missions for a given company |
| `getSuccessRate` | Success percentage for a company, rounded to 2 decimal places |
| `getMissionsByDateRange` | Mission names in a date range, sorted chronologically |
| `getTopCompaniesByMissionCount` | Top N companies by mission count with alphabetical tiebreak |
| `getMissionStatusCount` | Count of missions per status category |
| `getMissionsByYear` | Total missions in a specific year |
| `getMostUsedRocket` | Most frequently flown rocket (alphabetical tiebreak) |
| `getAverageMissionsPerYear` | Average launches per year over a given range |
