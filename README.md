# Space Missions Dashboard

An interactive analytics dashboard for exploring historical space launch data, built with React 19, TypeScript, and Vite.

---

## Screen Recordings

### Desktop

<video src="media/desktop-demo.mov" controls width="100%"></video>

### Tablet

<video src="media/tablet-demo.mov" controls width="100%"></video>

### Mobile

<video src="media/mobile-demo.mov" controls width="100%"></video>

### Keyboard / ADA Navigation

<video src="media/ada-demo.mov" controls width="100%"></video>

---

## Requirements Checklist

### Analytic Functions — `src/data/analytics.ts`

All eight functions are pure TypeScript with no React dependency, camelCase signatures, and typed arguments/return values matching the specification exactly.

| # | Function | Signature | Status |
|---|---|---|---|
| 1 | `getMissionCountByCompany` | `(data, companyName) => number` | ✅ |
| 2 | `getSuccessRate` | `(data, companyName) => number` — rounded to 2 decimal places | ✅ |
| 3 | `getMissionsByDateRange` | `(data, startDate, endDate) => string[]` — sorted chronologically | ✅ |
| 4 | `getTopCompaniesByMissionCount` | `(data, n) => [string, number][]` — alphabetical tiebreak | ✅ |
| 5 | `getMissionStatusCount` | `(data) => Record<string, number>` | ✅ |
| 6 | `getMissionsByYear` | `(data, year) => number` | ✅ |
| 7 | `getMostUsedRocket` | `(data) => string` — alphabetical tiebreak | ✅ |
| 8 | `getAverageMissionsPerYear` | `(data, startYear, endYear) => number` — rounded to 2 decimal places | ✅ |

### Dashboard Features

| Feature | Status |
|---|---|
| CSV loaded and parsed via PapaParse (`src/data/loader.ts`) | ✅ |
| Summary stats grid (5 stat cards: Total, Success Rate, Top Company, Most Used Rocket, Avg/Year) | ✅ |
| Missions Per Year — vertical bar chart (Recharts) | ✅ |
| Mission Status — donut chart (Recharts) | ✅ |
| Top Companies — horizontal bar chart (Recharts) | ✅ |
| Filterable by date range, company (multi-select), mission status (checkboxes) | ✅ |
| Sortable table — click any column header to sort asc/desc | ✅ |
| Paginated table — 50 rows per page, resets to page 1 on filter change | ✅ |
| Fully responsive — 4 breakpoints from desktop to small mobile | ✅ |
| WCAG 2.1 AA accessible | ✅ |
| 148 tests across 20 files | ✅ |

---

## Running Locally

**Node 18 or later required.**

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview
```

---

## Running Tests

The test suite uses [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) with a jsdom environment. No additional configuration is required beyond `npm install`.

```bash
# Run all tests in watch mode (re-runs on file save)
npm test

# Run all tests once and exit — CI mode
npm test -- --run

# Run a specific test file
npm test -- --run src/data/__tests__/analytics.test.ts

# Run tests matching a name pattern
npm test -- --run -t "filters by company"

# Run with coverage report (output written to ./coverage/)
npm run test:coverage
```

After running `npm run test:coverage`, open `coverage/index.html` in a browser for the full line-by-line report.

**Expected output:**

```
Test Files  20 passed (20)
     Tests  148 passed (148)
