/**
 * NOVA LAPTOPS - Product Details Page Engine
 * Powers laptop-details.html with dynamic data rendering, gallery switcher, tabs, and related alternatives
 */

(function () {
  function initProductDetails() {
    const detailsWrap = document.getElementById("laptopDetailsContainer");
    if (!detailsWrap) return; // Not on laptop-details.html

    const params = new URLSearchParams(window.location.search);
    const laptopId = params.get("id") || "macbook-pro-16-m3";

    const allLaptops = typeof NOVA_LAPTOPS_DATA !== "undefined" ? NOVA_LAPTOPS_DATA : [];
    const laptop = allLaptops.find((l) => l.id === laptopId) || allLaptops[0];

    document.title = `${laptop.brand} ${laptop.model} Specs & Analysis | NOVA LAPTOPS`;

    renderDetailsPage(laptop, allLaptops);
    bindDetailsEvents(laptop);
  }

  function renderDetailsPage(lap, allLaptops) {
    const detailsWrap = document.getElementById("laptopDetailsContainer");
    if (!detailsWrap) return;

    const isSaved = window.novaBookmarks ? window.novaBookmarks.isLaptopSaved(lap.id) : false;
    const inCompare = window.novaCompare ? window.novaCompare.isLaptopInCompare(lap.id) : false;

    // Related alternatives (same use case or price tier)
    const relatedLaptops = allLaptops.filter((l) => l.id !== lap.id && l.useCases.some((u) => lap.useCases.includes(u))).slice(0, 3);

    detailsWrap.innerHTML = `
      <!-- Breadcrumbs -->
      <nav style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 2rem;">
        <a href="index.html" style="color: var(--text-secondary);">Home</a>
        <span>/</span>
        <a href="laptops.html" style="color: var(--text-secondary);">Laptops</a>
        <span>/</span>
        <a href="laptops.html?brand=${encodeURIComponent(lap.brand)}" style="color: var(--text-secondary);">${lap.brand}</a>
        <span>/</span>
        <span style="color: var(--text-primary); font-weight: 600;">${lap.model}</span>
      </nav>

      <!-- Hero Showcase Grid -->
      <div class="details-hero-grid">
        <!-- Media Gallery -->
        <div>
          <div class="gallery-main-view">
            <img id="mainGalleryImg" src="${lap.image}" alt="${lap.model}" class="gallery-main-img">
          </div>
          <div class="gallery-thumb-strip">
            ${lap.gallery
              .map(
                (imgUrl, idx) => `
              <button class="gallery-thumb-btn ${idx === 0 ? "active" : ""}" data-gallery-src="${imgUrl}">
                <img src="${imgUrl}" alt="${lap.model} view ${idx + 1}">
              </button>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Specs & Primary Actions -->
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="badge badge-blue">${lap.brand}</span>
            <span class="badge badge-cyan">${lap.badge}</span>
            <span class="badge badge-neutral">${lap.displayType}</span>
          </div>

          <h1 style="font-size: clamp(2rem, 3.5vw, 2.75rem); margin-bottom: 0.75rem;">${lap.brand} ${lap.model}</h1>
          <p style="font-size: 1.125rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
            ${lap.tagline}
          </p>

          <div style="display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-subtle);">
            <div style="font-family: var(--font-heading); font-size: 2.25rem; font-weight: 700; color: var(--accent-primary);">$${lap.price}</div>
            <div style="font-size: 0.875rem; color: var(--text-muted);">Reference Base Config Price</div>
          </div>

          <!-- Key Hardware Highlights Grid -->
          <div class="key-specs-grid" style="margin: 1.5rem 0;">
            <div class="key-spec-box">
              <div class="label">Processor</div>
              <div class="value">${lap.specs.processor.split("(")[0]}</div>
            </div>
            <div class="key-spec-box">
              <div class="label">Graphics</div>
              <div class="value">${lap.specs.gpu}</div>
            </div>
            <div class="key-spec-box">
              <div class="label">Memory (RAM)</div>
              <div class="value">${lap.specs.ramValue}GB Unified/LPDDR5</div>
            </div>
            <div class="key-spec-box">
              <div class="label">Storage</div>
              <div class="value">${lap.specs.storageValue >= 1000 ? lap.specs.storageValue / 1000 + "TB" : lap.specs.storageValue + "GB"} SSD</div>
            </div>
            <div class="key-spec-box">
              <div class="label">Display Panel</div>
              <div class="value">
                <span class="spec-help-trigger" data-spec-explainer="${lap.displayType.toLowerCase()}">
                  ${lap.screenSize}" ${lap.displayType}
                </span>
              </div>
            </div>
            <div class="key-spec-box">
              <div class="label">Refresh Rate</div>
              <div class="value">${lap.specs.refreshRate}</div>
            </div>
            <div class="key-spec-box">
              <div class="label">Battery Life</div>
              <div class="value">${lap.specs.batteryLifeHours.split(" ")[2] || "Up to 18h"}</div>
            </div>
            <div class="key-spec-box">
              <div class="label">Chassis Weight</div>
              <div class="value">${lap.specs.weightKg.split("(")[0]}</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 2rem;">
            <button class="btn btn-primary btn-lg btn-card-compare ${inCompare ? "active" : ""}" data-compare-btn="${lap.id}" style="flex: 1;">
              <i data-lucide="${inCompare ? "check" : "scale"}" style="width: 18px; height: 18px;"></i>
              ${inCompare ? "In Active Comparison" : "Add to Comparison"}
            </button>
            <button class="btn btn-secondary btn-lg" data-save-laptop-btn="${lap.id}">
              <i data-lucide="${isSaved ? "bookmark-check" : "bookmark"}" style="width: 18px; height: 18px;"></i>
              ${isSaved ? "Saved to Shortlist" : "Save to Shortlist"}
            </button>
          </div>
        </div>
      </div>

      <!-- Deep Dive Tabs Section -->
      <div style="margin-top: 4.5rem; padding-top: 3rem; border-top: 1px solid var(--border-subtle);">
        <div class="tabs-nav">
          <button class="tab-btn active" data-tab-target="tabOverview">Overview & Verdict</button>
          <button class="tab-btn" data-tab-target="tabPerformance">Performance & Silicon</button>
          <button class="tab-btn" data-tab-target="tabDisplay">Display & Visuals</button>
          <button class="tab-btn" data-tab-target="tabDesign">Chassis & Ports</button>
          <button class="tab-btn" data-tab-target="tabBattery">Battery & Power</button>
          <button class="tab-btn" data-tab-target="tabFullSpecs">Full Technical Table</button>
        </div>

        <!-- Tab 1: Overview -->
        <div id="tabOverview" class="tab-content-panel active">
          <div class="details-overview-grid">
            <div>
              <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Nova Engineering Analysis</h3>
              <p style="font-size: 1rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">
                The ${lap.brand} ${lap.model} is engineered for users demanding uncompromising ${lap.performanceLevel.toLowerCase()} performance in a ${lap.portability.toLowerCase()} form factor. Powered by ${lap.specs.processor}, it handles rigorous workflows including ${lap.useCases.join(", ")}.
              </p>

              <div style="background: var(--bg-secondary); border: 1px solid var(--border-medium); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem;">
                <h4 style="font-size: 0.875rem; text-transform: uppercase; color: var(--accent-primary); letter-spacing: 0.05em; margin-bottom: 0.5rem;">Ideal Target User</h4>
                <p style="font-size: 0.9375rem; color: var(--text-primary); line-height: 1.6;">${lap.idealFor}</p>
              </div>
            </div>

            <!-- Pros and Cons -->
            <div>
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.25rem;">
                <h4 style="font-size: 0.875rem; text-transform: uppercase; color: var(--emerald-accent); letter-spacing: 0.05em; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                  <i data-lucide="thumbs-up" style="width: 16px; height: 16px;"></i> Key Strengths
                </h4>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                  ${lap.pros.map((p) => `<li style="display: flex; align-items: flex-start; gap: 0.5rem;"><i data-lucide="check" style="width: 14px; height: 14px; color: var(--emerald-accent); margin-top: 3px;"></i> <span>${p}</span></li>`).join("")}
                </ul>
              </div>

              <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem;">
                <h4 style="font-size: 0.875rem; text-transform: uppercase; color: var(--amber-accent); letter-spacing: 0.05em; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                  <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i> Considerations
                </h4>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary);">
                  ${lap.cons.map((c) => `<li style="display: flex; align-items: flex-start; gap: 0.5rem;"><i data-lucide="info" style="width: 14px; height: 14px; color: var(--amber-accent); margin-top: 3px;"></i> <span>${c}</span></li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Performance -->
        <div id="tabPerformance" class="tab-content-panel">
          <div class="grid grid-2">
            <div class="glass-panel" style="padding: 1.75rem;">
              <h4 style="font-size: 1.125rem; margin-bottom: 1rem;">CPU & Computing Architecture</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9375rem;">
                <div><span style="color: var(--text-muted);">Processor Model:</span> <strong>${lap.specs.processor}</strong></div>
                <div><span style="color: var(--text-muted);">Silicon Family:</span> <strong>${lap.specs.cpuFamily}</strong></div>
                <div><span style="color: var(--text-muted);">Core Layout:</span> <strong>${lap.specs.cpuCores}</strong></div>
              </div>
            </div>

            <div class="glass-panel" style="padding: 1.75rem;">
              <h4 style="font-size: 1.125rem; margin-bottom: 1rem;">Graphics & AI Processing</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9375rem;">
                <div><span style="color: var(--text-muted);">Graphics Processing Unit:</span> <strong>${lap.specs.gpu}</strong></div>
                <div><span style="color: var(--text-muted);">GPU Class:</span> <strong>${lap.specs.gpuClass}</strong></div>
                <div><span style="color: var(--text-muted);">AI Acceleration:</span> <strong>Integrated NPU / Neural Cores</strong></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Display -->
        <div id="tabDisplay" class="tab-content-panel">
          <div class="glass-panel" style="padding: 2rem;">
            <h4 style="font-size: 1.25rem; margin-bottom: 1.25rem;">Display Metrology</h4>
            <div class="details-spec-grid-3">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Panel Specification</div>
                <div style="font-weight: 700; margin-top: 0.25rem;">${lap.specs.display}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Refresh Rate</div>
                <div style="font-weight: 700; margin-top: 0.25rem;">${lap.specs.refreshRate}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Brightness & HDR</div>
                <div style="font-weight: 700; margin-top: 0.25rem;">${lap.specs.brightness}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Color Gamut</div>
                <div style="font-weight: 700; margin-top: 0.25rem;">${lap.specs.colorAccuracy}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 4: Design & Chassis -->
        <div id="tabDesign" class="tab-content-panel">
          <div class="glass-panel" style="padding: 2rem;">
            <h4 style="font-size: 1.25rem; margin-bottom: 1.25rem;">Materials & Physical I/O</h4>
            <div class="details-spec-grid-2">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Chassis Materials</div>
                <div style="font-weight: 700; margin-top: 0.25rem;">${lap.specs.materials}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Dimensions & Weight</div>
                <div style="font-weight: 700; margin-top: 0.25rem;">${lap.specs.dimensions} • ${lap.specs.weightKg}</div>
              </div>
            </div>
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Available Ports</div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${lap.specs.ports.map((p) => `<span class="badge badge-neutral" style="padding: 0.4rem 0.75rem; font-size: 0.8125rem;">${p}</span>`).join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 5: Battery -->
        <div id="tabBattery" class="tab-content-panel">
          <div class="glass-panel" style="padding: 2rem;">
            <h4 style="font-size: 1.25rem; margin-bottom: 1.25rem;">Power Delivery & Longevity</h4>
            <div class="details-spec-grid-3">
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Battery Pack</div>
                <div style="font-weight: 700; margin-top: 0.25rem;">${lap.specs.battery}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Tested Endurance</div>
                <div style="font-weight: 700; margin-top: 0.25rem;">${lap.specs.batteryLifeHours}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Included Adapter</div>
                <div style="font-weight: 700; margin-top: 0.25rem;">${lap.specs.charging}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 6: Full Raw Specs -->
        <div id="tabFullSpecs" class="tab-content-panel">
          <div class="compare-table-wrapper">
            <table class="compare-table">
              <tbody>
                <tr><td class="compare-sticky-col">Brand & Model</td><td><strong>${lap.brand} ${lap.model}</strong></td></tr>
                <tr><td class="compare-sticky-col">Price (MSRP)</td><td>$${lap.price}</td></tr>
                <tr><td class="compare-sticky-col">Processor</td><td>${lap.specs.processor}</td></tr>
                <tr><td class="compare-sticky-col">Graphics</td><td>${lap.specs.gpu}</td></tr>
                <tr><td class="compare-sticky-col">Memory</td><td>${lap.specs.ram}</td></tr>
                <tr><td class="compare-sticky-col">Storage</td><td>${lap.specs.storage}</td></tr>
                <tr><td class="compare-sticky-col">Display</td><td>${lap.specs.display} (${lap.specs.refreshRate}, ${lap.specs.brightness})</td></tr>
                <tr><td class="compare-sticky-col">Operating System</td><td>${lap.specs.os}</td></tr>
                <tr><td class="compare-sticky-col">Chassis & Weight</td><td>${lap.specs.materials} • ${lap.specs.weightKg}</td></tr>
                <tr><td class="compare-sticky-col">Battery & Power</td><td>${lap.specs.battery} (${lap.specs.charging})</td></tr>
                <tr><td class="compare-sticky-col">Ports & I/O</td><td>${lap.specs.ports.join(", ")}</td></tr>
                <tr><td class="compare-sticky-col">Wireless & Cam</td><td>${lap.specs.wireless} • ${lap.specs.webcam}</td></tr>
                <tr><td class="compare-sticky-col">Warranty</td><td>${lap.specs.warranty}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Related Alternatives Section -->
      <div style="margin-top: 5rem;">
        <div class="section-header">
          <div class="section-tag">Direct Alternatives</div>
          <h2 class="section-title">Similar Laptops to Consider</h2>
          <p class="section-subtitle">Compare these alternative machines in the same workflow category.</p>
        </div>

        <div class="grid grid-3">
          ${relatedLaptops
            .map((rel) => {
              const inCompRel = window.novaCompare ? window.novaCompare.isLaptopInCompare(rel.id) : false;
              return `
              <div class="laptop-card">
                <div class="laptop-card-media">
                  <img src="${rel.image}" alt="${rel.model}" class="laptop-card-img" loading="lazy">
                  <div class="laptop-card-badges">
                    <span class="badge badge-blue">${rel.badge}</span>
                  </div>
                </div>
                <div class="laptop-card-body">
                  <div class="laptop-card-brand-row">
                    <span class="laptop-card-brand">${rel.brand}</span>
                    <span class="laptop-card-price">$${rel.price}</span>
                  </div>
                  <h3 class="laptop-card-title"><a href="laptop-details.html?id=${rel.id}">${rel.model}</a></h3>
                  <div style="font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 1rem;">
                    ${rel.specs.processor.split("(")[0]} • ${rel.specs.ramValue}GB RAM • ${rel.displayType}
                  </div>
                  <div class="laptop-card-footer">
                    <button class="btn btn-secondary btn-card-compare ${inCompRel ? "active" : ""}" data-compare-btn="${rel.id}">
                      <i data-lucide="${inCompRel ? "check" : "scale"}" style="width: 14px; height: 14px;"></i> Compare
                    </button>
                    <a href="laptop-details.html?id=${rel.id}" class="btn btn-outline btn-sm">
                      Details <i data-lucide="arrow-right" style="width: 13px; height: 13px;"></i>
                    </a>
                  </div>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    if (window.novaBookmarks) window.novaBookmarks.updateSaveButtonsUI();
    if (window.novaCompare) window.novaCompare.updateCompareButtonsUI();
  }

  function bindDetailsEvents(lap) {
    // Gallery Thumb Click
    const mainImg = document.getElementById("mainGalleryImg");
    const thumbBtns = document.querySelectorAll(".gallery-thumb-btn");

    thumbBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        thumbBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const src = btn.getAttribute("data-gallery-src");
        if (mainImg) {
          mainImg.style.opacity = "0.4";
          setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = "1";
          }, 150);
        }
      });
    });

    // Tabs Switching
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-content-panel");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((b) => b.classList.remove("active"));
        tabPanels.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");
        const targetId = btn.getAttribute("data-tab-target");
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add("active");
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initProductDetails);
})();
