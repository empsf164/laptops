/**
 * NOVA LAPTOPS - Comparison System & Floating Tray Engine
 * Handles side-by-side spec comparisons, difference highlighting, and tray actions
 */

(function () {
  const COMPARE_KEY = "nova_compare_laptops";
  const MAX_COMPARE_ITEMS = 4;

  function getCompareItems() {
    const data = localStorage.getItem(COMPARE_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveCompareItems(items) {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(items.slice(0, MAX_COMPARE_ITEMS)));
    updateCompareBadges();
    updateCompareButtonsUI();
    renderCompareTray();
  }

  function isLaptopInCompare(id) {
    return getCompareItems().includes(id);
  }

  function toggleCompareLaptop(id) {
    let items = getCompareItems();
    if (items.includes(id)) {
      items = items.filter((item) => item !== id);
      saveCompareItems(items);
      if (window.showToast) {
        window.showToast("Removed from comparison", "info");
      }
      return false;
    } else {
      if (items.length >= MAX_COMPARE_ITEMS) {
        if (window.showToast) {
          window.showToast(`Comparison limit reached (Max ${MAX_COMPARE_ITEMS} laptops)`, "warning");
        }
        return false;
      }
      items.push(id);
      saveCompareItems(items);
      if (window.showToast) {
        window.showToast("Added to comparison tray", "success");
      }
      return true;
    }
  }

  function clearComparison() {
    saveCompareItems([]);
    if (window.showToast) {
      window.showToast("Comparison cleared", "info");
    }
  }

  function updateCompareBadges() {
    const count = getCompareItems().length;
    const badges = document.querySelectorAll(".compare-count-badge");
    badges.forEach((badge) => {
      badge.textContent = count > 0 ? count : "";
      badge.setAttribute("data-count", count);
    });
  }

  function updateCompareButtonsUI() {
    const items = getCompareItems();
    document.querySelectorAll("[data-compare-btn]").forEach((btn) => {
      const laptopId = btn.getAttribute("data-compare-btn");
      const inCompare = items.includes(laptopId);

      if (inCompare) {
        btn.classList.add("active");
        if (btn.classList.contains("btn-card-compare")) {
          btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i> In Compare';
        } else {
          btn.innerHTML = '<i data-lucide="check" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>';
        }
      } else {
        btn.classList.remove("active");
        if (btn.classList.contains("btn-card-compare")) {
          btn.innerHTML = '<i data-lucide="scale" style="width: 14px; height: 14px;"></i> Compare';
        } else {
          btn.innerHTML = '<i data-lucide="scale" style="width: 18px; height: 18px;"></i>';
        }
      }
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderCompareTray() {
    let tray = document.getElementById("floatingCompareTray");
    const items = getCompareItems();

    if (items.length === 0) {
      if (tray) {
        tray.classList.remove("visible");
        tray.style.display = "none";
      }
      return;
    }

    if (!tray) {
      tray = document.createElement("div");
      tray.id = "floatingCompareTray";
      tray.className = "compare-tray";
      document.body.appendChild(tray);
    }
    tray.style.display = "flex";

    // Lookup laptop data from NOVA_LAPTOPS_DATA
    const laptopList = typeof NOVA_LAPTOPS_DATA !== "undefined" ? NOVA_LAPTOPS_DATA : [];
    let itemsHtml = "";

    for (let i = 0; i < MAX_COMPARE_ITEMS; i++) {
      if (i < items.length) {
        const id = items[i];
        const lap = laptopList.find((l) => l.id === id);
        if (lap) {
          itemsHtml += `
            <div class="compare-tray-item" title="${lap.brand} ${lap.model}">
              <img src="${lap.image}" alt="${lap.model}" class="compare-tray-img">
              <button class="compare-tray-remove" data-remove-compare="${lap.id}" title="Remove">✕</button>
            </div>
          `;
        }
      } else {
        itemsHtml += `
          <div class="compare-tray-slot-empty" title="Empty slot">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
          </div>
        `;
      }
    }

    tray.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span style="font-family: var(--font-heading); font-weight: 700; font-size: 0.875rem;">
          Compare <span style="color: var(--accent-primary);">${items.length}/${MAX_COMPARE_ITEMS}</span>
        </span>
        <div class="compare-tray-items">
          ${itemsHtml}
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <button id="trayClearBtn" class="btn btn-secondary btn-sm" style="padding: 0.4rem 0.65rem;">Clear</button>
        <a href="compare.html" class="btn btn-primary btn-sm">
          Compare Now <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
        </a>
      </div>
    `;

    tray.classList.add("visible");

    // Hook up tray buttons
    tray.querySelectorAll("[data-remove-compare]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-remove-compare");
        toggleCompareLaptop(id);
      });
    });

    const clearBtn = tray.querySelector("#trayClearBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", clearComparison);
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateCompareBadges();
    updateCompareButtonsUI();
    renderCompareTray();

    document.body.addEventListener("click", (e) => {
      const compareBtn = e.target.closest("[data-compare-btn]");
      if (compareBtn) {
        e.preventDefault();
        e.stopPropagation();
        const laptopId = compareBtn.getAttribute("data-compare-btn");
        toggleCompareLaptop(laptopId);
      }
    });
  });

  window.novaCompare = {
    getCompareItems,
    toggleCompareLaptop,
    isLaptopInCompare,
    clearComparison,
    renderCompareTray
  };
})();
