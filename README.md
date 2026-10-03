# NOVA LAPTOPS — Professional Laptop Discovery & Comparison Platform

> **Find the Laptop That Fits Your World.**

NOVA LAPTOPS is a high-end, modern technology product discovery, specification analysis, and comparison web application designed for students, developers, creative professionals, enterprise executives, gamers, and hardware enthusiasts.

Built with a deep graphite and restrained electric blue design language, Space Grotesk / Inter typography, and precise hardware metrology principles.

---

## 🌟 Core Platform Experiences & Features

1. **Precision Laptop Discovery (`laptops.html`)**:
   - Multi-attribute filtering sidebar (Brand, Use Case, Processor family, RAM tiers, Display panel tech, Screen size, Weight category, GPU Class).
   - Real-time live search with instant filtering.
   - Active filter chips with 1-click removal.
   - Dynamic sorting (Featured, Newest, Lightweight, Performance, Price).
   - Responsive slide-out mobile filter drawer.

2. **Hardware Deep-Dive Specifications (`laptop-details.html?id=...`)**:
   - Dynamic product showcase with multi-angle gallery switcher.
   - Key hardware specifications grid with instant interactive explainer modals on hover/click.
   - Multi-tab breakdown:
     - **Overview & Verdict** (Executive summary, pros & cons, ideal target persona).
     - **Performance & Silicon** (CPU architecture, core breakdown, GPU class, AI NPU TOPS).
     - **Display & Visuals** (Panel tech, refresh rate, HDR peak brightness, color gamut coverage).
     - **Chassis & Ports** (Materials, weight, keyboard travel, physical I/O ports).
     - **Battery & Power** (Watt-hours capacity, tested endurance, fast charging speed).
     - **Full Raw Specifications Table**.
   - Related direct alternatives with 1-click compare and details navigation.

3. **Side-by-Side Comparison Engine (`compare.html`)**:
   - Side-by-side comparison of 2 to 4 laptops.
   - **"Highlight Differences Only"** toggle to immediately spotlight contrasting hardware specs.
   - Slot picker modal to easily search and add laptops into available comparison slots.
   - Shareable link generator and comparison reset.
   - Responsive horizontal scroll with sticky specs column for mobile devices.

4. **Interactive Laptop Finder Wizard (`laptop-finder.html`)**:
   - 6-step intelligent questionnaire:
     1. Primary daily workflow & use case
     2. Performance tier (Basic to Extreme)
     3. Portability & mobility priority
     4. Display panel preference (OLED, Mini-LED, IPS)
     5. Screen size preference (13" to 17"+)
     6. Configurable budget range slider
   - Multi-attribute scoring calculation algorithm providing match percentages (e.g. `98% Match`).
   - Detailed *"Why this fits your priorities"* breakdown list.
   - 1-click save to shortlist, add to compare, and view full specs.

5. **Specification Education & Explainer Modals (`[data-spec-explainer]`)**:
   - Integrated hardware explainer modal throughout the platform (OLED, Mini-LED, TGP, NPU, Thunderbolt 4, LPDDR5X, etc.).
   - Breaks down: *What It Means*, *Key Benefits*, *Who Needs It*, and *Watch Out For*.

6. **Global Search Modal (`Cmd+K` / `/` / Search Button)**:
   - Full-keyboard interactive search overlay.
   - Multi-entity instant querying across laptop models, brands, CPUs, GPUs, use cases, and buying guides.
   - Quick search tags and keyboard navigation (`↑` `↓` `ENTER` `ESC`).

7. **Saved Shortlist & Reading List (`saved.html`)**:
   - Tabbed workspace for Saved Laptops, Saved Buying Guides, and Active Comparisons.
   - Export shortlist and 1-click "Compare All Saved Laptops".
   - Seamless localStorage persistence.

8. **Editorial Buying Guides (`guides.html` and `guide-details.html?id=...`)**:
   - In-depth hardware architecture articles, RAM sizing rules, display metrology guides, and creator laptop guides.
   - Rich reading layout with technical diagrams, comparison tables, and referenced laptops.

