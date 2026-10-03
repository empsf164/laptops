/**
 * NOVA LAPTOPS - Bookmarks & Shortlist Engine
 * Handles saving/favoriting laptops, editorial guides, and active comparisons
 */

(function () {
  const SAVED_LAPTOPS_KEY = "nova_saved_laptops";
  const SAVED_GUIDES_KEY = "nova_saved_guides";

  function getSavedLaptops() {
    const data = localStorage.getItem(SAVED_LAPTOPS_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveLaptopsList(list) {
    localStorage.setItem(SAVED_LAPTOPS_KEY, JSON.stringify(list));
    updateSavedBadges();
    updateSaveButtonsUI();
  }

  function isLaptopSaved(id) {
    return getSavedLaptops().includes(id);
  }

  function toggleSaveLaptop(id) {
    let list = getSavedLaptops();
    let isSaved = false;

    if (list.includes(id)) {
      list = list.filter((item) => item !== id);
      isSaved = false;
      if (window.showToast) {
        window.showToast("Removed from your shortlist", "info");
      }
    } else {
      list.push(id);
      isSaved = true;
      if (window.showToast) {
        window.showToast("Saved to your shortlist", "success");
      }
    }
    saveLaptopsList(list);
    return isSaved;
  }

  function getSavedGuides() {
    const data = localStorage.getItem(SAVED_GUIDES_KEY);
    return data ? JSON.parse(data) : [];
  }

  function saveGuidesList(list) {
    localStorage.setItem(SAVED_GUIDES_KEY, JSON.stringify(list));
    updateSavedBadges();
    updateSaveButtonsUI();
  }

  function isGuideSaved(id) {
    return getSavedGuides().includes(id);
  }

  function toggleSaveGuide(id) {
    let list = getSavedGuides();
    let isSaved = false;

    if (list.includes(id)) {
      list = list.filter((item) => item !== id);
      isSaved = false;
      if (window.showToast) {
        window.showToast("Guide removed from saved list", "info");
      }
    } else {
      list.push(id);
      isSaved = true;
      if (window.showToast) {
        window.showToast("Guide saved to reading list", "success");
      }
    }
    saveGuidesList(list);
    return isSaved;
  }

  function updateSavedBadges() {
    const laptopCount = getSavedLaptops().length;
    const guideCount = getSavedGuides().length;
    const totalCount = laptopCount + guideCount;

    const badges = document.querySelectorAll(".saved-count-badge");
    badges.forEach((badge) => {
      badge.textContent = totalCount > 0 ? totalCount : "";
      badge.setAttribute("data-count", totalCount);
    });
  }

  function updateSaveButtonsUI() {
    const savedLaptops = getSavedLaptops();
    document.querySelectorAll("[data-save-laptop-btn]").forEach((btn) => {
      const laptopId = btn.getAttribute("data-save-laptop-btn");
      const isSaved = savedLaptops.includes(laptopId);

      if (isSaved) {
        btn.classList.add("active");
        btn.setAttribute("title", "Saved to shortlist");
        btn.innerHTML = '<i data-lucide="bookmark-check" style="width: 18px; height: 18px; color: var(--accent-primary);"></i>';
      } else {
        btn.classList.remove("active");
        btn.setAttribute("title", "Save to shortlist");
        btn.innerHTML = '<i data-lucide="bookmark" style="width: 18px; height: 18px;"></i>';
      }
    });

    const savedGuides = getSavedGuides();
    document.querySelectorAll("[data-save-guide-btn]").forEach((btn) => {
      const guideId = btn.getAttribute("data-save-guide-btn");
      const isSaved = savedGuides.includes(guideId);

      if (isSaved) {
        btn.classList.add("active");
        btn.innerHTML = '<i data-lucide="bookmark-check" style="width: 18px; height: 18px; color: var(--accent-primary);"></i> Saved';
      } else {
        btn.classList.remove("active");
        btn.innerHTML = '<i data-lucide="bookmark" style="width: 18px; height: 18px;"></i> Save Guide';
      }
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    updateSavedBadges();
    updateSaveButtonsUI();

    document.body.addEventListener("click", (e) => {
      const saveLaptopBtn = e.target.closest("[data-save-laptop-btn]");
      if (saveLaptopBtn) {
        e.preventDefault();
        e.stopPropagation();
        const laptopId = saveLaptopBtn.getAttribute("data-save-laptop-btn");
        toggleSaveLaptop(laptopId);
      }

      const saveGuideBtn = e.target.closest("[data-save-guide-btn]");
      if (saveGuideBtn) {
        e.preventDefault();
        e.stopPropagation();
        const guideId = saveGuideBtn.getAttribute("data-save-guide-btn");
        toggleSaveGuide(guideId);
      }
    });
  });

  window.novaBookmarks = {
    getSavedLaptops,
    toggleSaveLaptop,
    isLaptopSaved,
    getSavedGuides,
    toggleSaveGuide,
    isGuideSaved,
    updateSavedBadges,
    updateSaveButtonsUI
  };
})();