```

---

## Why Vite

[Vite](https://vitejs.dev/) was chosen over Create React App or a custom webpack setup for three concrete reasons:

1. **No-bundle dev server** — Vite serves source files as native ES modules directly to the browser during development. There is no upfront bundle step, so the server is ready in milliseconds regardless of project size.

2. **Granular HMR** — Hot Module Replacement invalidates only the changed module, not the full bundle. Component edits appear in the browser in under 50 ms without losing application state.

3. **Unified config for build and test** — `vitest` is a Vite-native test runner that shares the same `vite.config.ts`, module resolution, and plugin pipeline. This eliminates the separate `webpack + jest + babel` configuration stack that would otherwise be required. The `@vitejs/plugin-react` plugin (SWC-based) provides the JSX transform for both builds and tests without any additional setup.

---

## Architecture and System Design

### Shared UI Component Library — `src/components/ui/`

Three foundational components eliminate duplicated surface styles across every feature area:

| Component | Design decision |
|---|---|
| `<Card as={...}>` | Polymorphic via `as` prop (`ElementType` default `'div'`). Every call site uses the semantically correct HTML element — `article` for stat cards, `section` for charts — without duplicating border, radius, shadow, or background styles. |
| `<Badge status={...}>` | Typed status pill mapping `Success / Failure / Partial Failure / Prelaunch Failure` to CSS Module color tokens. Text label is always present so color is never the sole means of conveying meaning. |
| `<Button variant size>` | `secondary` and `ghost` variants, `md` and `sm` sizes. Defaults to `type="button"` to prevent accidental form submission. Ships with a `focus-visible` ring so keyboard users always have a visible indicator. |

```
src/components/ui/
├── Card/
│   ├── Card.tsx
│   └── Card.module.css
├── Badge/
│   ├── Badge.tsx
│   └── Badge.module.css
├── Button/
│   ├── Button.tsx
│   └── Button.module.css
└── index.ts          ← barrel export
```

### `src/constants/index.ts` — Values and Derived Types

```ts
export const MissionStatus = {
  Success: 'Success',
  Failure: 'Failure',
  PartialFailure: 'Partial Failure',
  PrelaunchFailure: 'Prelaunch Failure',
} as const;