9. **Authentication System (`login.html`, `signup.html`, `forgot-password.html`)**:
   - Demo authentication state engine with user session persistence in `localStorage`.
   - Onboarding preference selection on signup.
   - Dynamic avatar dropdown in sticky navbar across all pages.

10. **Dark / Light Theme Toggle**:
    - System preference detection.
    - Persistent theme storage via `localStorage`.
    - Zero contrast glitches or unreadable text.

---

## 📁 File & Directory Architecture

```text
laptops/
│
├── index.html                   # Homepage (Hero with live spec switcher, featured laptops, spec explorer)
├── laptops.html                 # Discovery catalog (Sidebar filters, search, active chips, sorting)
├── laptop-details.html          # Dynamic deep-dive specs, gallery, multi-tab analysis & alternatives
├── compare.html                 # Side-by-side 2-4 laptop comparison matrix with differences toggle
├── laptop-finder.html           # 6-step interactive questionnaire wizard with intelligent match scoring
├── guides.html                  # Editorial buying guides index with category filtering
├── guide-details.html           # Editorial reader layout with dynamic URL param loading & related specs
├── saved.html                   # Shortlist management workspace (Saved laptops, guides & comparisons)
├── about.html                   # About Nova, 5-pillar methodology, editorial principles
├── contact.html                 # Editorial contact form, support channels, FAQs
│
├── login.html                   # Sign in page with demo credentials and Google auth simulation
├── signup.html                  # Registration page with onboarding workflow preferences
├── forgot-password.html         # Password recovery page with interactive confirmation state
│
├── 404.html                     # Custom 404 missing spec page with quick recovery routes
├── coming-soon.html             # Nova Labs 3D hardware tear-down roadmap & early notification form
│
├── assets/
│   ├── css/
│   │   ├── style.css            # Design tokens, dark/light themes, typography, layout, buttons, hero
│   │   ├── components.css       # Navbar, cards, filter sidebars, compare tray, modals, wizards, tabs
│   │   └── responsive.css       # Mobile & tablet viewports (320px to 2560px), zero-overflow guards
│   │
│   └── js/
│       ├── laptops-data.js      # Centralized verified dataset (16 laptops, 6 guides, 12 spec explainers)
│       ├── theme.js             # Dark/light mode switcher with persistence and icon updates
│       ├── auth.js              # Demo authentication engine, session state & navbar rendering
│       ├── bookmarks.js         # Shortlist bookmarking manager with badge counter updates
│       ├── compare.js           # Global comparison manager & floating bottom tray
│       ├── compare-page.js      # Compare table renderer, diff highlighting & slot picker
│       ├── filters.js           # Multi-attribute discovery filter engine & sorting
│       ├── laptop-finder.js     # 6-step recommendation wizard & match scoring engine
│       ├── laptop-details.js    # Product details page dynamic renderer & gallery switcher
│       ├── search.js            # Global Cmd+K quick search modal engine
│       ├── spec-modal.js        # Interactive specification explainer modal engine
│       └── main.js              # Toast notification system, mobile drawer & core initializations
│
└── README.md                    # Documentation & project overview
```

---

## 💻 Tech Stack & Design Tokens

- **Structure**: Semantic HTML5 with complete ARIA compliance and SEO meta tags.
- **Styling**: Vanilla CSS3 (Custom Design System with CSS variables, Glassmorphism, Responsive Grid & Flexbox).
- **Typography**: `Space Grotesk` (Headings & Metrics) + `Inter` (UI & Body Text) + `JetBrains Mono` (Spec Codes).
- **Icons**: Lucide Icons CDN (vector SVG icons).
- **Interactions**: Vanilla Modern JavaScript (ES6+), `localStorage` for offline persistence, zero external framework dependencies.

---

## 🚀 Running Locally

Open any of the `.html` files in any modern web browser or serve them using any static web server:

```bash
# Example using PowerShell
powershell -Command "Start-Process index.html"
```
