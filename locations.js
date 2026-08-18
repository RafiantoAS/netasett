/* =========================================================
   NETASSET — LOCATIONS
   locations.js

   Responsibilities:
   - Location data management
   - Search
   - Filters
   - Pagination
   - Statistics
   - Add / Edit / View / Delete
   - LocalStorage demo persistence
   - Toast notification
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
       CONFIGURATION
    ====================================================== */

  const STORAGE_KEY = "netasset_locations_demo";

  const PAGE_SIZE = 5;

  /* =====================================================
       DOM REFERENCES
    ====================================================== */

  const elements = {
    tableBody: document.getElementById("locationTableBody"),

    search: document.getElementById("locationSearch"),

    typeFilter: document.getElementById("locationTypeFilter"),

    parentFilter: document.getElementById("locationParentFilter"),

    totalLocations: document.getElementById("totalLocations"),

    popLocations: document.getElementById("popLocations"),

    dataCenterLocations: document.getElementById("dataCenterLocations"),

    childLocations: document.getElementById("childLocations"),

    resultCount: document.getElementById("locationResultCount"),

    emptyState: document.getElementById("locationEmptyState"),

    addButton: document.getElementById("addLocationButton"),

    refreshButton: document.getElementById("refreshLocations"),

    pagination: document.querySelector(".locations-pagination"),
  };

  /* =====================================================
       STATE
    ====================================================== */

  let locations = [];

  let currentPage = 1;

  /* =====================================================
       DEFAULT DEMO DATA
    ====================================================== */

  const defaultLocations = [
    {
      id: "LOC-JKT-001",
      name: "POP Jakarta",
      type: "POP",
      parent: "",
      coordinates: "-6.2088, 106.8456",
      address: "Jl. Gatot Subroto, Jakarta Selatan",
    },

    {
      id: "LOC-BKS-001",
      name: "DCI Cibitung",
      type: "Data Center",
      parent: "",
      coordinates: "-6.2447, 107.1364",
      address: "Jl. Industri Cibitung, Bekasi",
    },

    {
      id: "LOC-JKT-002",
      name: "Gedung Menara Sudirman",
      type: "Building",
      parent: "POP Jakarta",
      coordinates: "-6.2091, 106.8231",
      address: "Jl. Jend. Sudirman Kav. 60",
    },

    {
      id: "LOC-BKS-002",
      name: "Rack-01",
      type: "Rack",
      parent: "DCI Cibitung — Lt. 2",
      coordinates: "—",
      address: "Ruang server utama",
    },

    {
      id: "LOC-BDG-001",
      name: "POP Bandung",
      type: "POP",
      parent: "",
      coordinates: "-6.9175, 107.6191",
      address: "Jl. Asia Afrika, Bandung",
    },

    {
      id: "LOC-SBY-001",
      name: "POP Surabaya",
      type: "POP",
      parent: "",
      coordinates: "-7.2575, 112.7521",
      address: "Jl. Basuki Rahmat, Surabaya",
    },

    {
      id: "LOC-SBY-002",
      name: "Surabaya Data Center",
      type: "Data Center",
      parent: "POP Surabaya",
      coordinates: "-7.2658, 112.7341",
      address: "Jl. Raya Darmo, Surabaya",
    },

    {
      id: "LOC-JKT-003",
      name: "Floor 12",
      type: "Floor",
      parent: "Gedung Menara Sudirman",
      coordinates: "—",
      address: "Lantai 12",
    },

    {
      id: "LOC-JKT-004",
      name: "Server Room A",
      type: "Room",
      parent: "Floor 12",
      coordinates: "—",
      address: "Server Room A",
    },

    {
      id: "LOC-JKT-005",
      name: "Rack-JKT-01",
      type: "Rack",
      parent: "Server Room A",
      coordinates: "—",
      address: "Rack 01",
    },

    {
      id: "LOC-BDG-002",
      name: "Bandung Network Building",
      type: "Building",
      parent: "POP Bandung",
      coordinates: "-6.9147, 107.6098",
      address: "Jl. Pasteur, Bandung",
    },

    {
      id: "LOC-BDG-003",
      name: "Rack-BDG-01",
      type: "Rack",
      parent: "Bandung Network Building",
      coordinates: "—",
      address: "Main Network Rack",
    },

    {
      id: "LOC-SBY-003",
      name: "Surabaya POP Building",
      type: "Building",
      parent: "POP Surabaya",
      coordinates: "-7.2504, 112.7688",
      address: "Jl. Pemuda, Surabaya",
    },

    {
      id: "LOC-SBY-004",
      name: "Rack-SBY-01",
      type: "Rack",
      parent: "Surabaya POP Building",
      coordinates: "—",
      address: "Network Equipment Room",
    },
  ];

  /* =====================================================
       INITIALIZATION
    ====================================================== */

  init();

  function init() {
    loadLocations();

    bindEvents();

    render();
  }

  /* =====================================================
       LOAD DATA
    ====================================================== */

  function loadLocations() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          locations = parsed;

          return;
        }
      }
    } catch (error) {
      console.warn("NETASSET Locations: failed to load local data.", error);
    }

    locations = structuredClone(defaultLocations);

    saveLocations();
  }

  /* =====================================================
       SAVE DATA
    ====================================================== */

  function saveLocations() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
    } catch (error) {
      console.warn("NETASSET Locations: failed to save data.", error);
    }
  }

  /* =====================================================
       EVENT BINDINGS
    ====================================================== */

  function bindEvents() {
    /* Search */

    elements.search?.addEventListener("input", () => {
      currentPage = 1;

      render();
    });

    /* Type filter */

    elements.typeFilter?.addEventListener("change", () => {
      currentPage = 1;

      render();
    });

    /* Parent filter */

    elements.parentFilter?.addEventListener("change", () => {
      currentPage = 1;

      render();
    });

    /* Add */

    elements.addButton?.addEventListener("click", () => {
      openLocationModal("add");
    });

    /* Refresh */

    elements.refreshButton?.addEventListener("click", () => {
      currentPage = 1;

      render();

      showToast("Location data refreshed.", "success");
    });

    /* Table actions */

    elements.tableBody?.addEventListener("click", handleTableAction);

    /* Pagination */

    elements.pagination?.addEventListener("click", handlePagination);

    /* Dynamic modal */

    document.addEventListener("click", handleModalEvents);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeLocationModal();
      }
    });
  }

  /* =====================================================
       FILTER DATA
    ====================================================== */

  function getFilteredLocations() {
    const searchValue = elements.search?.value?.trim().toLowerCase() || "";

    const typeValue = elements.typeFilter?.value || "all";

    const parentValue = elements.parentFilter?.value || "all";

    return locations.filter((location) => {
      const searchableText = [
        location.id,
        location.name,
        location.type,
        location.parent,
        location.coordinates,
        location.address,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue || searchableText.includes(searchValue);

      const matchesType = typeValue === "all" || location.type === typeValue;

      const matchesParent =
        parentValue === "all" ||
        (parentValue === "none"
          ? !location.parent
          : location.parent === parentValue);

      return matchesSearch && matchesType && matchesParent;
    });
  }

  /* =====================================================
       RENDER EVERYTHING
    ====================================================== */

  function render() {
    const filtered = getFilteredLocations();

    renderTable(filtered);

    renderPagination(filtered);

    renderStatistics();

    renderResultCount(filtered.length);

    updateEmptyState(filtered.length);
  }

  /* =====================================================
       RENDER TABLE
    ====================================================== */

  function renderTable(filteredLocations) {
    if (!elements.tableBody) {
      return;
    }

    const startIndex = (currentPage - 1) * PAGE_SIZE;

    const pageLocations = filteredLocations.slice(
      startIndex,
      startIndex + PAGE_SIZE,
    );

    elements.tableBody.innerHTML = pageLocations
      .map(createLocationRow)
      .join("");
  }

  /* =====================================================
       CREATE TABLE ROW
    ====================================================== */

  function createLocationRow(location) {
    const parent = location.parent || "—";

    const coordinates = location.coordinates || "—";

    const address = location.address || "—";

    return `
            <tr
                data-location-id="${escapeHTML(location.id)}"
                data-type="${escapeHTML(location.type)}"
                data-parent="${escapeHTML(location.parent)}"
            >

                <td class="location-cell">

                    <div class="location-name">
                        ${escapeHTML(location.name)}
                    </div>

                    <div class="location-code">
                        ${escapeHTML(location.id)}
                    </div>

                </td>


                <td>

                    <span class="location-type-badge">
                        ${escapeHTML(location.type)}
                    </span>

                </td>


                <td class="parent-cell">
                    ${escapeHTML(parent)}
                </td>


                <td class="coordinates-cell">
                    ${escapeHTML(coordinates)}
                </td>


                <td class="address-cell">
                    ${escapeHTML(address)}
                </td>


                <td class="location-actions">

                    <button
                        type="button"
                        class="location-action-btn"
                        data-action="view"
                        data-id="${escapeHTML(location.id)}"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        class="location-action-btn"
                        data-action="edit"
                        data-id="${escapeHTML(location.id)}"
                    >
                        Edit
                    </button>

                </td>

            </tr>
        `;
  }

  /* =====================================================
       TABLE ACTIONS
    ====================================================== */

  function handleTableAction(event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    const id = button.dataset.id;

    const location = locations.find((item) => item.id === id);

    if (!location) {
      showToast("Location tidak ditemukan.", "error");

      return;
    }

    if (action === "view") {
      window.location.href = `location-detail.html?id=${encodeURIComponent(location.id)}`;

      return;
    }

    if (action === "edit") {
      openLocationModal("edit", location);
    }
  }

  /* =====================================================
       STATISTICS
    ====================================================== */

  function renderStatistics() {
    const total = locations.length;

    const pop = locations.filter((location) => location.type === "POP").length;

    const dataCenter = locations.filter(
      (location) => location.type === "Data Center",
    ).length;

    const childLocations = locations.filter((location) =>
      Boolean(location.parent),
    ).length;

    if (elements.totalLocations) {
      elements.totalLocations.textContent = total;
    }

    if (elements.popLocations) {
      elements.popLocations.textContent = pop;
    }

    if (elements.dataCenterLocations) {
      elements.dataCenterLocations.textContent = dataCenter;
    }

    if (elements.childLocations) {
      elements.childLocations.textContent = childLocations;
    }
  }

  /* =====================================================
       RESULT COUNT
    ====================================================== */

  function renderResultCount(filteredCount) {
    if (!elements.resultCount) {
      return;
    }

    const total = locations.length;

    if (filteredCount === 0) {
      elements.resultCount.textContent = `0 of ${total} Locations shown`;

      return;
    }

    const start = (currentPage - 1) * PAGE_SIZE + 1;

    const end = Math.min(start + PAGE_SIZE - 1, filteredCount);

    elements.resultCount.textContent = `${start}–${end} of ${filteredCount} Locations shown`;
  }

  /* =====================================================
       EMPTY STATE
    ====================================================== */

  function updateEmptyState(count) {
    if (!elements.emptyState) {
      return;
    }

    elements.emptyState.hidden = count !== 0;
  }

  /* =====================================================
       PAGINATION
    ====================================================== */

  function renderPagination(filteredLocations) {
    if (!elements.pagination) {
      return;
    }

    const totalPages = Math.max(
      1,
      Math.ceil(filteredLocations.length / PAGE_SIZE),
    );

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let html = "";

    html += `
            <button
                type="button"
                class="pagination-btn"
                data-page="prev"
                ${currentPage === 1 ? "disabled" : ""}
                aria-label="Previous page"
            >
                ‹
            </button>
        `;

    for (let page = 1; page <= totalPages; page++) {
      html += `
                <button
                    type="button"
                    class="pagination-btn ${
                      page === currentPage ? "active" : ""
                    }"
                    data-page="${page}"
                >
                    ${page}
                </button>
            `;
    }

    html += `
            <button
                type="button"
                class="pagination-btn"
                data-page="next"
                ${currentPage === totalPages ? "disabled" : ""}
                aria-label="Next page"
            >
                ›
            </button>
        `;

    elements.pagination.innerHTML = html;
  }

  /* =====================================================
       PAGINATION EVENTS
    ====================================================== */

  function handlePagination(event) {
    const button = event.target.closest("[data-page]");

    if (!button || button.disabled) {
      return;
    }

    const value = button.dataset.page;

    const filtered = getFilteredLocations();

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    if (value === "prev") {
      currentPage = Math.max(1, currentPage - 1);
    } else if (value === "next") {
      currentPage = Math.min(totalPages, currentPage + 1);
    } else {
      currentPage = Number(value);
    }

    render();
  }

  /* =====================================================
       MODAL
    ====================================================== */

  function openLocationModal(mode, location = null) {
    closeLocationModal();

    const isView = mode === "view";

    const isEdit = mode === "edit";

    const title = isView
      ? "View Location"
      : isEdit
        ? "Edit Location"
        : "Add Location";

    const submitLabel = isEdit ? "Save Location" : "Create Location";

    const modal = document.createElement("div");

    modal.id = "locationsDynamicModal";

    modal.className = "locations-modal-overlay";

    modal.innerHTML = `
            <div
                class="locations-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="locationModalTitle"
            >

                <div class="locations-modal-header">

                    <div>

                        <div class="locations-modal-eyebrow">
                            MASTER DATA
                        </div>

                        <h2 id="locationModalTitle">
                            ${title}
                        </h2>

                    </div>

                    <button
                        type="button"
                        class="locations-modal-close"
                        data-modal-action="close"
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                <div class="locations-modal-body">

                    <div class="locations-form-grid">

                        <div class="locations-form-group">

                            <label for="locationCode">
                                Location Code
                            </label>

                            <input
                                id="locationCode"
                                type="text"
                                value="${escapeHTML(location?.id || "")}"
                                placeholder="LOC-JKT-001"
                                ${isView ? "readonly" : ""}
                            />

                        </div>


                        <div class="locations-form-group">

                            <label for="locationName">
                                Location Name
                                <span>*</span>
                            </label>

                            <input
                                id="locationName"
                                type="text"
                                value="${escapeHTML(location?.name || "")}"
                                placeholder="POP Jakarta"
                                ${isView ? "readonly" : ""}
                            />

                        </div>


                        <div class="locations-form-group">

                            <label for="locationType">
                                Location Type
                                <span>*</span>
                            </label>

                            <select
                                id="locationType"
                                ${isView ? "disabled" : ""}
                            >

                                ${createTypeOptions(location?.type || "")}

                            </select>

                        </div>


                        <div class="locations-form-group">

                            <label for="locationParent">
                                Parent Location
                            </label>

                            <select
                                id="locationParent"
                                ${isView ? "disabled" : ""}
                            >

                                ${createParentOptions(
                                  location?.parent || "",
                                  location?.id || "",
                                )}

                            </select>

                        </div>


                        <div class="locations-form-group">

                            <label for="locationCoordinates">
                                Coordinates
                            </label>

                            <input
                                id="locationCoordinates"
                                type="text"
                                value="${escapeHTML(
                                  location?.coordinates || "",
                                )}"
                                placeholder="-6.2088, 106.8456"
                                ${isView ? "readonly" : ""}
                            />

                        </div>


                        <div class="locations-form-group">

                            <label for="locationAddress">
                                Address
                            </label>

                            <input
                                id="locationAddress"
                                type="text"
                                value="${escapeHTML(location?.address || "")}"
                                placeholder="Jl. Gatot Subroto..."
                                ${isView ? "readonly" : ""}
                            />

                        </div>

                    </div>

                </div>


                <div class="locations-modal-footer">

                    ${
                      isView
                        ? `
                                <button
                                    type="button"
                                    class="locations-modal-secondary"
                                    data-modal-action="close"
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    class="locations-modal-primary"
                                    data-modal-action="edit-from-view"
                                    data-id="${escapeHTML(location?.id || "")}"
                                >
                                    Edit Location
                                </button>
                            `
                        : `
                                <button
                                    type="button"
                                    class="locations-modal-secondary"
                                    data-modal-action="close"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    class="locations-modal-primary"
                                    data-modal-action="save"
                                    data-mode="${mode}"
                                    data-id="${escapeHTML(location?.id || "")}"
                                >
                                    ${submitLabel}
                                </button>
                            `
                    }

                </div>

            </div>
        `;

    document.body.appendChild(modal);

    requestAnimationFrame(() => {
      modal.classList.add("is-visible");
    });

    if (!isView) {
      setTimeout(() => {
        document.getElementById("locationName")?.focus();
      }, 50);
    }
  }

  /* =====================================================
       MODAL EVENTS
    ====================================================== */

  function handleModalEvents(event) {
    const actionElement = event.target.closest("[data-modal-action]");

    if (!actionElement) {
      return;
    }

    const action = actionElement.dataset.modalAction;

    if (action === "close") {
      closeLocationModal();

      return;
    }

    if (action === "save") {
      saveLocationFromModal(
        actionElement.dataset.mode,
        actionElement.dataset.id,
      );

      return;
    }

    if (action === "edit-from-view") {
      const location = locations.find(
        (item) => item.id === actionElement.dataset.id,
      );

      if (location) {
        openLocationModal("edit", location);
      }
    }
  }

  /* =====================================================
       SAVE MODAL
    ====================================================== */

  function saveLocationFromModal(mode, originalId) {
    const codeInput = document.getElementById("locationCode");

    const nameInput = document.getElementById("locationName");

    const typeInput = document.getElementById("locationType");

    const parentInput = document.getElementById("locationParent");

    const coordinatesInput = document.getElementById("locationCoordinates");

    const addressInput = document.getElementById("locationAddress");

    if (!codeInput || !nameInput || !typeInput) {
      return;
    }

    const code = codeInput.value.trim();

    const name = nameInput.value.trim();

    const type = typeInput.value;

    const parent = parentInput?.value || "";

    const coordinates = coordinatesInput?.value.trim() || "—";

    const address = addressInput?.value.trim() || "—";

    /* Validation */

    if (!code) {
      showToast("Location Code wajib diisi.", "error");

      codeInput.focus();

      return;
    }

    if (!name) {
      showToast("Location Name wajib diisi.", "error");

      nameInput.focus();

      return;
    }

    if (!type) {
      showToast("Location Type wajib dipilih.", "error");

      typeInput.focus();

      return;
    }

    /* Duplicate code */

    const duplicate = locations.some(
      (location) =>
        location.id.toLowerCase() === code.toLowerCase() &&
        location.id !== originalId,
    );

    if (duplicate) {
      showToast("Location Code sudah digunakan.", "error");

      codeInput.focus();

      return;
    }

    const data = {
      id: code,
      name,
      type,
      parent,
      coordinates,
      address,
    };

    /* EDIT */

    if (mode === "edit") {
      const index = locations.findIndex(
        (location) => location.id === originalId,
      );

      if (index === -1) {
        showToast("Location tidak ditemukan.", "error");

        return;
      }

      locations[index] = data;

      saveLocations();

      closeLocationModal();

      render();

      showToast("Location berhasil diperbarui.", "success");

      return;
    }

    /* ADD */

    locations.push(data);

    saveLocations();

    closeLocationModal();

    currentPage = Math.ceil(locations.length / PAGE_SIZE);

    render();

    showToast("Location berhasil ditambahkan.", "success");
  }

  /* =====================================================
       DELETE LOCATION
    ====================================================== */

  function deleteLocation(id) {
    const location = locations.find((item) => item.id === id);

    if (!location) {
      return;
    }

    const confirmed = window.confirm(`Hapus location "${location.name}"?`);

    if (!confirmed) {
      return;
    }

    locations = locations.filter((item) => item.id !== id);

    saveLocations();

    const filtered = getFilteredLocations();

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    render();

    showToast("Location berhasil dihapus.", "success");
  }

  /* =====================================================
       TYPE OPTIONS
    ====================================================== */

  function createTypeOptions(selected) {
    const types = [
      "POP",
      "Data Center",
      "Building",
      "Floor",
      "Room",
      "Rack",
      "Other",
    ];

    return `
            <option value="">
                Select Type
            </option>

            ${types
              .map(
                (type) => `
                <option
                    value="${escapeHTML(type)}"
                    ${type === selected ? "selected" : ""}
                >
                    ${escapeHTML(type)}
                </option>
            `,
              )
              .join("")}
        `;
  }

  /* =====================================================
       PARENT OPTIONS
    ====================================================== */

  function createParentOptions(selected, currentId) {
    const parents = locations.filter((location) => location.id !== currentId);

    return `
            <option value="">
                No Parent
            </option>

            ${parents
              .map((location) => {
                const label = `${location.name} (${location.id})`;

                return `
                    <option
                        value="${escapeHTML(location.name)}"
                        ${location.name === selected ? "selected" : ""}
                    >
                        ${escapeHTML(label)}
                    </option>
                `;
              })
              .join("")}
        `;
  }

  /* =====================================================
       RESET DEMO DATA
    ====================================================== */

  function resetDemoData() {
    const confirmed = window.confirm("Reset semua Location ke demo data awal?");

    if (!confirmed) {
      return;
    }

    locations = structuredClone(defaultLocations);

    saveLocations();

    currentPage = 1;

    if (elements.search) {
      elements.search.value = "";
    }

    if (elements.typeFilter) {
      elements.typeFilter.value = "all";
    }

    if (elements.parentFilter) {
      elements.parentFilter.value = "all";
    }

    render();

    showToast("Demo data berhasil di-reset.", "success");
  }

  /* =====================================================
       DELETE / RESET BUTTON EXTENSION
    ====================================================== */

  function addResetButton() {
    const footer = document.querySelector(".locations-table-footer");

    if (!footer) {
      return;
    }

    const resetButton = document.createElement("button");

    resetButton.type = "button";

    resetButton.className = "locations-reset-btn";

    resetButton.textContent = "Reset Demo Data";

    resetButton.addEventListener("click", resetDemoData);

    footer.appendChild(resetButton);
  }

  /* =====================================================
       TOAST
    ====================================================== */

  function showToast(message, type = "info") {
    let container = document.getElementById("locationsToastContainer");

    if (!container) {
      container = document.createElement("div");

      container.id = "locationsToastContainer";

      container.className = "locations-toast-container";

      document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    toast.className = `locations-toast locations-toast-${type}`;

    toast.innerHTML = `
            <span class="locations-toast-dot"></span>
            <span>${escapeHTML(message)}</span>
        `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    setTimeout(() => {
      toast.classList.remove("is-visible");

      setTimeout(() => {
        toast.remove();
      }, 220);
    }, 2800);
  }

  /* =====================================================
       CLOSE MODAL
    ====================================================== */

  function closeLocationModal() {
    const modal = document.getElementById("locationsDynamicModal");

    if (!modal) {
      return;
    }

    modal.classList.remove("is-visible");

    setTimeout(() => {
      modal.remove();
    }, 180);
  }

  /* =====================================================
       HTML ESCAPE
    ====================================================== */

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =====================================================
       INITIAL RESET BUTTON
    ====================================================== */

  addResetButton();

  /* =====================================================
       EXPOSE DEBUG API
       Useful while developing the prototype.
    ====================================================== */

  window.NETASSET_LOCATIONS = {
    getAll() {
      return [...locations];
    },

    reset() {
      resetDemoData();
    },

    refresh() {
      render();
    },

    add(location) {
      if (!location) {
        return;
      }

      locations.push(location);

      saveLocations();

      render();
    },

    delete(id) {
      deleteLocation(id);
    },
  };
});

window.NETASSET_LOCATIONS = {
  getAll() {
    return [...locations];
  },

  reset() {
    resetDemoData();
  },

  refresh() {
    render();
  },

  add(location) {
    if (!location) {
      return;
    }

    locations.push(location);

    saveLocations();

    render();
  },

  delete(id) {
    deleteLocation(id);
  },
};

console.log("NETASSET LOCATIONS JS LOADED");