export type MissionStatus = typeof MissionStatus[keyof typeof MissionStatus];
```

`MissionStatus` and `SortDirection` are plain `as const` objects rather than TypeScript `enum` declarations. This is deliberate:

- **`erasableSyntaxOnly` is enabled** in `tsconfig.app.json`. This compiler flag rejects any TypeScript syntax that cannot be stripped away at build time without altering runtime semantics — `enum` fails this check, `as const` objects pass it.
- **String literals remain assignable**. `'Success'` is directly assignable to `MissionStatus` without an import, which matters for PapaParse CSV output and test fixtures.
- **Values are runtime objects**. `Object.values(MissionStatus)` works at runtime; an `enum` compiled to an IIFE would also work but adds generated output.

`src/constants/` holds runtime values; `src/types/` holds structural type definitions. The separation makes the dependency direction unambiguous: types can depend on constants, but constants never depend on types.

### Context + Reducer — `src/context/DashboardContext.tsx`

Global state is managed through a single `useReducer` with five action types:

```
LOAD_START | LOAD_SUCCESS | LOAD_ERROR | SET_FILTER | SET_SORT
```

`allMissions` is fetched once on mount and cached in context. Every component consumes `useDashboard()` — no prop drilling, no redundant fetches. `setFilter` and `setSort` are wrapped in `useCallback` with stable references; the context value is memoized with `useMemo` to prevent unnecessary re-renders of unrelated subtrees.

### `useFilteredMissions` — Pure Derived State

`src/hooks/useFilteredMissions.ts` is a single-purpose hook that reads `allMissions`, `filterState`, and `sortState` from context and returns a filtered, sorted `MissionRow[]` via `useMemo`. It has no side effects and no internal state. Separating this logic from both the context (which owns mutation) and the table (which owns rendering) keeps each layer testable in isolation — the hook's 15 tests mock only the context return value.

### `chartConfig.ts` — Single Source of Truth for Chart Theming

All three Recharts visualizations import from `src/components/charts/chartConfig.ts`:

```ts
export const TOOLTIP_CONTENT_STYLE = { background: '#21262d', border: '1px solid #30363d', ... } as const;
export const TOOLTIP_CURSOR       = { fill: 'rgba(88,166,255,0.08)' } as const;
export const AXIS_TICK_STYLE      = { fill: '#8b949e', fontSize: 11 } as const;
export const LEGEND_WRAPPER_STYLE = { fontSize: 12, color: '#8b949e' } as const;
```

Changing the dark-mode palette in one place updates all three charts simultaneously. No duplicated style objects across chart components.

### MissionsTable Decomposition — Single Responsibility

The table is split into three sub-components rather than one monolithic file:

| Component | Sole responsibility |
|---|---|
| `MissionTableHeader` | Renders `<thead>` with `scope="col"`, `aria-sort`, `tabIndex`, and `onKeyDown` handlers |
| `MissionTableRow` | Renders a single `<tr>` with a `<Badge>` status cell |
| `MissionTablePagination` | Renders pagination controls with `aria-label` on every button and `aria-live` on the page counter |

`MissionsTable` itself is responsible only for orchestrating these three, managing the current page, and wiring sort state to the context.

### Pure Analytic Functions

`src/data/analytics.ts` contains only pure functions. They accept `MissionRow[]` and primitive arguments; they return values. No `import` of React, no side effects, no module-level state. This makes them independently testable — the 24 analytics tests import the functions directly with no rendering infrastructure — and safely importable in any context (server, worker, or test) without pulling in React.

---

## Performance Optimizations

| Optimization | Where | Detail |
|---|---|---|
| **`useMemo` for derived state** | `useFilteredMissions` | The entire filter + sort pipeline is wrapped in `useMemo`, keyed on `allMissions`, `filterState`, and `sortState`. The filtered array is only recomputed when one of those three inputs changes; unrelated renders (e.g., a chart expanding) skip the computation entirely. |
| **`useMemo` for the context value** | `DashboardContext` | The provider value object is memoized so that its reference only changes when the underlying state changes. Without this, every context dispatch would cause every consuming component to re-render even if the values they use did not change. |
| **`useMemo` for the company list** | `FilterBar` | The sorted unique company list is derived from `allMissions` once per data load, not on every render. Deduplication and sorting run only when `allMissions` changes. |
| **`useCallback` for stable callbacks** | `DashboardContext` | `setFilter` and `setSort` are wrapped in `useCallback` so their references are stable across re-renders. This prevents every child component that receives these as props from re-rendering when unrelated state changes. |
| **Pagination** | `MissionsTable` | The table renders at most 50 rows at a time. With thousands of rows in the CSV, this keeps the DOM node count small and scrolling smooth. Changing filters resets to page 1 so the user always sees the most relevant results first. |
| **Single data load** | `DashboardContext` | `allMissions` is fetched once on mount and stored in the reducer. All filters, sorts, and stats derive from this cached array. There are no redundant network requests as the user interacts with filters or charts. |
| **`useReducer` for batched state** | `DashboardContext` | A single reducer manages loading, error, filter, and sort state in one place. Compared to five separate `useState` calls, this prevents cascading intermediate renders when multiple pieces of state change together (e.g., on initial data load, which sets `isLoading: false` and `allMissions` atomically). |
| **Pure analytic functions** | `src/data/analytics.ts` | All eight functions are pure: no imports of React, no side effects, no module-level state. They can be safely passed to `useMemo` callbacks, run in workers, or tested with zero rendering infrastructure. |

---

## Accessibility — WCAG 2.1 AA

| Feature | Implementation |
|---|---|
| Skip navigation | `<a href="#main-content" class="skip-link">` in `index.html`; visually hidden until focused; `<main id="main-content">` in `Dashboard` |
| Landmark roles | `role="banner"` on header; `<main>` on page root; `<section aria-label="...">` on Filters, Summary statistics, Charts, Missions table |
| ARIA listbox pattern | `CompanyMultiSelect` implements `role="listbox"`, `role="option"`, `aria-selected`, `aria-expanded`, `aria-haspopup="listbox"`, and `aria-controls` |
| Dropdown keyboard navigation | Arrow Down / Arrow Up traverse options; Enter / Space toggle selection; Escape closes and returns focus to the trigger button |
| Focus restoration | On Escape or Done, focus returns to the trigger button via `triggerRef.current?.focus()` |
| Table column headers | `scope="col"` on every `<th>`; `aria-sort="ascending"`, `"descending"`, or `"none"` updated on each sort; `tabIndex={0}` + `onKeyDown` Enter/Space activate sorting from the keyboard |
| Screen-reader caption | `<caption className="sr-only">Space missions — N results</caption>` on the table |
| Status filter | `<fieldset>` + `<legend>` wraps the four status checkboxes for correct checkbox group semantics |
| Loading state | `role="status"` + `aria-live="polite"` + `aria-label="Loading mission data"` on the spinner container; spinner `<div>` is `aria-hidden="true"` |
| Error state | `role="alert"` + `aria-live="assertive"` + `aria-atomic="true"` on `ErrorBanner` |
| Pagination live region | `aria-live="polite"` on the page-info element; `aria-label` on every page navigation button |
| Status badge | Color is supplemented by a text label — `Success`, `Failure`, `Partial Failure`, `Prelaunch Failure` — never color alone |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` in `LoadingSpinner.module.css` disables the CSS spin animation |
| Focus indicators | `:focus-visible` ring on all interactive elements (table headers, buttons, inputs, dropdown options) |
| `.sr-only` utility | Defined once in `src/index.css`; reused for table captions, chart descriptions, and icon labels throughout |
| Icon decorations | Emoji icons in stat cards and the page title carry `aria-hidden="true"` |

