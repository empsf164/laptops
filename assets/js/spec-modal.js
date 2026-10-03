/**
 * NOVA LAPTOPS - Specification Explainer Modal Engine
 * Interactive hardware definitions & buyer guidance modal
 */

(function () {
  function initSpecModal() {
    let modal = document.getElementById("specExplainerModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "specExplainerModal";
      modal.className = "modal-backdrop";
      modal.innerHTML = `
        <div class="modal-dialog spec-explainer-dialog">
          <div class="spec-explainer-header">
            <div>
              <div class="badge badge-blue" style="margin-bottom: 0.5rem;">Hardware Guide</div>
              <h3 id="specModalTitle" class="spec-explainer-title">Specification Term</h3>
            </div>
            <button id="closeSpecModalBtn" class="btn btn-icon btn-sm" style="color: var(--text-muted);">✕</button>
          </div>
          <div id="specModalBody">
            <!-- Dynamic Spec Content -->
          </div>
          <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end;">
            <button id="specModalDoneBtn" class="btn btn-primary btn-sm">Got it</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const titleEl = document.getElementById("specModalTitle");
    const bodyEl = document.getElementById("specModalBody");
    const closeBtn = document.getElementById("closeSpecModalBtn");
    const doneBtn = document.getElementById("specModalDoneBtn");

    function openSpec(termKey) {
      const explainers = typeof NOVA_SPEC_EXPLAINERS !== "undefined" ? NOVA_SPEC_EXPLAINERS : {};
      const data = explainers[termKey.toLowerCase()] || {
        term: termKey.toUpperCase(),
        shortSummary: "Detailed hardware specification and engineering overview.",
        whatItMeans: `The term ${termKey} represents a key architectural characteristic in modern laptop hardware.`,
        keyBenefits: ["Enhances overall system performance", "Optimized for modern workloads", "Improves power efficiency"],
        whoNeedsIt: "Users seeking reliable, forward-looking computing performance.",
        considerations: "Verify compatibility with your daily software stack."
      };

      titleEl.textContent = data.term;

      let benefitsHtml = "";
      if (data.keyBenefits && data.keyBenefits.length > 0) {
        benefitsHtml = data.keyBenefits
          .map((b) => `<li style="margin-bottom: 0.35rem; display: flex; align-items: flex-start; gap: 0.5rem;"><i data-lucide="check-circle" style="width: 16px; height: 16px; color: var(--emerald-accent); flex-shrink: 0; margin-top: 2px;"></i> <span>${b}</span></li>`)
          .join("");
      }

      bodyEl.innerHTML = `
        <p style="font-size: 1.0625rem; font-weight: 500; color: var(--text-primary); margin-bottom: 1.25rem; line-height: 1.5;">
          ${data.shortSummary}
        </p>

        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.8125rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 0.4rem;">What It Means</h4>
          <p style="font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.6;">${data.whatItMeans}</p>
        </div>

        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.8125rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.05em; margin-bottom: 0.5rem;">Key Benefits</h4>
          <ul style="list-style: none; font-size: 0.875rem; color: var(--text-secondary);">
            ${benefitsHtml}
          </ul>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
          <div style="background: var(--bg-tertiary); padding: 0.875rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--accent-primary); margin-bottom: 0.25rem;">Who Needs It</div>
            <div style="font-size: 0.8125rem; color: var(--text-secondary);">${data.whoNeedsIt}</div>
          </div>
          <div style="background: var(--bg-tertiary); padding: 0.875rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--amber-accent); margin-bottom: 0.25rem;">Watch Out For</div>
            <div style="font-size: 0.8125rem; color: var(--text-secondary);">${data.considerations}</div>
          </div>
        </div>
      `;

      modal.classList.add("open");
      if (window.lucide) window.lucide.createIcons();
    }

    function closeModal() {
      modal.classList.remove("open");
    }

    closeBtn.addEventListener("click", closeModal);
    doneBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.body.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-spec-explainer]");
      if (trigger) {
        e.preventDefault();
        e.stopPropagation();
        const term = trigger.getAttribute("data-spec-explainer");
        openSpec(term);
      }
    });

    window.novaSpecExplainer = {
      open: openSpec,
      close: closeModal
    };
  }

  document.addEventListener("DOMContentLoaded", initSpecModal);
})();
