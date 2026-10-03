/**
 * NOVA LAPTOPS - Compare Page Table Renderer
 * Renders categorized comparison matrix, differences highlighter & laptop slot picker
 */

(function () {
  function initComparePage() {
    const tableWrap = document.getElementById("compareTableContainer");
    if (!tableWrap) return; // Not on compare.html

    renderComparisonPage();
    bindComparePageEvents();
  }

  function renderComparisonPage() {
    const tableWrap = document.getElementById("compareTableContainer");
    const emptyState = document.getElementById("compareEmptyState");
    const highlightToggle = document.getElementById("diffHighlightCheckbox");
    const showDiffOnly = highlightToggle ? highlightToggle.checked : false;

    if (!tableWrap) return;

    let items = window.novaCompare ? window.novaCompare.getCompareItems() : [];
    const allLaptops = typeof NOVA_LAPTOPS_DATA !== "undefined" ? NOVA_LAPTOPS_DATA : [];

    // Default to at least 2 laptops if none are selected yet for an awesome initial demo view
    if (items.length === 0) {
      items = ["macbook-pro-16-m3", "dell-xps-14-2024", "lenovo-thinkpad-x1-carbon-gen12"];
      if (window.novaCompare) {
        // Save initial demo comparison
        localStorage.setItem("nova_compare_laptops", JSON.stringify(items));
        window.novaCompare.renderCompareTray();
      }
    }

    const compareLaptops = items.map((id) => allLaptops.find((l) => l.id === id)).filter(Boolean);

    if (compareLaptops.length === 0) {
      if (tableWrap) tableWrap.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (tableWrap) tableWrap.style.display = "block";

    // Build the categorized spec rows
    const categories = [
      {
        name: "Performance & Core Silicon",
        specs: [
          { label: "Processor", key: "processor", getVal: (l) => l.specs.processor },
          { label: "Architecture", key: "cpuFamily", getVal: (l) => l.specs.cpuFamily },
          { label: "Core Layout", key: "cpuCores", getVal: (l) => l.specs.cpuCores },
          { label: "Graphics (GPU)", key: "gpu", getVal: (l) => l.specs.gpu },
          { label: "Memory (RAM)", key: "ram", getVal: (l) => l.specs.ram },
          { label: "Storage Capacity", key: "storage", getVal: (l) => l.specs.storage }
        ]
      },
      {
        name: "Display & Visuals",
        specs: [
          { label: "Screen Size & Tech", key: "display", getVal: (l) => l.specs.display },
          { label: "Refresh Rate", key: "refreshRate", getVal: (l) => l.specs.refreshRate },
          { label: "Peak Brightness", key: "brightness", getVal: (l) => l.specs.brightness },
          { label: "Color Gamut Coverage", key: "colorAccuracy", getVal: (l) => l.specs.colorAccuracy }
        ]
      },
      {
        name: "Physical & Chassis",
        specs: [
          { label: "Weight", key: "weightKg", getVal: (l) => l.specs.weightKg },
          { label: "Dimensions", key: "dimensions", getVal: (l) => l.specs.dimensions },
          { label: "Chassis Material", key: "materials", getVal: (l) => l.specs.materials },
          { label: "Keyboard & Trackpad", key: "keyboard", getVal: (l) => l.specs.keyboard }
        ]
      },
      {
        name: "Battery & Power",
        specs: [
          { label: "Battery Capacity", key: "battery", getVal: (l) => l.specs.battery },
          { label: "Claimed Longevity", key: "batteryLifeHours", getVal: (l) => l.specs.batteryLifeHours },
          { label: "Charging Speed", key: "charging", getVal: (l) => l.specs.charging }
        ]
      },
      {
        name: "Connectivity & I/O",
        specs: [
          { label: "Ports", key: "ports", getVal: (l) => l.specs.ports.join(", ") },
          { label: "Wireless", key: "wireless", getVal: (l) => l.specs.wireless },
          { label: "Webcam & Biometrics", key: "webcam", getVal: (l) => l.specs.webcam }
        ]
      }
    ];

    let tableHtml = `
      <div class="compare-table-wrapper">
        <table class="compare-table">
          <thead>
            <tr>
              <th class="compare-sticky-col">
                <div style="font-size: 0.8125rem; color: var(--text-muted); text-transform: uppercase;">Comparing ${compareLaptops.length} Models</div>
              </th>
              ${compareLaptops
                .map((lap) => {
                  return `
                  <th style="min-width: 240px; vertical-align: top;">
                    <div style="position: relative; margin-bottom: 0.75rem;">
                      <img src="${lap.image}" alt="${lap.model}" style="width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 0.5rem;">
                      <button class="compare-tray-remove" data-remove-compare-page="${lap.id}" style="top: 6px; right: 6px; width: 22px; height: 22px;" title="Remove from comparison">✕</button>
                      <div class="badge badge-blue" style="margin-bottom: 0.25rem;">${lap.brand}</div>
                      <div style="font-family: var(--font-heading); font-size: 1.125rem; font-weight: 700; color: var(--text-primary);"><a href="laptop-details.html?id=${lap.id}">${lap.model}</a></div>
                      <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: var(--accent-primary); margin-top: 0.25rem;">$${lap.price}</div>
                    </div>
                    <a href="laptop-details.html?id=${lap.id}" class="btn btn-outline btn-sm" style="width: 100%;">
                      View Full Details
                    </a>
                  </th>
                `;
                })
                .join("")}
              ${
                compareLaptops.length < 4
                  ? `
                <th style="min-width: 200px; text-align: center; vertical-align: middle; background: var(--bg-tertiary);">
                  <button id="addLaptopToCompareBtn" class="btn btn-secondary btn-sm">
                    <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Add Machine (${4 - compareLaptops.length} left)
                  </button>
                </th>
              `
                  : ""
              }
            </tr>
          </thead>
          <tbody>
    `;

    categories.forEach((cat) => {
      tableHtml += `
        <tr>
          <td colspan="${compareLaptops.length + (compareLaptops.length < 4 ? 2 : 1)}" class="compare-category-header">
            ${cat.name}
          </td>
        </tr>
      `;

      cat.specs.forEach((s) => {
        const values = compareLaptops.map((l) => s.getVal(l));
        const allSame = values.every((v) => v === values[0]);
        const isDiff = !allSame;

        if (showDiffOnly && !isDiff) return;

        tableHtml += `
          <tr class="${isDiff ? "diff-highlight" : ""}">
            <td class="compare-sticky-col">${s.label}</td>
            ${compareLaptops
              .map((lap) => {
                const val = s.getVal(lap);
                return `<td>${val}</td>`;
              })
              .join("")}
            ${compareLaptops.length < 4 ? `<td style="background: var(--bg-tertiary); opacity: 0.3;">—</td>` : ""}
          </tr>
        `;
      });
    });

    tableHtml += `
          </tbody>
        </table>
      </div>
    `;

    tableWrap.innerHTML = tableHtml;

    // Hook up remove buttons on table
    tableWrap.querySelectorAll("[data-remove-compare-page]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-remove-compare-page");
        if (window.novaCompare) {
          window.novaCompare.toggleCompareLaptop(id);
          renderComparisonPage();
        }
      });
    });

    // Hook up add machine button
    const addBtn = tableWrap.querySelector("#addLaptopToCompareBtn");
    if (addBtn) {
      addBtn.addEventListener("click", openAddLaptopModal);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  function openAddLaptopModal() {
    let modal = document.getElementById("addLaptopCompareModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "addLaptopCompareModal";
      modal.className = "modal-backdrop";
      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="search-modal-header">
            <h3 style="font-size: 1.125rem; font-weight: 700;">Add Laptop to Comparison</h3>
            <button id="closeAddLaptopModalBtn" class="btn btn-icon btn-sm" style="color: var(--text-muted);">✕</button>
          </div>
          <div id="addLaptopListContainer" class="search-results-list" style="max-height: 380px;"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const listContainer = modal.querySelector("#addLaptopListContainer");
    const closeBtn = modal.querySelector("#closeAddLaptopModalBtn");
    const allLaptops = typeof NOVA_LAPTOPS_DATA !== "undefined" ? NOVA_LAPTOPS_DATA : [];
    const inCompare = window.novaCompare ? window.novaCompare.getCompareItems() : [];

    const available = allLaptops.filter((l) => !inCompare.includes(l.id));

    listContainer.innerHTML = available
      .map((lap) => {
        return `
        <div class="search-result-item" style="cursor: pointer;" data-slot-laptop-id="${lap.id}">
          <img src="${lap.image}" alt="${lap.model}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 700; font-size: 0.9375rem; color: var(--text-primary);">${lap.brand} ${lap.model}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">${lap.specs.processor.split("(")[0]} • ${lap.specs.ramValue}GB RAM</div>
          </div>
          <div style="font-family: var(--font-heading); font-weight: 700; color: var(--accent-primary);">$${lap.price}</div>
          <button class="btn btn-primary btn-sm" style="padding: 0.35rem 0.65rem;">+ Add</button>
        </div>
      `;
      })
      .join("");

    modal.classList.add("open");

    listContainer.querySelectorAll("[data-slot-laptop-id]").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-slot-laptop-id");
        if (window.novaCompare) {
          window.novaCompare.toggleCompareLaptop(id);
        }
        modal.classList.remove("open");
        renderComparisonPage();
      });
    });

    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  }

  function bindComparePageEvents() {
    const highlightToggle = document.getElementById("diffHighlightCheckbox");
    if (highlightToggle) {
      highlightToggle.addEventListener("change", renderComparisonPage);
    }

    const clearAllBtn = document.getElementById("clearComparePageBtn");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        if (window.novaCompare) {
          window.novaCompare.clearComparison();
          renderComparisonPage();
        }
      });
    }

    const shareBtn = document.getElementById("shareCompareBtn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        if (window.showToast) {
          window.showToast("Comparison link copied to clipboard!", "success");
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initComparePage);
})();