---

## Responsive Design

| Breakpoint | Layout changes |
|---|---|
| ≥ 1100px (desktop) | 5-column stat card grid; 3-column chart grid; full filter bar in a single row |
| ≤ 1100px (tablet) | 2-column stat card grid; 2-column chart grid; font sizes reduced by ~2px across stat cards |
| ≤ 768px (mobile) | Chart grid collapses to single column; filter bar stacks vertically (`flex-direction: column`); date From/To inputs remain in a horizontal row |
| ≤ 600px (small mobile) | Page padding and gap tighten; `h1` reduces from 24px to 18px; `Rocket` and `RocketStatus` table columns hidden via `display: none`; pagination row wraps |

The table scroll container uses `-webkit-overflow-scrolling: touch` for smooth momentum scrolling on iOS when horizontal overflow is present.

---

## Test Coverage

**148 tests across 20 test files** — Vitest + jsdom + Testing Library. Recharts is fully mocked to avoid canvas errors in jsdom.

| Test file | Tests | What it covers |
|---|---|---|
| `src/data/__tests__/analytics.test.ts` | 24 | All 8 pure functions: correctness, edge cases (empty data, unknown company, tiebreaks, year boundaries) |
| `src/hooks/__tests__/useFilteredMissions.test.ts` | 15 | Filter by startDate, endDate, date range, single company, multiple companies, status, combined filters; sort asc/desc; empty result set |
| `src/App/__tests__/App.test.tsx` | 3 | Loading spinner on mount; error banner on rejected fetch; dashboard renders after successful fetch |
| `src/components/Dashboard/__tests__/Dashboard.test.tsx` | 7 | Landmark regions (`banner`, named `region` sections); page heading present |
| `src/components/FilterBar/__tests__/FilterBar.test.tsx` | 4 | Date inputs render with labels; status `fieldset`+`legend` present; all 4 status checkboxes labeled; Reset Filters button |
| `src/components/FilterBar/__tests__/CompanyMultiSelect.test.tsx` | 15 | ARIA attributes (`aria-haspopup`, `aria-expanded`, `aria-selected`); open on click and Enter key; listbox / option roles; ArrowDown focus management; Escape closes and removes listbox; Select All / Clear / Done callbacks |
| `src/components/MissionsTable/__tests__/MissionsTable.test.tsx` | 7 | Table renders; sr-only caption; `aria-sort` on headers; `tabIndex` on headers; data rows render; result count displayed; click toggles `aria-sort` from `none` to `ascending` |
| `src/components/MissionsTable/__tests__/MissionTableHeader.test.tsx` | 11 | Renders 7 column headers; `aria-sort` states; click/Enter/Space trigger sort; sort indicator `aria-hidden` |
| `src/components/MissionsTable/__tests__/MissionTableRow.test.tsx` | 12 | Renders mission fields; Badge for each known status; plain span for unknown status; Active/Retired rocket status |
| `src/components/MissionsTable/__tests__/MissionTablePagination.test.tsx` | 10 | Page info text; First/Prev/Next/Last buttons; disabled states; `aria-live` region; `role="navigation"` landmark |
| `src/components/SummaryCards/__tests__/StatCard.test.tsx` | 3 | Label and value render; `aria-label` combining both; icon has `aria-hidden="true"` |
| `src/components/SummaryCards/__tests__/SummaryCards.test.tsx` | 2 | Renders without crashing; exactly 5 `article` stat cards |
| `src/components/ui/Card/__tests__/Card.test.tsx` | 5 | Children render; default `div` tag; `as` prop changes tag; `className` merges; extra props pass through |
| `src/components/ui/Badge/__tests__/Badge.test.tsx` | 5 | All 4 status strings render; renders as `span`; status-specific class applied |
| `src/components/ui/Button/__tests__/Button.test.tsx` | 6 | Children render; onClick fires; disabled state; disabled suppresses onClick; className merges; aria-label passes through |
| `src/components/ErrorBanner/__tests__/ErrorBanner.test.tsx` | 4 | Message renders; `role="alert"`; `aria-live="assertive"`; `aria-atomic="true"` |
| `src/components/LoadingSpinner/__tests__/LoadingSpinner.test.tsx` | 3 | `role="status"` present; accessible name matches `aria-label`; container is in the document |
| `src/components/charts/__tests__/MissionsPerYearChart.test.tsx` | 3 | Named region renders; chart title renders; sr-only description present |
| `src/components/charts/__tests__/MissionStatusChart.test.tsx` | 3 | Named region renders; chart title renders; sr-only description with success rate |
| `src/components/charts/__tests__/TopCompaniesChart.test.tsx` | 3 | Named region renders; chart title renders; sr-only description present |

