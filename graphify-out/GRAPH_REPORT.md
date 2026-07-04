# Graph Report - Del-mar-a-tu-mesa  (2026-07-04)

## Corpus Check
- 22 files · ~6,000 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 68 nodes · 79 edges · 12 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a33fe3ee`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]

## God Nodes (most connected - your core abstractions)
1. `scripts` - 5 edges
2. `Button()` - 3 edges
3. `Checkbox()` - 3 edges
4. `Input()` - 3 edges
5. `AuthLayout()` - 3 edges
6. `React + Vite` - 3 edges
7. `App()` - 2 edges
8. `Sidebar()` - 2 edges
9. `StatCard()` - 2 edges
10. `TopBar()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (12 total, 0 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.24
Nodes (8): Login(), Register(), AuthLayout(), PescadorDashboard(), App(), Button(), Checkbox(), Input()

### Community 1 - "Community 1"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.29
Nodes (4): StatCard(), CAPTURAS, INSUMOS, STATS

### Community 4 - "Community 4"
Cohesion: 0.38
Nodes (4): NAV_ITEMS, Sidebar(), TopBar(), DashboardLayout()

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (7): dependencies, lucide-react, react, react-dom, react-router-dom, tailwindcss, @tailwindcss/vite

### Community 6 - "Community 6"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

## Knowledge Gaps
- **29 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+24 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 5` to `Community 1`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _29 weakly-connected nodes found - possible documentation gaps or missing edges._