/**
 * NOVA LAPTOPS - Interactive Laptop Finder Engine
 * 6-Step intelligent questionnaire with multi-attribute scoring & match breakdown
 */

(function () {
  let currentStep = 1;
  const totalSteps = 6;

  const userAnswers = {
    useCase: "Programming",
    performance: "High Performance",
    portability: "Very Important",
    display: "OLED",
    size: "14\"",
    budget: 2000
  };

  const stepQuestions = [
    {
      step: 1,
      key: "useCase",
      title: "What will you primarily use your laptop for?",
      subtitle: "Select the workflow that matches your core daily requirements.",
      options: [
        { label: "Study & Academics", val: "Student", icon: "graduation-cap", desc: "Notes, lectures, browser research, battery longevity." },
        { label: "Office & Productivity", val: "Work", icon: "briefcase", desc: "Excel, Slack, CRM, Zoom meetings, multitasking." },
        { label: "Programming & DevOps", val: "Developer", icon: "code-2", desc: "Heavy IDEs, Docker, local LLMs, terminal workflows." },
        { label: "Design & Creative", val: "Creator", icon: "palette", desc: "Figma, Photoshop, Illustrator, high color accuracy." },
        { label: "Video Editing & 3D", val: "Creator", icon: "video", desc: "Premiere, DaVinci, Blender, 4K/8K rendering." },
        { label: "Gaming & Esports", val: "Gaming", icon: "gamepad-2", desc: "High refresh rate, discrete RTX GPU, unthrottled TGP." },
        { label: "Business & Management", val: "Business", icon: "shield-check", desc: "Executive travel, enterprise security, premium build." },
        { label: "Travel & Remote Work", val: "Travel", icon: "plane", desc: "Under 1.3kg featherweight chassis, 15h+ battery." }
      ]
    },
    {
      step: 2,
      key: "performance",
      title: "What level of performance do you need?",
      subtitle: "How intensive will your software stack and tasks be?",
      options: [
        { label: "Basic", val: "Basic", icon: "zap-off", desc: "Web browsing, document editing, media streaming." },
        { label: "Balanced", val: "Balanced", icon: "zap", desc: "Fluid multitasking, light creative work, office suites." },
        { label: "High Performance", val: "High Performance", icon: "cpu", desc: "Multi-threaded compiling, 4K video, local AI models." },
        { label: "Extreme Power", val: "Extreme", icon: "flame", desc: "Maximum 175W RTX graphics, desktop replacement power." }
      ]
    },
    {
      step: 3,
      key: "portability",
      title: "How important is weight and battery life?",
      subtitle: "Do you work on the move or mostly plugged in at a desk?",
      options: [
        { label: "Very Important", val: "Very Important", icon: "feather", desc: "Ultra-lightweight (<1.4kg), all-day unplugged endurance." },
        { label: "Important", val: "Important", icon: "scale", desc: "Balanced weight (1.4-1.9kg) for daily commuting." },
        { label: "Not Important", val: "Not Important", icon: "monitor", desc: "Desk-bound workstation power, weight is secondary." }
      ]
    },
    {
      step: 4,
      key: "display",
      title: "What are your display preferences?",
      subtitle: "Choose the visual technology that best fits your eyes and environment.",
      options: [
        { label: "OLED Panel", val: "OLED", icon: "sparkles", desc: "Pure blacks, infinite contrast, 0.2ms pixel response." },
        { label: "Mini-LED XDR", val: "Mini-LED", icon: "sun", desc: "Blinding 1600-nit HDR brightness, daylight legibility." },
        { label: "Anti-Glare IPS", val: "IPS", icon: "eye", desc: "Proven matte ergonomics, consistent color, glare-free." }
      ]
    },
    {
      step: 5,
      key: "size",
      title: "What screen size do you prefer?",
      subtitle: "Balance between screen canvas workspace and backpack footprint.",
      options: [
        { label: "13\" – 14\" Compact", val: "14\"", icon: "smartphone", desc: "Fits any bag, airplane trays, ultra-portable." },
        { label: "15\" Standard", val: "15\"", icon: "laptop", desc: "The balanced standard for work and media." },
        { label: "16\" Professional", val: "16\"", icon: "maximize", desc: "Expansive creative canvas, full cooling chamber." },
        { label: "17\"+ Desktop Sized", val: "17\"+", icon: "tv", desc: "Maximum visual real estate with full numpad." }
      ]
    },
    {
      step: 6,
      key: "budget",
      title: "What is your target budget ceiling?",
      subtitle: "Move the slider to configure your target investment.",
      isSlider: true
    }
  ];

  function initFinder() {
    const wizardWrap = document.getElementById("finderWizardWrap");
    if (!wizardWrap) return; // Not on laptop-finder.html

    renderCurrentStep();
  }

  function renderCurrentStep() {
    const wizardWrap = document.getElementById("finderWizardWrap");
    const resultsWrap = document.getElementById("finderResultsWrap");
    if (!wizardWrap) return;

    if (currentStep > totalSteps) {
      wizardWrap.style.display = "none";
      if (resultsWrap) {
        resultsWrap.style.display = "block";
        renderResults();
      }
      return;
    }

    if (resultsWrap) resultsWrap.style.display = "none";
    wizardWrap.style.display = "block";

    const q = stepQuestions[currentStep - 1];
    const progressPercent = ((currentStep) / totalSteps) * 100;

    let optionsHtml = "";

    if (q.isSlider) {
      optionsHtml = `
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-medium); border-radius: var(--radius-xl); padding: 2.5rem; text-align: center;">
          <div style="font-size: 0.875rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 0.5rem;">Target Budget Range</div>
          <div id="budgetDisplayVal" style="font-family: var(--font-heading); font-size: 3rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 1.5rem;">
            Up to $${userAnswers.budget}
          </div>
          <input type="range" id="budgetRangeInput" min="700" max="3500" step="100" value="${userAnswers.budget}" style="width: 100%; max-width: 460px; height: 8px; accent-color: var(--accent-primary); cursor: pointer;">
          <div style="display: flex; justify-content: space-between; max-width: 460px; margin: 0.75rem auto 0; font-size: 0.8125rem; color: var(--text-muted);">
            <span>$700 (Budget Friendly)</span>
            <span>$2,000 (Sweet Spot)</span>
            <span>$3,500+ (Workstation)</span>
          </div>
        </div>
      `;
    } else {
      optionsHtml = `
        <div class="wizard-options-grid">
          ${q.options
            .map((opt) => {
              const isSelected = userAnswers[q.key] === opt.val;
              return `
                <div class="wizard-option-card ${isSelected ? "selected" : ""}" data-wizard-val="${opt.val}">
                  <div class="wizard-option-icon">
                    <i data-lucide="${opt.icon}" style="width: 22px; height: 22px;"></i>
                  </div>
                  <div class="wizard-option-title">${opt.label}</div>
                  <div class="wizard-option-desc">${opt.desc}</div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    }

    wizardWrap.innerHTML = `
      <div class="wizard-progress-bar-wrap">
        <div class="wizard-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>

      <div class="wizard-step-header">
        <div class="wizard-step-counter">Step ${currentStep} of ${totalSteps}</div>
        <h2 class="section-title" style="font-size: 1.85rem;">${q.title}</h2>
        <p class="section-subtitle" style="font-size: 1rem;">${q.subtitle}</p>
      </div>

      ${optionsHtml}

      <div class="wizard-controls-row">
        <button id="wizardBackBtn" class="btn btn-outline btn-sm" ${currentStep === 1 ? "disabled style='opacity: 0.4; pointer-events: none;'" : ""}>
          <i data-lucide="arrow-left" style="width: 16px; height: 16px;"></i> Back
        </button>
        <button id="wizardNextBtn" class="btn btn-primary">
          ${currentStep === totalSteps ? "Find My Matches" : "Next Step"} <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
        </button>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Event binding for step
    if (q.isSlider) {
      const budgetInput = document.getElementById("budgetRangeInput");
      const budgetDisplay = document.getElementById("budgetDisplayVal");
      budgetInput.addEventListener("input", (e) => {
        userAnswers.budget = parseInt(e.target.value);
        budgetDisplay.textContent = `Up to $${userAnswers.budget}`;
      });
    } else {
      wizardWrap.querySelectorAll(".wizard-option-card").forEach((card) => {
        card.addEventListener("click", () => {
          wizardWrap.querySelectorAll(".wizard-option-card").forEach((c) => c.classList.remove("selected"));
          card.classList.add("selected");
          userAnswers[q.key] = card.getAttribute("data-wizard-val");
        });
      });
    }

    const nextBtn = document.getElementById("wizardNextBtn");
    const backBtn = document.getElementById("wizardBackBtn");

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentStep++;
        renderCurrentStep();
        window.scrollTo({ top: 120, behavior: "smooth" });
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (currentStep > 1) {
          currentStep--;
          renderCurrentStep();
          window.scrollTo({ top: 120, behavior: "smooth" });
        }
      });
    }
  }

  function renderResults() {
    const resultsContainer = document.getElementById("finderResultsList");
    if (!resultsContainer) return;

    const laptops = typeof NOVA_LAPTOPS_DATA !== "undefined" ? NOVA_LAPTOPS_DATA : [];

    // Calculate score for each laptop based on user answers
    const scoredLaptops = laptops.map((lap) => {
      let score = 50;
      let reasons = [];

      // Use case match (Weight: +20)
      if (lap.useCases.includes(userAnswers.useCase)) {
        score += 20;
        reasons.push(`Engineered specifically for ${userAnswers.useCase} workflows`);
      }

      // Performance match (Weight: +15)
      if (lap.performanceLevel === userAnswers.performance) {
        score += 15;
        reasons.push(`Delivers your desired ${userAnswers.performance} computing power`);
      }

      // Portability match (Weight: +15)
      if (lap.portability === userAnswers.portability) {
        score += 15;
        reasons.push(`Weight profile (${lap.specs.weightKg.split("(")[0]}) aligns with your mobility needs`);
      }

      // Display match (Weight: +15)
      if (lap.displayType === userAnswers.display) {
        score += 15;
        reasons.push(`Features your preferred ${lap.displayType} panel technology`);
      }

      // Size match (Weight: +15)
      if (lap.screenSizeCategory === userAnswers.size) {
        score += 15;
        reasons.push(`${lap.screenSize}" form factor matches your desired canvas`);
      }

      // Budget match (Weight: +20 or penalty)
      if (lap.price <= userAnswers.budget) {
        score += 20;
        reasons.push(`Fits comfortably within your $${userAnswers.budget} budget`);
      } else if (lap.price <= userAnswers.budget + 250) {
        score += 5;
        reasons.push(`Slightly above target budget but offers workstation longevity`);
      } else {
        score -= 20;
      }

      // Clamp between 70 and 99
      const finalScore = Math.min(99, Math.max(72, score));
      return { laptop: lap, score: finalScore, reasons };
    });

    // Sort by match score descending
    scoredLaptops.sort((a, b) => b.score - a.score);
    const topMatches = scoredLaptops.slice(0, 4);

    let html = "";
    topMatches.forEach((match, index) => {
      const lap = match.laptop;
      const isSaved = window.novaBookmarks ? window.novaBookmarks.isLaptopSaved(lap.id) : false;
      const inCompare = window.novaCompare ? window.novaCompare.isLaptopInCompare(lap.id) : false;

      html += `
        <div class="match-result-card">
          <div class="match-score-badge">
            <i data-lucide="award" style="width: 16px; height: 16px;"></i> ${match.score}% Match
          </div>

          <div style="display: flex; flex-direction: column;">
            <img src="${lap.image}" alt="${lap.model}" style="width: 100%; aspect-ratio: 16/10; object-fit: cover; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); margin-bottom: 1rem;">
            <div style="text-align: center;">
              <span class="badge badge-blue">${lap.badge}</span>
              <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-top: 0.5rem;">$${lap.price}</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="font-size: 0.8125rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase;">${lap.brand}</div>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">${lap.model}</h3>
              <p style="font-size: 0.9375rem; color: var(--text-secondary); margin-bottom: 1rem;">${lap.tagline}</p>

              <div class="match-why-box">
                <strong style="display: block; font-size: 0.8125rem; text-transform: uppercase; color: var(--accent-primary); margin-bottom: 0.35rem;">Why this fits your priorities:</strong>
                <ul style="list-style: none; font-size: 0.8125rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 0.25rem;">
                  ${match.reasons.map((r) => `<li style="display: flex; align-items: center; gap: 0.4rem;"><i data-lucide="check" style="width: 14px; height: 14px; color: var(--emerald-accent);"></i> ${r}</li>`).join("")}
                </ul>
              </div>

              <div class="card-specs-matrix">
                <div class="spec-chip-item">
                  <span class="spec-chip-label">Processor</span>
                  <span class="spec-chip-value">${lap.specs.processor.split("(")[0]}</span>
                </div>
                <div class="spec-chip-item">
                  <span class="spec-chip-label">Memory</span>
                  <span class="spec-chip-value">${lap.specs.ramValue}GB Unified/DDR5</span>
                </div>
                <div class="spec-chip-item">
                  <span class="spec-chip-label">Display</span>
                  <span class="spec-chip-value">${lap.screenSize}" ${lap.displayType}</span>
                </div>
                <div class="spec-chip-item">
                  <span class="spec-chip-label">Battery</span>
                  <span class="spec-chip-value">${lap.specs.batteryLifeHours.split(" ")[2] || "All-Day"}</span>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem; flex-wrap: wrap;">
              <a href="laptop-details.html?id=${lap.id}" class="btn btn-primary">
                View Full Specs <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
              </a>
              <button class="btn btn-secondary btn-card-compare ${inCompare ? "active" : ""}" data-compare-btn="${lap.id}">
                <i data-lucide="${inCompare ? "check" : "scale"}" style="width: 16px; height: 16px;"></i>
                ${inCompare ? "In Compare" : "Compare"}
              </button>
              <button class="btn btn-outline" data-save-laptop-btn="${lap.id}">
                <i data-lucide="${isSaved ? "bookmark-check" : "bookmark"}" style="width: 16px; height: 16px;"></i>
                ${isSaved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      `;
    });

    resultsContainer.innerHTML = html;

    const restartBtn = document.getElementById("restartFinderBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        currentStep = 1;
        renderCurrentStep();
        window.scrollTo({ top: 120, behavior: "smooth" });
      });
    }

    if (window.lucide) window.lucide.createIcons();
    if (window.novaBookmarks) window.novaBookmarks.updateSaveButtonsUI();
    if (window.novaCompare) window.novaCompare.updateCompareButtonsUI();
  }

  document.addEventListener("DOMContentLoaded", initFinder);
})();