---

## Project Structure

```
src/
├── App/
│   ├── App.tsx                     — root component; branches on isLoading / error / data
│   └── __tests__/App.test.tsx
├── components/
│   ├── ui/                         — shared design system (Card, Badge, Button)
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Button/
│   │   └── index.ts
│   ├── Dashboard/                  — page layout; landmark regions
│   ├── FilterBar/                  — date range, CompanyMultiSelect, status checkboxes
│   ├── MissionsTable/              — MissionsTable + MissionTableHeader / Row / Pagination
│   ├── SummaryCards/               — SummaryCards + StatCard
│   ├── charts/                     — MissionsPerYearChart, MissionStatusChart, TopCompaniesChart, chartConfig.ts
│   ├── ErrorBanner/
│   └── LoadingSpinner/
├── constants/
│   └── index.ts                    — MissionStatus and SortDirection as const objects + derived types
├── context/
│   └── DashboardContext.tsx        — useReducer state; DashboardProvider; useDashboard hook
├── data/
│   ├── analytics.ts                — 8 pure analytic functions
│   └── loader.ts                   — fetch + PapaParse parsing
├── hooks/
│   └── useFilteredMissions.ts      — memoized filter + sort derived state
├── types/
│   └── mission.ts                  — MissionRow, FilterState, SortState, SortKey interfaces
├── utils/
│   └── formatters.ts               — formatNumber, formatPercent
├── test/
│   ├── setup.ts                    — @testing-library/jest-dom import
│   └── mockData.ts                 — 20-row MissionRow fixture
└── index.css                       — CSS custom properties, .sr-only, .skip-link
```

---

## Data

`public/space_missions.csv` — a public dataset of orbital and suborbital launches from 1957 to the present.
Columns: `Company`, `Location`, `Date`, `Time`, `Rocket`, `Mission`, `RocketStatus`, `Price`, `MissionStatus`.

PapaParse is configured with `header: true`, `skipEmptyLines: true`, and per-value `transform: trim` so leading/trailing whitespace in the CSV never reaches application logic.
