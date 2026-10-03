/**
 * NOVA LAPTOPS - Discovery & Filtering Engine
 * Powers laptops.html with multi-attribute filtering, active chips, URL sync & sorting
 */

(function () {
  let activeFilters = {
    search: "",
    brand: [],
    useCase: [],
    processor: [],
    ram: [],
    storage: [],
    display: [],
    size: [],
    weight: [],
    gpu: []
  };

  let currentSort = "featured";
  let currentView = "grid";

  function initFilters() {
    const container = document.getElementById("laptopsGridContainer");
    if (!container) return; // Not on laptops.html

    parseUrlParams();
    renderFilterSidebar();
    applyFilters();
    bindEvents();
  }

  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("search")) activeFilters.search = params.get("search");
    if (params.get("brand")) activeFilters.brand = [params.get("brand")];
    if (params.get("use")) activeFilters.useCase = [params.get("use")];
    if (params.get("category")) activeFilters.useCase = [params.get("category")];
    if (params.get("display")) activeFilters.display = [params.get("display")];
    if (params.get("sort")) currentSort = params.get("sort");
  }

  function renderFilterSidebar() {
    const sidebar = document.getElementById("filterSidebarContainer");
    const mobileSidebar = document.getElementById("mobileFilterDrawerBody");
    if (!sidebar && !mobileSidebar) return;

    const laptops = typeof NOVA_LAPTOPS_DATA !== "undefined" ? NOVA_LAPTOPS_DATA : [];

    const brands = ["Apple", "Dell", "Lenovo", "ASUS", "HP", "Microsoft", "Samsung", "Acer", "Other"];
    const useCases = ["Student", "Work", "Gaming", "Creator", "Developer", "Business", "Travel"];
    const processors = ["Intel Core", "AMD Ryzen", "Apple Silicon", "Snapdragon"];
    const memories = [
      { label: "16GB", val: 16 },
      { label: "32GB", val: 32 },
      { label: "64GB+", val: 64 }
    ];
    const displays = ["OLED", "Mini-LED", "IPS"];
    const sizes = ["13\"", "14\"", "15\"", "16\"", "17\"+"];
    const weights = ["Under 1.3kg", "1.3–1.6kg", "1.6–2kg", "2kg+"];
    const gpus = ["Integrated", "Entry", "Mid-range", "High-performance"];

    const html = `
      <div class="filter-sidebar-header">
        <h3 style="font-size: 1.125rem; font-weight: 700;">Filters</h3>
        <button id="clearAllFiltersBtn" class="btn btn-outline btn-sm" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">Reset All</button>
      </div>

      <!-- Brand -->
      <div class="filter-group">
        <div class="filter-group-title">Brand</div>
        <div class="filter-options-list">
          ${brands.map((b) => {
            const count = laptops.filter((l) => l.brand === b).length;
            const checked = activeFilters.brand.includes(b) ? "checked" : "";
            return `
              <label class="filter-checkbox-label">
                <input type="checkbox" class="filter-checkbox" data-filter-type="brand" value="${b}" ${checked}>
                <span>${b}</span>
                <span class="filter-count">(${count})</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Use Case -->
      <div class="filter-group">
        <div class="filter-group-title">Use Case</div>
        <div class="filter-options-list">
          ${useCases.map((u) => {
            const count = laptops.filter((l) => l.useCases.includes(u)).length;
            const checked = activeFilters.useCase.includes(u) ? "checked" : "";
            return `
              <label class="filter-checkbox-label">
                <input type="checkbox" class="filter-checkbox" data-filter-type="useCase" value="${u}" ${checked}>
                <span>For ${u}</span>
                <span class="filter-count">(${count})</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Processor -->
      <div class="filter-group">
        <div class="filter-group-title">Processor</div>
        <div class="filter-options-list">
          ${processors.map((p) => {
            const count = laptops.filter((l) => l.specs.cpuFamily === p).length;
            const checked = activeFilters.processor.includes(p) ? "checked" : "";
            return `
              <label class="filter-checkbox-label">
                <input type="checkbox" class="filter-checkbox" data-filter-type="processor" value="${p}" ${checked}>
                <span>${p}</span>
                <span class="filter-count">(${count})</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Memory (RAM) -->
      <div class="filter-group">
        <div class="filter-group-title">Memory (RAM)</div>
        <div class="filter-options-list">
          ${memories.map((m) => {
            const count = laptops.filter((l) => m.val === 64 ? l.specs.ramValue >= 64 : l.specs.ramValue === m.val).length;
            const checked = activeFilters.ram.includes(String(m.val)) ? "checked" : "";
            return `
              <label class="filter-checkbox-label">
                <input type="checkbox" class="filter-checkbox" data-filter-type="ram" value="${m.val}" ${checked}>
                <span>${m.label}</span>
                <span class="filter-count">(${count})</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Display Panel -->
      <div class="filter-group">
        <div class="filter-group-title">Display Panel</div>
        <div class="filter-options-list">
          ${displays.map((d) => {
            const count = laptops.filter((l) => l.displayType === d).length;
            const checked = activeFilters.display.includes(d) ? "checked" : "";
            return `
              <label class="filter-checkbox-label">
                <input type="checkbox" class="filter-checkbox" data-filter-type="display" value="${d}" ${checked}>
                <span>${d}</span>
                <span class="filter-count">(${count})</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Screen Size -->
      <div class="filter-group">
        <div class="filter-group-title">Screen Size</div>
        <div class="filter-options-list">
          ${sizes.map((s) => {
            const count = laptops.filter((l) => l.screenSizeCategory === s).length;
            const checked = activeFilters.size.includes(s) ? "checked" : "";
            return `
              <label class="filter-checkbox-label">
                <input type="checkbox" class="filter-checkbox" data-filter-type="size" value="${s}" ${checked}>
                <span>${s}</span>
                <span class="filter-count">(${count})</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Weight Class -->
      <div class="filter-group">
        <div class="filter-group-title">Weight</div>
        <div class="filter-options-list">
          ${weights.map((w) => {
            const count = laptops.filter((l) => l.weightCategory === w).length;
            const checked = activeFilters.weight.includes(w) ? "checked" : "";
            return `
              <label class="filter-checkbox-label">
                <input type="checkbox" class="filter-checkbox" data-filter-type="weight" value="${w}" ${checked}>
                <span>${w}</span>
                <span class="filter-count">(${count})</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>

      <!-- Graphics (GPU) -->
      <div class="filter-group">
        <div class="filter-group-title">Graphics (GPU)</div>
        <div class="filter-options-list">
          ${gpus.map((g) => {
            const count = laptops.filter((l) => l.specs.gpuClass === g).length;
            const checked = activeFilters.gpu.includes(g) ? "checked" : "";
            return `
              <label class="filter-checkbox-label">
                <input type="checkbox" class="filter-checkbox" data-filter-type="gpu" value="${g}" ${checked}>
                <span>${g}</span>
                <span class="filter-count">(${count})</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>
    `;

    if (sidebar) sidebar.innerHTML = html;
    if (mobileSidebar) mobileSidebar.innerHTML = html;
  }

  function applyFilters() {
    const laptops = typeof NOVA_LAPTOPS_DATA !== "undefined" ? NOVA_LAPTOPS_DATA : [];

    let filtered = laptops.filter((lap) => {
      // Search
      if (activeFilters.search) {
        const q = activeFilters.search.toLowerCase();
        const match =
          lap.model.toLowerCase().includes(q) ||
          lap.brand.toLowerCase().includes(q) ||
          lap.specs.processor.toLowerCase().includes(q) ||
          lap.specs.gpu.toLowerCase().includes(q) ||
          lap.useCases.some((u) => u.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Brand
      if (activeFilters.brand.length > 0 && !activeFilters.brand.includes(lap.brand)) {
        return false;
      }

      // Use Case
      if (activeFilters.useCase.length > 0 && !activeFilters.useCase.some((u) => lap.useCases.includes(u))) {
        return false;
      }

      // Processor
      if (activeFilters.processor.length > 0 && !activeFilters.processor.includes(lap.specs.cpuFamily)) {
        return false;
      }

      // RAM
      if (activeFilters.ram.length > 0) {
        const hasRam = activeFilters.ram.some((r) => {
          const val = parseInt(r);
          return val === 64 ? lap.specs.ramValue >= 64 : lap.specs.ramValue === val;
        });
        if (!hasRam) return false;
      }

      // Display
      if (activeFilters.display.length > 0 && !activeFilters.display.includes(lap.displayType)) {
        return false;
      }

      // Size
      if (activeFilters.size.length > 0 && !activeFilters.size.includes(lap.screenSizeCategory)) {
        return false;
      }

      // Weight
      if (activeFilters.weight.length > 0 && !activeFilters.weight.includes(lap.weightCategory)) {
        return false;
      }

      // GPU Class
      if (activeFilters.gpu.length > 0 && !activeFilters.gpu.includes(lap.specs.gpuClass)) {
        return false;
      }

      return true;
    });

    // Sorting
    if (currentSort === "newest") {
      // Keep natural order or tag
    } else if (currentSort === "lightweight") {
      filtered.sort((a, b) => a.weight - b.weight);
    } else if (currentSort === "performance") {
      filtered.sort((a, b) => b.specs.ramValue - a.specs.ramValue);
    } else if (currentSort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    renderLaptopsGrid(filtered);
    renderActiveFilterChips();
    updateResultCount(filtered.length);
  }

  function renderLaptopsGrid(items) {
    const container = document.getElementById("laptopsGridContainer");
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1.5rem; background: var(--bg-secondary); border: 1px dashed var(--border-medium); border-radius: var(--radius-xl);">
          <i data-lucide="sliders-horizontal" style="width: 44px; height: 44px; color: var(--accent-primary); margin: 0 auto 1rem; opacity: 0.6;"></i>
          <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">No matching laptops found</h3>
          <p style="color: var(--text-secondary); max-width: 460px; margin: 0 auto 1.5rem;">Try relaxing your filter criteria, broadening your RAM selection, or resetting all filters.</p>
          <button id="emptyResetBtn" class="btn btn-primary btn-sm">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById("emptyResetBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", resetAllFilters);
      }
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let html = "";
    items.forEach((lap) => {
      const isSaved = window.novaBookmarks ? window.novaBookmarks.isLaptopSaved(lap.id) : false;
      const inCompare = window.novaCompare ? window.novaCompare.isLaptopInCompare(lap.id) : false;

      let badgeClass = "badge-blue";
      if (lap.badge === "Creator Pick") badgeClass = "badge-cyan";
      if (lap.badge === "Lightweight") badgeClass = "badge-emerald";
      if (lap.badge === "Performance") badgeClass = "badge-amber";

      html += `
        <div class="laptop-card" data-laptop-id="${lap.id}">
          <div class="laptop-card-media">
            <img src="${lap.image}" alt="${lap.brand} ${lap.model}" class="laptop-card-img" loading="lazy">
            <div class="laptop-card-badges">
              <span class="badge ${badgeClass}">${lap.badge}</span>
            </div>
            <div class="laptop-card-quick-actions">
              <button class="card-icon-action-btn ${isSaved ? "active" : ""}" data-save-laptop-btn="${lap.id}" title="Save to shortlist">
                <i data-lucide="${isSaved ? "bookmark-check" : "bookmark"}" style="width: 16px; height: 16px;"></i>
              </button>
            </div>
          </div>
          <div class="laptop-card-body">
            <div class="laptop-card-brand-row">
              <span class="laptop-card-brand">${lap.brand}</span>
              <span class="laptop-card-price">$${lap.price}</span>
            </div>
            <h3 class="laptop-card-title">
              <a href="laptop-details.html?id=${lap.id}">${lap.model}</a>
            </h3>

            <div class="card-specs-matrix">
              <div class="spec-chip-item">
                <span class="spec-chip-label">CPU</span>
                <span class="spec-chip-value" title="${lap.specs.processor}">${lap.specs.processor.split("(")[0]}</span>
              </div>
              <div class="spec-chip-item">
                <span class="spec-chip-label">RAM / SSD</span>
                <span class="spec-chip-value">${lap.specs.ramValue}GB • ${lap.specs.storageValue >= 1000 ? (lap.specs.storageValue/1000) + "TB" : lap.specs.storageValue + "GB"}</span>
              </div>
              <div class="spec-chip-item">
                <span class="spec-chip-label">Display</span>
                <span class="spec-chip-value">${lap.screenSize}" ${lap.displayType}</span>
              </div>
              <div class="spec-chip-item">
                <span class="spec-chip-label">Weight</span>
                <span class="spec-chip-value">${lap.specs.weightKg.split("(")[0]}</span>
              </div>
            </div>

            <div class="laptop-card-footer">
              <button class="btn btn-secondary btn-card-compare ${inCompare ? "active" : ""}" data-compare-btn="${lap.id}">
                <i data-lucide="${inCompare ? "check" : "scale"}" style="width: 14px; height: 14px;"></i>
                ${inCompare ? "In Compare" : "Compare"}
              </button>
              <a href="laptop-details.html?id=${lap.id}" class="btn btn-outline btn-sm">
                Details <i data-lucide="arrow-right" style="width: 13px; height: 13px;"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
    if (window.novaBookmarks) window.novaBookmarks.updateSaveButtonsUI();
    if (window.novaCompare) window.novaCompare.updateCompareButtonsUI();
  }

  function renderActiveFilterChips() {
    const chipsContainer = document.getElementById("activeFilterChips");
    if (!chipsContainer) return;

    let chips = [];

    if (activeFilters.search) {
      chips.push({ type: "search", val: `Search: "${activeFilters.search}"` });
    }
    activeFilters.brand.forEach((b) => chips.push({ type: "brand", val: b }));
    activeFilters.useCase.forEach((u) => chips.push({ type: "useCase", val: `Use: ${u}` }));
    activeFilters.processor.forEach((p) => chips.push({ type: "processor", val: p }));
    activeFilters.ram.forEach((r) => chips.push({ type: "ram", val: `${r}GB RAM` }));
    activeFilters.display.forEach((d) => chips.push({ type: "display", val: d }));
    activeFilters.size.forEach((s) => chips.push({ type: "size", val: s }));
    activeFilters.weight.forEach((w) => chips.push({ type: "weight", val: w }));
    activeFilters.gpu.forEach((g) => chips.push({ type: "gpu", val: `GPU: ${g}` }));

    if (chips.length === 0) {
      chipsContainer.innerHTML = "";
      return;
    }

    chipsContainer.innerHTML = chips
      .map(
        (chip) => `
        <div class="filter-chip">
          <span>${chip.val}</span>
          <span class="filter-chip-remove" data-remove-chip-type="${chip.type}" data-remove-chip-val="${chip.val}">✕</span>
        </div>
      `
      )
      .join("");

    chipsContainer.querySelectorAll(".filter-chip-remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-remove-chip-type");
        if (type === "search") {
          activeFilters.search = "";
          const searchInput = document.getElementById("discoverySearchInput");
          if (searchInput) searchInput.value = "";
        } else {
          // Remove from corresponding array
          activeFilters[type] = [];
        }
        renderFilterSidebar();
        applyFilters();
      });
    });
  }

  function updateResultCount(count) {
    const countEl = document.getElementById("discoveryResultCount");
    if (countEl) {
      countEl.textContent = `Showing ${count} laptop${count === 1 ? "" : "s"}`;
    }
  }

  function resetAllFilters() {
    activeFilters = {
      search: "",
      brand: [],
      useCase: [],
      processor: [],
      ram: [],
      storage: [],
      display: [],
      size: [],
      weight: [],
      gpu: []
    };
    const searchInput = document.getElementById("discoverySearchInput");
    if (searchInput) searchInput.value = "";
    renderFilterSidebar();
    applyFilters();
    if (window.showToast) window.showToast("All filters cleared", "info");
  }

  function bindEvents() {
    // Search input
    const searchInput = document.getElementById("discoverySearchInput");
    if (searchInput) {
      if (activeFilters.search) searchInput.value = activeFilters.search;
      searchInput.addEventListener("input", (e) => {
        activeFilters.search = e.target.value.trim();
        applyFilters();
      });
    }

    // Sort select
    const sortSelect = document.getElementById("discoverySortSelect");
    if (sortSelect) {
      sortSelect.value = currentSort;
      sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        applyFilters();
      });
    }

    // Checkbox changes (delegated)
    document.body.addEventListener("change", (e) => {
      if (e.target.classList.contains("filter-checkbox")) {
        const type = e.target.getAttribute("data-filter-type");
        const val = e.target.value;
        if (e.target.checked) {
          if (!activeFilters[type].includes(val)) activeFilters[type].push(val);
        } else {
          activeFilters[type] = activeFilters[type].filter((item) => item !== val);
        }
        applyFilters();
      }
    });

    // Reset buttons
    document.body.addEventListener("click", (e) => {
      if (e.target.id === "clearAllFiltersBtn") {
        resetAllFilters();
      }
    });

    // Mobile filter drawer trigger
    const mobileFilterOpenBtn = document.getElementById("openMobileFiltersBtn");
    const mobileFilterDrawer = document.getElementById("mobileFilterDrawer");
    const mobileFilterCloseBtn = document.getElementById("closeMobileFiltersBtn");
    const mobileFilterApplyBtn = document.getElementById("applyMobileFiltersBtn");

    if (mobileFilterOpenBtn && mobileFilterDrawer) {
      mobileFilterOpenBtn.addEventListener("click", () => {
        mobileFilterDrawer.classList.add("open");
      });
    }

    if (mobileFilterCloseBtn && mobileFilterDrawer) {
      mobileFilterCloseBtn.addEventListener("click", () => {
        mobileFilterDrawer.classList.remove("open");
      });
    }

    if (mobileFilterApplyBtn && mobileFilterDrawer) {
      mobileFilterApplyBtn.addEventListener("click", () => {
        mobileFilterDrawer.classList.remove("open");
        applyFilters();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initFilters);
})();
