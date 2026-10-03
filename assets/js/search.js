/**
 * NOVA LAPTOPS - Global Search Modal Engine
 * Supports keyboard shortcuts (Cmd+K / /), real-time multi-entity querying & keyboard navigation
 */

(function () {
  function initSearchModal() {
    let modal = document.getElementById("globalSearchModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "globalSearchModal";
      modal.className = "modal-backdrop";
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="search-modal-header">
            <i data-lucide="search" style="width: 20px; height: 20px; color: var(--accent-primary);"></i>
            <input type="text" id="globalSearchInput" class="search-modal-input" placeholder="Search laptop models, processors, GPUs, guides, use cases..." autocomplete="off">
            <button id="closeSearchModalBtn" class="btn btn-icon btn-sm" style="color: var(--text-muted);">✕</button>
          </div>
          <div style="padding: 0.75rem 1.5rem 0.25rem; display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Quick Tags:</span>
            <button class="filter-chip" data-quick-search="OLED">OLED</button>
            <button class="filter-chip" data-quick-search="Snapdragon">Snapdragon</button>
            <button class="filter-chip" data-quick-search="RTX 4080">RTX 4080</button>
            <button class="filter-chip" data-quick-search="Creator">Creator</button>
            <button class="filter-chip" data-quick-search="RAM">RAM Guide</button>
          </div>
          <div id="searchResultsContainer" class="search-results-list">
            <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.875rem;">
              Type to search laptops, hardware specifications, and guides...
            </div>
          </div>
          <div style="padding: 0.75rem 1.5rem; border-top: 1px solid var(--border-subtle); background: var(--bg-tertiary); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-muted);">
            <span>Navigate with <kbd class="search-kbd">↑</kbd> <kbd class="search-kbd">↓</kbd></span>
            <span>Select with <kbd class="search-kbd">ENTER</kbd></span>
            <span>Close with <kbd class="search-kbd">ESC</kbd></span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const input = document.getElementById("globalSearchInput");
    const resultsContainer = document.getElementById("searchResultsContainer");
    const closeBtn = document.getElementById("closeSearchModalBtn");

    function openModal() {
      modal.classList.add("open");
      setTimeout(() => input.focus(), 50);
      if (window.lucide) window.lucide.createIcons();
    }

    function closeModal() {
      modal.classList.remove("open");
      input.value = "";
    }

    // Bind triggers
    document.querySelectorAll(".search-trigger-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Keyboard global listener
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (modal.classList.contains("open")) {
          closeModal();
        } else {
          openModal();
        }
      } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        openModal();
      } else if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });

    // Quick tag clicks
    modal.querySelectorAll("[data-quick-search]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const query = chip.getAttribute("data-quick-search");
        input.value = query;
        performSearch(query);
      });
    });

    // Realtime search
    input.addEventListener("input", (e) => {
      performSearch(e.target.value.trim());
    });

    function performSearch(query) {
      if (!query) {
        resultsContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.875rem;">
            Type to search laptops, hardware specifications, and guides...
          </div>
        `;
        return;
      }

      const q = query.toLowerCase();
      const laptops = typeof NOVA_LAPTOPS_DATA !== "undefined" ? NOVA_LAPTOPS_DATA : [];
      const guides = typeof NOVA_GUIDES_DATA !== "undefined" ? NOVA_GUIDES_DATA : [];

      const matchedLaptops = laptops.filter((lap) => {
        return (
          lap.model.toLowerCase().includes(q) ||
          lap.brand.toLowerCase().includes(q) ||
          lap.specs.processor.toLowerCase().includes(q) ||
          lap.specs.gpu.toLowerCase().includes(q) ||
          lap.useCases.some((uc) => uc.toLowerCase().includes(q)) ||
          lap.displayType.toLowerCase().includes(q)
        );
      });

      const matchedGuides = guides.filter((g) => {
        return (
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.excerpt.toLowerCase().includes(q)
        );
      });

      if (matchedLaptops.length === 0 && matchedGuides.length === 0) {
        resultsContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: var(--text-secondary);">
            <i data-lucide="search-x" style="width: 32px; height: 32px; margin: 0 auto 0.5rem; opacity: 0.5;"></i>
            <div style="font-weight: 600;">No results found for "${query}"</div>
            <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.25rem;">Try searching by brand (Apple, Dell, Lenovo), processor, or display type (OLED).</div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      let html = "";

      if (matchedLaptops.length > 0) {
        html += `<div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin: 0.5rem 0;">Laptops (${matchedLaptops.length})</div>`;
        matchedLaptops.forEach((lap) => {
          html += `
            <a href="laptop-details.html?id=${lap.id}" class="search-result-item">
              <img src="${lap.image}" alt="${lap.model}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;">
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <span style="font-weight: 700; font-size: 0.9375rem; color: var(--text-primary);">${lap.brand} ${lap.model}</span>
                  <span class="badge badge-neutral" style="font-size: 0.6875rem;">${lap.specs.ramValue}GB RAM</span>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${lap.specs.processor} • ${lap.specs.gpu} • ${lap.displayType}
                </div>
              </div>
              <div style="font-family: var(--font-heading); font-weight: 700; color: var(--accent-primary);">$${lap.price}</div>
            </a>
          `;
        });
      }

      if (matchedGuides.length > 0) {
        html += `<div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin: 1rem 0 0.5rem;">Buying Guides (${matchedGuides.length})</div>`;
        matchedGuides.forEach((g) => {
          html += `
            <a href="guide-details.html?id=${g.id}" class="search-result-item">
              <div style="width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--accent-subtle); color: var(--accent-primary); display: flex; align-items: center; justify-content: center;">
                <i data-lucide="book-open" style="width: 20px; height: 20px;"></i>
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 700; font-size: 0.875rem; color: var(--text-primary); line-height: 1.3;">${g.title}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${g.category} • ${g.readTime}</div>
              </div>
            </a>
          `;
        });
      }

      resultsContainer.innerHTML = html;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  document.addEventListener("DOMContentLoaded", initSearchModal);
})();
