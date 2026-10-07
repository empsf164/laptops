/**
 * NOVA LAPTOPS - Saved Shortlist & Reading List Manager
 * Powers saved.html with tabs for Saved Laptops, Saved Guides, and Comparisons
 */

(function () {
  function initSavedPage() {
    const container = document.getElementById("savedPageContainer");
    if (!container) return; // Not on saved.html

    renderSavedPage();
    bindSavedEvents();
  }

  function renderSavedPage() {
    const laptopsTabContent = document.getElementById("savedLaptopsContent");
    const guidesTabContent = document.getElementById("savedGuidesContent");
    const comparisonsTabContent = document.getElementById("savedComparisonsContent");

    const savedLaptopIds = window.novaBookmarks ? window.novaBookmarks.getSavedLaptops() : [];
    const savedGuideIds = window.novaBookmarks ? window.novaBookmarks.getSavedGuides() : [];
    const compareIds = window.novaCompare ? window.novaCompare.getCompareItems() : [];

    const allLaptops = typeof NOVA_LAPTOPS_DATA !== "undefined" ? NOVA_LAPTOPS_DATA : [];
    const allGuides = typeof NOVA_GUIDES_DATA !== "undefined" ? NOVA_GUIDES_DATA : [];

    // 1. Render Saved Laptops Tab
    if (laptopsTabContent) {
      const savedLaptops = savedLaptopIds.map((id) => allLaptops.find((l) => l.id === id)).filter(Boolean);

      if (savedLaptops.length === 0) {
        laptopsTabContent.innerHTML = `
          <div style="text-align: center; padding: 4rem 1.5rem; background: var(--bg-secondary); border: 1px dashed var(--border-medium); border-radius: var(--radius-xl);">
            <i data-lucide="bookmark" style="width: 44px; height: 44px; color: var(--accent-primary); margin: 0 auto 1rem; opacity: 0.6;"></i>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">Your shortlist is empty</h3>
            <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto 1.5rem;">Explore laptops in our catalog and click the bookmark icon to curate your personal buying shortlist.</p>
            <a href="laptops.html" class="btn btn-primary btn-sm">Explore Laptops</a>
          </div>
        `;
      } else {
        laptopsTabContent.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div style="font-size: 0.9375rem; color: var(--text-secondary);">
              <strong>${savedLaptops.length}</strong> machine${savedLaptops.length === 1 ? "" : "s"} saved to your shortlist
            </div>
            <div style="display: flex; gap: 0.75rem;">
              <button id="compareAllSavedBtn" class="btn btn-secondary btn-sm">
                <i data-lucide="scale" style="width: 15px; height: 15px;"></i> Compare All (${savedLaptops.length})
              </button>
              <button id="clearAllSavedLaptopsBtn" class="btn btn-outline btn-sm">
                Clear Shortlist
              </button>
            </div>
          </div>

          <div class="grid grid-3">
            ${savedLaptops
              .map((lap) => {
                const inComp = window.novaCompare ? window.novaCompare.isLaptopInCompare(lap.id) : false;
                return `
                <div class="laptop-card">
                  <div class="laptop-card-media">
                    <img src="${lap.image}" alt="${lap.model}" class="laptop-card-img" loading="lazy">
                    <div class="laptop-card-quick-actions">
                      <button class="card-icon-action-btn active" data-save-laptop-btn="${lap.id}" title="Remove from shortlist">
                        <i data-lucide="bookmark-check" style="width: 16px; height: 16px;"></i>
                      </button>
                    </div>
                  </div>
                  <div class="laptop-card-body">
                    <div class="laptop-card-brand-row">
                      <span class="laptop-card-brand">${lap.brand}</span>
                      <span class="laptop-card-price">$${lap.price}</span>
                    </div>
                    <h3 class="laptop-card-title"><a href="laptop-details.html?id=${lap.id}">${lap.model}</a></h3>
                    <div class="card-specs-matrix">
                      <div class="spec-chip-item">
                        <span class="spec-chip-label">CPU</span>
                        <span class="spec-chip-value">${lap.specs.processor.split("(")[0]}</span>
                      </div>
                      <div class="spec-chip-item">
                        <span class="spec-chip-label">RAM</span>
                        <span class="spec-chip-value">${lap.specs.ramValue}GB</span>
                      </div>
                    </div>
                    <div class="laptop-card-footer">
                      <button class="btn btn-secondary btn-card-compare ${inComp ? "active" : ""}" data-compare-btn="${lap.id}">
                        <i data-lucide="${inComp ? "check" : "scale"}" style="width: 14px; height: 14px;"></i>
                        ${inComp ? "In Compare" : "Compare"}
                      </button>
                      <a href="laptop-details.html?id=${lap.id}" class="btn btn-outline btn-sm">Details</a>
                    </div>
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        `;
      }
    }

    // 2. Render Saved Guides Tab
    if (guidesTabContent) {
      const savedGuides = savedGuideIds.map((id) => allGuides.find((g) => g.id === id)).filter(Boolean);

      if (savedGuides.length === 0) {
        guidesTabContent.innerHTML = `
          <div style="text-align: center; padding: 4rem 1.5rem; background: var(--bg-secondary); border: 1px dashed var(--border-medium); border-radius: var(--radius-xl);">
            <i data-lucide="book-open" style="width: 44px; height: 44px; color: var(--accent-primary); margin: 0 auto 1rem; opacity: 0.6;"></i>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">No saved buying guides</h3>
            <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto 1.5rem;">Bookmark technical buying guides to reference spec explanations and recommendations at your convenience.</p>
            <a href="guides.html" class="btn btn-primary btn-sm">Explore Guides</a>
          </div>
        `;
      } else {
        guidesTabContent.innerHTML = `
          <div class="grid grid-3">
            ${savedGuides
              .map((g) => {
                return `
                <div class="guide-card">
                  <div class="guide-card-media">
                    <img src="${g.image}" alt="${g.title}" class="guide-card-img" loading="lazy">
                  </div>
                  <div class="guide-card-body">
                    <div class="guide-meta-row">
                      <span class="badge badge-blue">${g.category}</span>
                      <span>${g.readTime}</span>
                    </div>
                    <h3 class="guide-card-title"><a href="guide-details.html?id=${g.id}">${g.title}</a></h3>
                    <p class="guide-card-excerpt">${g.excerpt}</p>
                    <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                      <a href="guide-details.html?id=${g.id}" class="btn btn-outline btn-sm">Read Article</a>
                      <button class="card-icon-action-btn active" data-save-guide-btn="${g.id}" title="Remove">
                        <i data-lucide="bookmark-check" style="width: 16px; height: 16px;"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        `;
      }
    }

    // 3. Render Comparisons Tab
    if (comparisonsTabContent) {
      const compareLaptops = compareIds.map((id) => allLaptops.find((l) => l.id === id)).filter(Boolean);

      if (compareLaptops.length === 0) {
        comparisonsTabContent.innerHTML = `
          <div style="text-align: center; padding: 4rem 1.5rem; background: var(--bg-secondary); border: 1px dashed var(--border-medium); border-radius: var(--radius-xl);">
            <i data-lucide="scale" style="width: 44px; height: 44px; color: var(--accent-primary); margin: 0 auto 1rem; opacity: 0.6;"></i>
            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">No active comparisons</h3>
            <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto 1.5rem;">Select 2 to 4 laptops across the site to compare processors, displays, weight, and battery life side by side.</p>
            <a href="laptops.html" class="btn btn-primary btn-sm">Browse Laptops</a>
          </div>
        `;
      } else {
        comparisonsTabContent.innerHTML = `
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-medium); border-radius: var(--radius-xl); padding: 2rem; margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h3 style="font-size: 1.25rem;">Active Comparison Set (${compareLaptops.length} laptops)</h3>
                <p style="font-size: 0.875rem; color: var(--text-secondary);">Currently slotted for detailed spec matrix comparison.</p>
              </div>
              <a href="compare.html" class="btn btn-primary">
                Open Full Comparison Table <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
              </a>
            </div>

            <div class="grid grid-4">
              ${compareLaptops
                .map((lap) => {
                  return `
                  <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; text-align: center;">
                    <img src="${lap.image}" alt="${lap.model}" style="width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 0.5rem;">
                    <div style="font-weight: 700; font-size: 0.9375rem;">${lap.model}</div>
                    <div style="font-size: 0.8125rem; color: var(--accent-primary); font-weight: 600; margin-top: 0.25rem;">$${lap.price}</div>
                  </div>
                `;
                })
                .join("")}
            </div>
          </div>
        `;
      }
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function bindSavedEvents() {
    // Tabs
    const tabBtns = document.querySelectorAll(".saved-tab-btn");
    const tabPanels = document.querySelectorAll(".saved-tab-panel");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabPanels.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");
        const targetId = btn.getAttribute("data-saved-tab");
        const panel = document.getElementById(targetId);
        if (panel) panel.classList.add("active");
      });
    });

    // Clear shortlist
    document.body.addEventListener("click", (e) => {
      if (e.target.id === "clearAllSavedLaptopsBtn") {
        if (window.novaBookmarks) {
          localStorage.setItem("nova_saved_laptops", JSON.stringify([]));
          window.novaBookmarks.updateSavedBadges();
          window.novaBookmarks.updateSaveButtonsUI();
          renderSavedPage();
          if (window.showToast) window.showToast("Shortlist cleared", "info");
        }
      }

      if (e.target.id === "compareAllSavedBtn" || e.target.closest("#compareAllSavedBtn")) {
        const saved = window.novaBookmarks ? window.novaBookmarks.getSavedLaptops() : [];
        if (saved.length > 0) {
          localStorage.setItem("nova_compare_laptops", JSON.stringify(saved.slice(0, 4)));
          window.location.href = "compare.html";
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initSavedPage);
})();
