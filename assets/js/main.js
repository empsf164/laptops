/**
 * NOVA LAPTOPS - Main Core Engine
 * Toast notifications, mobile nav, hero interactions, icon initialization
 */

// Global Toast System
window.showToast = function (message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";

  let iconName = "info";
  let borderLeftColor = "var(--accent-primary)";

  if (type === "success") {
    iconName = "check-circle";
    borderLeftColor = "var(--emerald-accent)";
  } else if (type === "warning") {
    iconName = "alert-triangle";
    borderLeftColor = "var(--amber-accent)";
  } else if (type === "error") {
    iconName = "alert-circle";
    borderLeftColor = "var(--rose-accent)";
  }

  toast.style.borderLeftColor = borderLeftColor;
  toast.innerHTML = `
    <i data-lucide="${iconName}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
    <div style="flex: 1; font-weight: 500;">${message}</div>
  `;

  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

// Main DOM Content Loaded Initializer
document.addEventListener("DOMContentLoaded", () => {
  // Lucide Icons init
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Sticky Navbar Scroll Effect
  const header = document.querySelector(".site-header");
  const handleHeaderScroll = () => {
    if (header) {
      if (window.scrollY > 10) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  };
  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // Back to Top Button System
  let backToTopBtn = document.getElementById("backToTopBtn");
  if (!backToTopBtn) {
    backToTopBtn = document.createElement("button");
    backToTopBtn.id = "backToTopBtn";
    backToTopBtn.className = "back-to-top-btn";
    backToTopBtn.setAttribute("aria-label", "Back to top");
    backToTopBtn.setAttribute("title", "Back to top");
    backToTopBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>`;
    document.body.appendChild(backToTopBtn);
  }

  const handleBackToTopVisibility = () => {
    if (backToTopBtn) {
      if (window.scrollY > 250) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }
  };
  window.addEventListener("scroll", handleBackToTopVisibility, { passive: true });
  handleBackToTopVisibility();

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Active Menu Highlighting Sync (Desktop & Mobile Nav)
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const normalizePageName = (path) => {
    if (!path || path === "/" || path === "index.html") return "index.html";
    return path.split("?")[0].split("#")[0];
  };

  const activePage = normalizePageName(currentPath);

  // Sync desktop nav links
  document.querySelectorAll(".main-nav .nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && normalizePageName(href) === activePage) {
      link.classList.add("active");
    } else if (href && !link.closest(".dropdown-menu")) {
      link.classList.remove("active");
    }
  });

  // Sync mobile drawer nav links
  document.querySelectorAll(".mobile-nav-links .mobile-nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href && normalizePageName(href) === activePage) {
      link.classList.add("active");
    } else if (href) {
      link.classList.remove("active");
    }
  });

  // Global Password Show/Hide Toggle Handler
  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest(".password-toggle-btn");
    if (toggleBtn) {
      e.preventDefault();
      const wrapper = toggleBtn.closest(".password-input-wrapper") || toggleBtn.parentElement;
      const input = wrapper ? wrapper.querySelector("input") : null;
      if (input) {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        toggleBtn.innerHTML = `<i data-lucide="${isPassword ? "eye-off" : "eye"}" style="width: 18px; height: 18px;"></i>`;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  });

  // Mobile Navigation Drawer
  const mobileToggleBtn = document.getElementById("mobileNavToggle");
  const mobileDrawer = document.getElementById("mobileNavDrawer");
  const mobileCloseBtn = document.getElementById("mobileNavClose");

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener("click", () => {
      mobileDrawer.classList.add("open");
    });
  }

  if (mobileCloseBtn && mobileDrawer) {
    mobileCloseBtn.addEventListener("click", () => {
      mobileDrawer.classList.remove("open");
    });
  }

  if (mobileDrawer) {
    mobileDrawer.addEventListener("click", (e) => {
      if (e.target === mobileDrawer) {
        mobileDrawer.classList.remove("open");
      }
    });

    // Mobile Accordion Dropdowns
    mobileDrawer.querySelectorAll(".mobile-accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const content = trigger.nextElementSibling;
        const icon = trigger.querySelector("i");
        if (content && content.classList.contains("mobile-accordion-content")) {
          content.classList.toggle("open");
          if (icon) {
            icon.style.transform = content.classList.contains("open") ? "rotate(180deg)" : "rotate(0deg)";
          }
        }
      });
    });
  }

  // Hero Interactive Specification Switcher (index.html)
  const heroPillButtons = document.querySelectorAll(".hero-pill-btn");
  const heroDeviceImg = document.getElementById("heroDeviceImg");
  const heroSpecGrid = document.getElementById("heroDynamicSpecs");

  if (heroPillButtons.length > 0 && heroSpecGrid) {
    const heroSpecsData = {
      performance: {
        img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        specs: [
          { label: "Flagship CPU", value: "Apple M3 Max / Intel i9 HX" },
          { label: "Max Memory", value: "Up to 128GB Unified RAM" },
          { label: "GPU Output", value: "175W High-TGP Graphics" },
          { label: "Throughput", value: "7,500 MB/s NVMe Gen 4" }
        ]
      },
      portability: {
        img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
        specs: [
          { label: "Chassis Weight", value: "Starting at 1.09 kg" },
          { label: "Thickness", value: "Ultra-thin 11.5 mm" },
          { label: "Materials", value: "Carbon Fiber & Recycled Mg" },
          { label: "Durability", value: "MIL-STD 810H Tested" }
        ]
      },
      battery: {
        img: "https://images.unsplash.com/photo-1542393545-10f5cde2c810?auto=format&fit=crop&w=800&q=80",
        specs: [
          { label: "Real Endurance", value: "18 to 22 Hours Run-time" },
          { label: "Silicon Tech", value: "Snapdragon X & M3 3nm" },
          { label: "Fast Charge", value: "80% in 45 Minutes" },
          { label: "Standby Efficiency", value: "0.2W Low-Power SoC Island" }
        ]
      },
      display: {
        img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
        specs: [
          { label: "Panel Tech", value: "3.2K OLED / 1600-nit Mini-LED" },
          { label: "Refresh Rate", value: "120Hz – 240Hz ProMotion" },
          { label: "Color Gamut", value: "100% DCI-P3 & AdobeRGB" },
          { label: "Contrast Ratio", value: "1,000,000 : 1 Infinite Black" }
        ]
      }
    };

    heroPillButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        heroPillButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const target = btn.getAttribute("data-hero-target");
        const data = heroSpecsData[target] || heroSpecsData.performance;

        if (heroDeviceImg) {
          heroDeviceImg.style.opacity = "0.4";
          setTimeout(() => {
            heroDeviceImg.src = data.img;
            heroDeviceImg.style.opacity = "1";
          }, 150);
        }

        let specsHtml = "";
        data.specs.forEach((s) => {
          specsHtml += `
            <div class="hero-spec-metric">
              <div class="hero-spec-metric-label">${s.label}</div>
              <div class="hero-spec-metric-val">${s.value}</div>
            </div>
          `;
        });
        heroSpecGrid.innerHTML = specsHtml;
      });
    });
  }

  // Quick Spec Explorer Tabs on index.html
  const specExplorerTabs = document.querySelectorAll(".spec-tab-btn");
  const specExplorerContent = document.getElementById("specExplorerContent");

  if (specExplorerTabs.length > 0 && specExplorerContent) {
    const specExplanations = {
      cpu: {
        title: "Processor (CPU)",
        desc: "The brain of your machine. Higher core counts and modern architecture (Intel Core Ultra, AMD Ryzen 8000, Apple M3, Qualcomm Snapdragon X) enable instant app launching, smooth multitasking, and lightning-fast code compiling."
      },
      gpu: {
        title: "Graphics (GPU)",
        desc: "Dedicated GPUs (NVIDIA RTX 40-series) accelerate 3D rendering, video encoding, game frame rates, and local AI image generation, while modern integrated Arc/Radeon GPUs sip battery."
      },
      ram: {
        title: "Memory (RAM)",
        desc: "RAM allows multiple applications to run concurrently without slowdowns. 16GB is the modern sweet spot; 32GB to 64GB is recommended for developers, video editors, and power users."
      },
      storage: {
        title: "NVMe SSD Storage",
        desc: "High-speed PCIe Gen 4 SSDs load your operating system in seconds and transfer multi-gigabyte 4K media files in moments. 512GB to 1TB is ideal for long-term usage."
      },
      display: {
        title: "Display Panels & Refresh Rate",
        desc: "OLED displays offer pure blacks and vibrant colors; Mini-LED delivers extreme brightness for daylight work; IPS offers comfortable matte productivity. 120Hz+ creates butter-smooth cursor motion."
      },
      battery: {
        title: "Battery Longevity & Watt-Hours",
        desc: "Measured in Watt-Hours (Wh) and silicon efficiency. 3nm ARM and Core Ultra processors offer 14–20 hours of true unplugged productivity on a single charge."
      }
    };

    specExplorerTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        specExplorerTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const key = tab.getAttribute("data-spec-tab");
        const info = specExplanations[key] || specExplanations.cpu;

        specExplorerContent.innerHTML = `
          <div style="background: var(--bg-secondary); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.75rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <h3 style="font-size: 1.25rem; color: var(--text-primary);">${info.title}</h3>
              <button class="spec-help-trigger" data-spec-explainer="${key}">
                <span>Deep dive</span> <i data-lucide="arrow-up-right" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
            <p style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.6;">${info.desc}</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      });
    });
  }
});
