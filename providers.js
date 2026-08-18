/* =========================================================
   NETASSET — PROVIDERS
   Provider page logic
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     CONFIG
  ======================================================= */

  const STORAGE_KEY = "netasset_providers";
  const ASSETS_STORAGE_KEY = "netasset_assets";

  const ITEMS_PER_PAGE = 8;

  let providers = [];
  let filteredProviders = [];

  let currentPage = 1;
  let currentDetailsProviderId = null;

  let toastTimer = null;

  /* =======================================================
     DOM ELEMENTS
  ======================================================= */

  const providerTableBody = document.getElementById("providerTableBody");

  const providerEmptyState = document.getElementById("providerEmptyState");

  const providerSearch = document.getElementById("providerSearch");

  const providerStatusFilter = document.getElementById("providerStatusFilter");

  const totalProviderCount = document.getElementById("totalProviderCount");

  const activeProviderCount = document.getElementById("activeProviderCount");

  const inactiveProviderCount = document.getElementById(
    "inactiveProviderCount",
  );

  const providerResultSummary = document.getElementById(
    "providerResultSummary",
  );

  const providerPaginationPages = document.getElementById(
    "providerPaginationPages",
  );

  const previousProviderPageButton = document.getElementById(
    "previousProviderPageButton",
  );

  const nextProviderPageButton = document.getElementById(
    "nextProviderPageButton",
  );

  const addProviderButton = document.getElementById("addProviderButton");

  /* =======================================================
     ADD / EDIT MODAL
  ======================================================= */

  const providerModal = document.getElementById("providerModal");

  const providerModalTitle = document.getElementById("providerModalTitle");

  const providerModalDescription = document.getElementById(
    "providerModalDescription",
  );

  const closeProviderModal = document.getElementById("closeProviderModal");

  const cancelProviderForm = document.getElementById("cancelProviderForm");

  const providerForm = document.getElementById("providerForm");

  const providerFormMode = document.getElementById("providerFormMode");

  const editingProviderId = document.getElementById("editingProviderId");

  const providerName = document.getElementById("providerName");

  const providerType = document.getElementById("providerType");

  const providerASN = document.getElementById("providerASN");

  const providerContact = document.getElementById("providerContact");

  const providerEmail = document.getElementById("providerEmail");

  const providerPhone = document.getElementById("providerPhone");

  const providerAddress = document.getElementById("providerAddress");

  const providerStatus = document.getElementById("providerStatus");

  const saveProviderButton = document.getElementById("saveProviderButton");

  /* =======================================================
     DETAILS MODAL
  ======================================================= */

  const providerDetailsModal = document.getElementById("providerDetailsModal");

  const closeProviderDetails = document.getElementById("closeProviderDetails");

  const closeProviderDetailsButton = document.getElementById(
    "closeProviderDetailsButton",
  );

  const editProviderFromDetails = document.getElementById(
    "editProviderFromDetails",
  );

  const detailsProviderName = document.getElementById("detailsProviderName");

  const detailsProviderType = document.getElementById("detailsProviderType");

  const detailsProviderASN = document.getElementById("detailsProviderASN");

  const detailsProviderContact = document.getElementById(
    "detailsProviderContact",
  );

  const detailsProviderEmail = document.getElementById("detailsProviderEmail");

  const detailsProviderPhone = document.getElementById("detailsProviderPhone");

  const detailsProviderAddress = document.getElementById(
    "detailsProviderAddress",
  );

  const detailsProviderStatus = document.getElementById(
    "detailsProviderStatus",
  );

  /* =======================================================
     TOAST
  ======================================================= */

  const providerToast = document.getElementById("providerToast");

  /* =======================================================
     PROVIDER TYPES
     
     Taken from the provider form.
  ======================================================= */

  const PROVIDER_TYPES = ["ISP", "NAP", "Vendor", "Datacenter", "Cloud"];

  /* =======================================================
     DEFAULT PROVIDER DATA
  ======================================================= */

  const defaultProviders = [
    {
      id: "PRV-0001",
      name: "PT Telkom Indonesia",
      type: "ISP",
      asn: "AS7713",
      contact: "Network Operations",
      email: "noc@telkom.co.id",
      phone: "+62 21 5215109",
      address: "Jakarta, Indonesia",
      status: "active",
    },

    {
      id: "PRV-0002",
      name: "PT Indosat Tbk",
      type: "ISP",
      asn: "AS4761",
      contact: "Network Operations Center",
      email: "noc@indosat.com",
      phone: "+62 21 30003001",
      address: "Jakarta, Indonesia",
      status: "active",
    },

    {
      id: "PRV-0003",
      name: "PT XL Axiata Tbk",
      type: "ISP",
      asn: "AS24203",
      contact: "Network Operations",
      email: "noc@xl.co.id",
      phone: "+62 21 5761881",
      address: "Jakarta, Indonesia",
      status: "active",
    },

    {
      id: "PRV-0004",
      name: "PT Lintasarta",
      type: "NAP",
      asn: "AS4800",
      contact: "Technical Support",
      email: "support@lintasarta.co.id",
      phone: "+62 21 2302345",
      address: "Jakarta, Indonesia",
      status: "active",
    },

    {
      id: "PRV-0005",
      name: "PT Biznet Networks",
      type: "ISP",
      asn: "AS17451",
      contact: "Network Support",
      email: "support@biznetnetworks.com",
      phone: "+62 21 57998888",
      address: "Jakarta, Indonesia",
      status: "active",
    },

    {
      id: "PRV-0006",
      name: "PT Cyberindo Aditama",
      type: "ISP",
      asn: "AS23693",
      contact: "NOC",
      email: "noc@cbn.net.id",
      phone: "+62 21 29918888",
      address: "Jakarta, Indonesia",
      status: "active",
    },

    {
      id: "PRV-0007",
      name: "PT Data Center Indonesia",
      type: "Datacenter",
      asn: "",
      contact: "Facility Operations",
      email: "operations@datacenter.id",
      phone: "+62 21 5551234",
      address: "Jakarta, Indonesia",
      status: "active",
    },

    {
      id: "PRV-0008",
      name: "PT Example Cloud Indonesia",
      type: "Cloud",
      asn: "",
      contact: "Cloud Support",
      email: "support@examplecloud.id",
      phone: "+62 21 5555678",
      address: "Jakarta, Indonesia",
      status: "active",
    },

    {
      id: "PRV-0009",
      name: "PT Legacy Network",
      type: "Vendor",
      asn: "",
      contact: "Legacy Support",
      email: "support@legacy.example",
      phone: "+62 21 5559999",
      address: "Jakarta, Indonesia",
      status: "inactive",
    },

    {
      id: "PRV-0010",
      name: "PT Network Equipment Indonesia",
      type: "Vendor",
      asn: "",
      contact: "Technical Sales",
      email: "sales@networkequipment.id",
      phone: "+62 21 5558888",
      address: "Jakarta, Indonesia",
      status: "active",
    },
  ];

  /* =======================================================
     INITIALIZE
  ======================================================= */

  initializeProviders();

  /* =======================================================
     INITIALIZE PROVIDERS
  ======================================================= */

  function initializeProviders() {
    const storedProviders = localStorage.getItem(STORAGE_KEY);

    if (storedProviders) {
      try {
        providers = JSON.parse(storedProviders);

        if (!Array.isArray(providers)) {
          providers = [...defaultProviders];
        }
      } catch (error) {
        console.warn("NETASSET: Failed to load provider data.", error);

        providers = [...defaultProviders];
      }
    } else {
      providers = [...defaultProviders];

      saveProviders();
    }

    updateSummary();

    applyFilters();
  }

  /* =======================================================
     SAVE PROVIDERS
  ======================================================= */

  function saveProviders() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(providers));
  }

  /* =======================================================
     APPLY FILTERS
  ======================================================= */

  function applyFilters() {
    const searchValue = providerSearch.value.trim().toLowerCase();

    const statusValue = providerStatusFilter.value;

    filteredProviders = providers.filter((provider) => {
      const searchableText = [
        provider.name,
        provider.type,
        provider.asn,
        provider.contact,
        provider.email,
        provider.phone,
        provider.address,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue || searchableText.includes(searchValue);

      const matchesStatus =
        statusValue === "all" || provider.status === statusValue;

      return matchesSearch && matchesStatus;
    });

    const totalPages = getTotalPages();

    if (currentPage > totalPages) {
      currentPage = Math.max(totalPages, 1);
    }

    renderProviders();

    renderPagination();

    updateResultSummary();
  }

  /* =======================================================
     RENDER PROVIDERS
  ======================================================= */

  function renderProviders() {
    providerTableBody.innerHTML = "";

    if (filteredProviders.length === 0) {
      providerEmptyState.hidden = false;

      providerTableBody.style.display = "none";

      return;
    }

    providerEmptyState.hidden = true;

    providerTableBody.style.display = "";

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    const pageProviders = filteredProviders.slice(startIndex, endIndex);

    pageProviders.forEach((provider) => {
      const row = document.createElement("tr");

      const asn = provider.asn || "—";

      const contact = provider.contact || "—";

      const email = provider.email || "No email";

      row.innerHTML = `
          <td>

            <div class="provider-identity">

              <div class="provider-avatar">
                ${getProviderInitials(provider.name)}
              </div>

              <div class="provider-identity-copy">

                <span class="provider-name">
                  ${escapeHtml(provider.name)}
                </span>

                <span class="provider-contact-secondary">
                  ${escapeHtml(provider.phone || "No phone")}
                </span>

              </div>

            </div>

          </td>

          <td>

            <span class="provider-type-badge">
              ${escapeHtml(provider.type)}
            </span>

          </td>

          <td>

            <span class="provider-asn">
              ${escapeHtml(asn)}
            </span>

          </td>

          <td>

            <div class="provider-contact">

              <span class="provider-contact-name">
                ${escapeHtml(contact)}
              </span>

              <span class="provider-contact-email">
                ${escapeHtml(email)}
              </span>

            </div>

          </td>

          <td>
            ${renderStatusBadge(provider.status)}
          </td>

          <td class="provider-actions-cell">

            <div class="provider-row-actions">

              <button
                type="button"
                class="provider-row-action"
                data-action="view"
                data-id="${provider.id}"
                title="View provider"
                aria-label="View ${escapeHtml(provider.name)}"
              >
                👁
              </button>

              <button
                type="button"
                class="provider-row-action"
                data-action="edit"
                data-id="${provider.id}"
                title="Edit provider"
                aria-label="Edit ${escapeHtml(provider.name)}"
              >
                ✎
              </button>

              <button
                type="button"
                class="provider-row-action provider-row-action-danger"
                data-action="delete"
                data-id="${provider.id}"
                title="Delete provider"
                aria-label="Delete ${escapeHtml(provider.name)}"
              >
                ×
              </button>

            </div>

          </td>
        `;

      providerTableBody.appendChild(row);
    });
  }

  /* =======================================================
     SUMMARY
  ======================================================= */

  function updateSummary() {
    const total = providers.length;

    const active = providers.filter(
      (provider) => provider.status === "active",
    ).length;

    const inactive = providers.filter(
      (provider) => provider.status === "inactive",
    ).length;

    totalProviderCount.textContent = total;

    activeProviderCount.textContent = active;

    inactiveProviderCount.textContent = inactive;
  }

  /* =======================================================
     RESULT SUMMARY
  ======================================================= */

  function updateResultSummary() {
    if (filteredProviders.length === 0) {
      providerResultSummary.textContent = "Showing 0 of 0 providers";

      return;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;

    const end = Math.min(
      currentPage * ITEMS_PER_PAGE,
      filteredProviders.length,
    );

    providerResultSummary.textContent = `Showing ${start}–${end} of ${filteredProviders.length} providers`;
  }

  /* =======================================================
     PAGINATION
  ======================================================= */

  function getTotalPages() {
    return Math.ceil(filteredProviders.length / ITEMS_PER_PAGE);
  }

  function renderPagination() {
    providerPaginationPages.innerHTML = "";

    const totalPages = getTotalPages();

    previousProviderPageButton.disabled = currentPage <= 1;

    nextProviderPageButton.disabled = currentPage >= totalPages;

    if (totalPages <= 1) {
      return;
    }

    for (let page = 1; page <= totalPages; page++) {
      const button = document.createElement("button");

      button.type = "button";

      button.className = "pagination-page";

      button.textContent = page;

      if (page === currentPage) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        currentPage = page;

        renderProviders();

        renderPagination();

        updateResultSummary();
      });

      providerPaginationPages.appendChild(button);
    }
  }

  previousProviderPageButton.addEventListener("click", () => {
    if (currentPage <= 1) {
      return;
    }

    currentPage--;

    renderProviders();

    renderPagination();

    updateResultSummary();
  });

  nextProviderPageButton.addEventListener("click", () => {
    const totalPages = getTotalPages();

    if (currentPage >= totalPages) {
      return;
    }

    currentPage++;

    renderProviders();

    renderPagination();

    updateResultSummary();
  });

  /* =======================================================
     SEARCH
  ======================================================= */

  providerSearch.addEventListener("input", () => {
    currentPage = 1;

    applyFilters();
  });

  /* =======================================================
     STATUS FILTER
  ======================================================= */

  providerStatusFilter.addEventListener("change", () => {
    currentPage = 1;

    applyFilters();

    updateSummaryChipState(providerStatusFilter.value);
  });

  /* =======================================================
     SUMMARY FILTER CHIPS
  ======================================================= */

  document.querySelectorAll(".provider-summary-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const filterType = chip.dataset.filterType;

      providerStatusFilter.value = filterType;

      currentPage = 1;

      applyFilters();

      updateSummaryChipState(filterType);
    });
  });

  function updateSummaryChipState(selectedType) {
    document.querySelectorAll(".provider-summary-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.filterType === selectedType);
    });
  }

  /* =======================================================
     TABLE ACTIONS
  ======================================================= */

  providerTableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    const id = button.dataset.id;

    if (action === "view") {
      openProviderDetails(id);
    } else if (action === "edit") {
      openEditProvider(id);
    } else if (action === "delete") {
      deleteProvider(id);
    }
  });

  /* =======================================================
     OPEN ADD PROVIDER
  ======================================================= */

  addProviderButton.addEventListener("click", openAddProvider);

  function openAddProvider() {
    resetProviderForm();

    providerFormMode.value = "add";

    editingProviderId.value = "";

    providerModalTitle.textContent = "Add Provider";

    providerModalDescription.textContent = "Create a new provider record.";

    saveProviderButton.textContent = "Save Provider";

    if (typeof providerModal.showModal === "function") {
      providerModal.showModal();
    } else {
      providerModal.setAttribute("open", "");
    }

    setTimeout(() => {
      providerName.focus();
    }, 50);
  }

  /* =======================================================
     OPEN EDIT PROVIDER
  ======================================================= */

  function openEditProvider(id) {
    const provider = providers.find((item) => item.id === id);

    if (!provider) {
      showToast("Provider data could not be found.", "error");

      return;
    }

    providerFormMode.value = "edit";

    editingProviderId.value = provider.id;

    providerName.value = provider.name;

    providerType.value = provider.type;

    providerASN.value = provider.asn || "";

    providerContact.value = provider.contact || "";

    providerEmail.value = provider.email || "";

    providerPhone.value = provider.phone || "";

    providerAddress.value = provider.address || "";

    providerStatus.value = provider.status;

    providerModalTitle.textContent = "Edit Provider";

    providerModalDescription.textContent =
      "Update the selected provider record.";

    saveProviderButton.textContent = "Save Changes";

    if (typeof providerModal.showModal === "function") {
      providerModal.showModal();
    } else {
      providerModal.setAttribute("open", "");
    }
  }

  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  providerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = getProviderFormData();

    if (!validateProviderForm(formData)) {
      return;
    }

    if (providerFormMode.value === "add") {
      createProvider(formData);
    } else {
      updateProvider(formData);
    }
  });

  /* =======================================================
     GET FORM DATA
  ======================================================= */

  function getProviderFormData() {
    return {
      name: providerName.value.trim(),

      type: providerType.value.trim(),

      asn: providerASN.value.trim(),

      contact: providerContact.value.trim(),

      email: providerEmail.value.trim(),

      phone: providerPhone.value.trim(),

      address: providerAddress.value.trim(),

      status: providerStatus.value,
    };
  }

  /* =======================================================
     VALIDATE PROVIDER FORM
  ======================================================= */

  function validateProviderForm(formData) {
    if (!formData.name) {
      showToast("Provider name is required.", "error");

      providerName.focus();

      return false;
    }

    if (!formData.type) {
      showToast("Provider type is required.", "error");

      providerType.focus();

      return false;
    }

    if (!PROVIDER_TYPES.includes(formData.type)) {
      showToast("Invalid provider type.", "error");

      providerType.focus();

      return false;
    }

    /*
      Provider name must be unique.
    */

    const currentId = editingProviderId.value;

    const duplicateName = providers.some(
      (provider) =>
        provider.name.toLowerCase() === formData.name.toLowerCase() &&
        provider.id !== currentId,
    );

    if (duplicateName) {
      showToast("Provider name already exists.", "error");

      providerName.focus();

      return false;
    }

    /*
      ASN is optional according to
      the provided provider form.

      If filled, validate AS<number>.
    */

    if (formData.asn && !/^AS\d+$/i.test(formData.asn)) {
      showToast(
        "ASN must use the format AS followed by numbers, for example AS7713.",
        "error",
      );

      providerASN.focus();

      return false;
    }

    /*
      ASN uniqueness.
    */

    if (formData.asn) {
      const duplicateASN = providers.some(
        (provider) =>
          provider.asn &&
          provider.asn.toLowerCase() === formData.asn.toLowerCase() &&
          provider.id !== currentId,
      );

      if (duplicateASN) {
        showToast("ASN is already registered to another provider.", "error");

        providerASN.focus();

        return false;
      }
    }

    /*
      Email validation.
    */

    if (formData.email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(formData.email)) {
        showToast("Please enter a valid email address.", "error");

        providerEmail.focus();

        return false;
      }
    }

    return true;
  }

  /* =======================================================
     CREATE PROVIDER
  ======================================================= */

  function createProvider(formData) {
    const newProvider = {
      id: generateProviderId(),

      name: formData.name,

      type: formData.type,

      asn: normalizeASN(formData.asn),

      contact: formData.contact,

      email: formData.email,

      phone: formData.phone,

      address: formData.address,

      status: formData.status,
    };

    providers.unshift(newProvider);

    saveProviders();

    updateSummary();

    currentPage = 1;

    applyFilters();

    closeProviderForm();

    showToast(`${newProvider.name} has been added successfully.`, "success");
  }

  /* =======================================================
     UPDATE PROVIDER
  ======================================================= */

  function updateProvider(formData) {
    const index = providers.findIndex(
      (provider) => provider.id === editingProviderId.value,
    );

    if (index === -1) {
      showToast("Provider could not be found.", "error");

      return;
    }

    const originalProvider = providers[index];

    providers[index] = {
      ...originalProvider,

      name: formData.name,

      type: formData.type,

      asn: normalizeASN(formData.asn),

      contact: formData.contact,

      email: formData.email,

      phone: formData.phone,

      address: formData.address,

      status: formData.status,
    };

    saveProviders();

    updateSummary();

    applyFilters();

    closeProviderForm();

    showToast(
      `${providers[index].name} has been updated successfully.`,
      "success",
    );
  }

  /* =======================================================
     DELETE PROVIDER
  ======================================================= */

  function deleteProvider(id) {
    const provider = providers.find((item) => item.id === id);

    if (!provider) {
      return;
    }

    /*
      First check whether the provider
      is referenced by assets.
    */

    const dependencyCount = getProviderDependencyCount(provider);

    if (dependencyCount > 0) {
      window.alert(
        `This provider cannot be deleted.\n\n` +
          `${provider.name} is currently referenced by ` +
          `${dependencyCount} ${
            dependencyCount === 1 ? "asset" : "assets"
          }.\n\n` +
          `Set the provider to Inactive instead if it is no longer used.`,
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete provider "${provider.name}"?\n\n` +
        `This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    providers = providers.filter((item) => item.id !== id);

    saveProviders();

    updateSummary();

    applyFilters();

    showToast(`${provider.name} has been deleted.`, "success");
  }

  /* =======================================================
     PROVIDER DEPENDENCY CHECK
  ======================================================= */

  function getProviderDependencyCount(provider) {
    const storedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);

    if (!storedAssets) {
      return 0;
    }

    try {
      const assets = JSON.parse(storedAssets);

      if (!Array.isArray(assets)) {
        return 0;
      }

      return assets.filter((asset) => {
        const assetProvider =
          asset.provider ?? asset.provider_id ?? asset.providerId ?? "";

        return (
          String(assetProvider).toLowerCase() ===
            String(provider.id).toLowerCase() ||
          String(assetProvider).toLowerCase() ===
            String(provider.name).toLowerCase()
        );
      }).length;
    } catch (error) {
      console.warn("NETASSET: Unable to check provider dependencies.", error);

      return 0;
    }
  }

  /* =======================================================
     RESET FORM
  ======================================================= */

  function resetProviderForm() {
    providerForm.reset();

    providerFormMode.value = "add";

    editingProviderId.value = "";

    providerStatus.value = "active";
  }

  /* =======================================================
     CLOSE PROVIDER FORM
  ======================================================= */

  closeProviderModal.addEventListener("click", closeProviderForm);

  cancelProviderForm.addEventListener("click", closeProviderForm);

  function closeProviderForm() {
    if (typeof providerModal.close === "function") {
      providerModal.close();
    } else {
      providerModal.removeAttribute("open");
    }

    resetProviderForm();
  }

  /* =======================================================
     FORM MODAL BACKDROP
  ======================================================= */

  providerModal.addEventListener("click", (event) => {
    if (event.target === providerModal) {
      closeProviderForm();
    }
  });

  /* =======================================================
     OPEN PROVIDER DETAILS
  ======================================================= */

  function openProviderDetails(id) {
    const provider = providers.find((item) => item.id === id);

    if (!provider) {
      showToast("Provider data could not be found.", "error");

      return;
    }

    currentDetailsProviderId = provider.id;

    detailsProviderName.textContent = provider.name || "—";

    detailsProviderType.textContent = provider.type || "—";

    detailsProviderASN.textContent = provider.asn || "—";

    detailsProviderContact.textContent = provider.contact || "—";

    detailsProviderEmail.textContent = provider.email || "—";

    detailsProviderPhone.textContent = provider.phone || "—";

    detailsProviderAddress.textContent = provider.address || "—";

    renderDetailsStatus(provider.status);

    if (typeof providerDetailsModal.showModal === "function") {
      providerDetailsModal.showModal();
    } else {
      providerDetailsModal.setAttribute("open", "");
    }
  }

  /* =======================================================
     DETAILS STATUS
  ======================================================= */

  function renderDetailsStatus(status) {
    detailsProviderStatus.className = "provider-status-badge";

    detailsProviderStatus.classList.add(
      status === "active"
        ? "provider-status-active"
        : "provider-status-inactive",
    );

    detailsProviderStatus.innerHTML = `
      <i class="provider-status-dot"></i>
      ${status === "active" ? "Active" : "Inactive"}
    `;
  }

  /* =======================================================
     CLOSE DETAILS
  ======================================================= */

  closeProviderDetails.addEventListener("click", closeDetailsModal);

  closeProviderDetailsButton.addEventListener("click", closeDetailsModal);

  function closeDetailsModal() {
    if (typeof providerDetailsModal.close === "function") {
      providerDetailsModal.close();
    } else {
      providerDetailsModal.removeAttribute("open");
    }

    currentDetailsProviderId = null;
  }

  /* =======================================================
     DETAILS → EDIT
  ======================================================= */

  editProviderFromDetails.addEventListener("click", () => {
    if (!currentDetailsProviderId) {
      return;
    }

    const id = currentDetailsProviderId;

    closeDetailsModal();

    openEditProvider(id);
  });

  /* =======================================================
     DETAILS BACKDROP
  ======================================================= */

  providerDetailsModal.addEventListener("click", (event) => {
    if (event.target === providerDetailsModal) {
      closeDetailsModal();
    }
  });

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (providerModal.open) {
      closeProviderForm();
    } else if (providerDetailsModal.open) {
      closeDetailsModal();
    }
  });

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  function renderStatusBadge(status) {
    const label = status === "active" ? "Active" : "Inactive";

    const statusClass =
      status === "active"
        ? "provider-status-active"
        : "provider-status-inactive";

    return `
      <span class="provider-status-badge ${statusClass}">
        <i class="provider-status-dot"></i>
        ${label}
      </span>
    `;
  }

  /* =======================================================
     PROVIDER INITIALS
  ======================================================= */

  function getProviderInitials(name) {
    if (!name) {
      return "PV";
    }

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  /* =======================================================
     GENERATE PROVIDER ID
  ======================================================= */

  function generateProviderId() {
    let highestNumber = 0;

    providers.forEach((provider) => {
      const match = provider.id.match(/^PRV-(\d+)$/);

      if (match) {
        const number = Number(match[1]);

        if (number > highestNumber) {
          highestNumber = number;
        }
      }
    });

    return "PRV-" + String(highestNumber + 1).padStart(4, "0");
  }

  /* =======================================================
     NORMALIZE ASN
  ======================================================= */

  function normalizeASN(value) {
    if (!value) {
      return "";
    }

    const normalized = value.trim().toUpperCase();

    if (normalized.startsWith("AS")) {
      return normalized;
    }

    return `AS${normalized}`;
  }

  /* =======================================================
     HTML ESCAPE
  ======================================================= */

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =======================================================
     TOAST
  ======================================================= */

  function showToast(message, type = "success") {
    clearTimeout(toastTimer);

    providerToast.hidden = false;

    providerToast.textContent = message;

    providerToast.className = "provider-toast";

    if (type === "error") {
      providerToast.classList.add("provider-toast-error");
    } else if (type === "info") {
      providerToast.classList.add("provider-toast-info");
    }

    toastTimer = setTimeout(() => {
      providerToast.hidden = true;
    }, 3000);
  }

  /* =======================================================
     DEVELOPMENT HELPERS
     
     Browser console:

       netassetProviders.getProviders()

       netassetProviders.reset()

       netassetProviders.clear()
  ======================================================= */

  window.netassetProviders = {
    getProviders() {
      return [...providers];
    },

    reset() {
      providers = [...defaultProviders];

      saveProviders();

      currentPage = 1;

      updateSummary();

      applyFilters();

      showToast("Provider data has been reset.", "info");
    },

    clear() {
      providers = [];

      saveProviders();

      currentPage = 1;

      updateSummary();

      applyFilters();

      showToast("All provider data has been cleared.", "info");
    },
  };
});
