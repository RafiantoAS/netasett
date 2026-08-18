/* =========================================================
   NETASSET — LIFECYCLE / STATUS
   lifecycle.js

   Responsibilities:
   - Load default statuses
   - LocalStorage persistence
   - Search
   - Filter
   - Statistics
   - Add Status
   - Edit Status
   - Delete Status
   - Refresh
   - Modal handling
   - Toast notification
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIGURATION
  ========================================================= */

  const STORAGE_KEY = "netasset.lifecycleStatuses";

  /* =========================================================
     DEFAULT STATUS DATA
  ========================================================= */

  const DEFAULT_STATUSES = [
    {
      id: "STS-LC-001",
      name: "Planned",
      group: "lifecycle",
      color: "#64748B",
      sortOrder: 1,
      active: true,
      updatedAt: "2026-08-13T00:00:00.000Z",
    },

    {
      id: "STS-LC-002",
      name: "Provisioned",
      group: "lifecycle",
      color: "#3B82F6",
      sortOrder: 2,
      active: true,
      updatedAt: "2026-08-13T00:00:00.000Z",
    },

    {
      id: "STS-LC-003",
      name: "Active",
      group: "lifecycle",
      color: "#14B8A6",
      sortOrder: 3,
      active: true,
      updatedAt: "2026-08-13T00:00:00.000Z",
    },

    {
      id: "STS-LC-004",
      name: "Maintenance",
      group: "lifecycle",
      color: "#F59E0B",
      sortOrder: 4,
      active: true,
      updatedAt: "2026-08-13T00:00:00.000Z",
    },

    {
      id: "STS-LC-005",
      name: "Retired",
      group: "lifecycle",
      color: "#EF4444",
      sortOrder: 5,
      active: true,
      updatedAt: "2026-08-13T00:00:00.000Z",
    },

    {
      id: "STS-OP-001",
      name: "UP",
      group: "operational",
      color: "#14B8A6",
      sortOrder: 1,
      active: true,
      updatedAt: "2026-08-13T00:00:00.000Z",
    },

    {
      id: "STS-OP-002",
      name: "Degraded",
      group: "operational",
      color: "#F59E0B",
      sortOrder: 2,
      active: true,
      updatedAt: "2026-08-13T00:00:00.000Z",
    },

    {
      id: "STS-OP-003",
      name: "DOWN",
      group: "operational",
      color: "#EF4444",
      sortOrder: 3,
      active: true,
      updatedAt: "2026-08-13T00:00:00.000Z",
    },
  ];

  /* =========================================================
     STATE
  ========================================================= */

  let statuses = [];

  let filteredStatuses = [];

  /* =========================================================
     DOM REFERENCES
  ========================================================= */

  const elements = {
    refreshButton: document.getElementById("refreshStatuses"),

    addButton: document.getElementById("openAddStatus"),

    searchInput: document.getElementById("statusSearch"),

    groupFilter: document.getElementById("groupFilter"),

    activeFilter: document.getElementById("activeFilter"),

    tableBody: document.getElementById("statusTableBody"),

    resultCount: document.getElementById("statusResultCount"),

    showingCount: document.getElementById("showingStatusCount"),

    totalCount: document.getElementById("totalStatusCount"),

    lifecycleCount: document.getElementById("lifecycleStatusCount"),

    operationalCount: document.getElementById("operationalStatusCount"),

    activeCount: document.getElementById("activeStatusCount"),

    /* ADD MODAL */

    addModal: document.getElementById("addStatusModal"),

    addForm: document.getElementById("addStatusForm"),

    closeAdd: document.getElementById("closeAddStatus"),

    cancelAdd: document.getElementById("cancelAddStatus"),

    addName: document.getElementById("addStatusName"),

    addGroup: document.getElementById("addStatusGroup"),

    addSortOrder: document.getElementById("addStatusSortOrder"),

    addColor: document.getElementById("addStatusColor"),

    addActive: document.getElementById("addStatusActive"),

    /* EDIT MODAL */

    editModal: document.getElementById("editStatusModal"),

    editForm: document.getElementById("editStatusForm"),

    closeEdit: document.getElementById("closeEditStatus"),

    cancelEdit: document.getElementById("cancelEditStatus"),

    editId: document.getElementById("editStatusId"),

    editCode: document.getElementById("editStatusCode"),

    editName: document.getElementById("editStatusName"),

    editGroup: document.getElementById("editStatusGroup"),

    editSortOrder: document.getElementById("editStatusSortOrder"),

    editColor: document.getElementById("editStatusColor"),

    editActive: document.getElementById("editStatusActive"),
  };

  /* =========================================================
     INITIALIZATION
  ========================================================= */

  function init() {
    loadStatuses();

    bindEvents();

    render();

    exposeDebugObject();
  }

  /* =========================================================
     STORAGE
  ========================================================= */

  function loadStatuses() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      /*
       * FIRST LOAD
       *
       * Kalau belum pernah ada data,
       * langsung gunakan default status.
       */

      if (!stored) {
        statuses = DEFAULT_STATUSES.map(normalizeStatus);

        saveStatuses();

        return;
      }

      const parsed = JSON.parse(stored);

      /*
       * OLD EMPTY DATA
       *
       * Kalau versi sebelumnya pernah
       * menyimpan [] maka seed ulang.
       */

      if (!Array.isArray(parsed) || parsed.length === 0) {
        statuses = DEFAULT_STATUSES.map(normalizeStatus);

        saveStatuses();

        return;
      }

      /*
       * NORMAL LOAD
       */

      statuses = parsed.map(normalizeStatus);
    } catch (error) {
      console.error("NETASSET Lifecycle: failed to load statuses.", error);

      /*
       * Kalau localStorage corrupt,
       * kembali ke default data.
       */

      statuses = DEFAULT_STATUSES.map(normalizeStatus);

      saveStatuses();
    }
  }

  function saveStatuses() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
    } catch (error) {
      console.error("NETASSET Lifecycle: failed to save statuses.", error);

      showToast("Status gagal disimpan ke browser.", "error");
    }
  }

  /* =========================================================
     DATA NORMALIZATION
  ========================================================= */

  function normalizeStatus(status) {
    return {
      id: status?.id || createStatusId(),

      name: String(status?.name || "").trim(),

      group: status?.group === "operational" ? "operational" : "lifecycle",

      color: status?.color || "#14B8A6",

      sortOrder: Number.isFinite(Number(status?.sortOrder))
        ? Number(status.sortOrder)
        : 0,

      active: status?.active !== false,

      updatedAt: status?.updatedAt || new Date().toISOString(),
    };
  }

  function createStatusId() {
    return (
      "STS-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).substring(2, 7).toUpperCase()
    );
  }

  /* =========================================================
     EVENTS
  ========================================================= */

  function bindEvents() {
    /* REFRESH */

    elements.refreshButton?.addEventListener("click", handleRefresh);

    /* ADD */

    elements.addButton?.addEventListener("click", openAddModal);

    /* SEARCH */

    elements.searchInput?.addEventListener("input", render);

    /* GROUP FILTER */

    elements.groupFilter?.addEventListener("change", render);

    /* ACTIVE FILTER */

    elements.activeFilter?.addEventListener("change", render);

    /* ADD FORM */

    elements.addForm?.addEventListener("submit", handleAddSubmit);

    elements.closeAdd?.addEventListener("click", closeAddModal);

    elements.cancelAdd?.addEventListener("click", closeAddModal);

    /* EDIT FORM */

    elements.editForm?.addEventListener("submit", handleEditSubmit);

    elements.closeEdit?.addEventListener("click", closeEditModal);

    elements.cancelEdit?.addEventListener("click", closeEditModal);

    /* TABLE */

    elements.tableBody?.addEventListener("click", handleTableAction);

    /* ESC */

    elements.addModal?.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeAddModal();
    });

    elements.editModal?.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeEditModal();
    });

    /* BACKDROP */

    elements.addModal?.addEventListener("click", handleModalBackdropClick);

    elements.editModal?.addEventListener("click", handleModalBackdropClick);
  }

  /* =========================================================
     REFRESH
  ========================================================= */

  function handleRefresh() {
    const button = elements.refreshButton;

    if (!button) {
      return;
    }

    button.disabled = true;

    loadStatuses();

    render();

    showToast("Status data berhasil diperbarui.", "success");

    window.setTimeout(() => {
      button.disabled = false;
    }, 400);
  }

  /* =========================================================
     FILTERING
  ========================================================= */

  function getFilteredStatuses() {
    const searchTerm = elements.searchInput?.value?.trim().toLowerCase() || "";

    const groupValue = elements.groupFilter?.value || "all";

    const activeValue = elements.activeFilter?.value || "all";

    return statuses
      .filter((status) => {
        /* SEARCH */

        if (searchTerm) {
          const searchableText = [status.id, status.name, status.group]
            .join(" ")
            .toLowerCase();

          if (!searchableText.includes(searchTerm)) {
            return false;
          }
        }

        /* GROUP */

        if (groupValue !== "all" && status.group !== groupValue) {
          return false;
        }

        /* ACTIVE */

        if (activeValue === "active" && !status.active) {
          return false;
        }

        if (activeValue === "inactive" && status.active) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }

        return a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
      });
  }

  /* =========================================================
     RENDER
  ========================================================= */

  function render() {
    filteredStatuses = getFilteredStatuses();

    renderStatistics();

    renderTable();

    renderResultCount();
  }

  /* =========================================================
     STATISTICS
  ========================================================= */

  function renderStatistics() {
    const total = statuses.length;

    const lifecycle = statuses.filter(
      (status) => status.group === "lifecycle",
    ).length;

    const operational = statuses.filter(
      (status) => status.group === "operational",
    ).length;

    const active = statuses.filter((status) => status.active).length;

    setText(elements.totalCount, total);

    setText(elements.lifecycleCount, lifecycle);

    setText(elements.operationalCount, operational);

    setText(elements.activeCount, active);
  }

  /* =========================================================
     TABLE
  ========================================================= */

  function renderTable() {
    if (!elements.tableBody) {
      return;
    }

    if (filteredStatuses.length === 0) {
      elements.tableBody.innerHTML = `
        <tr>
          <td colspan="7">

            <div class="lifecycle-empty-state">

              <div class="lifecycle-empty-icon">
                ◌
              </div>

              <h3>
                No statuses found
              </h3>

              <p>
                ${
                  statuses.length === 0
                    ? "Status data will appear here once it has been configured."
                    : "No status matches the current search or filters."
                }
              </p>

            </div>

          </td>
        </tr>
      `;

      return;
    }

    elements.tableBody.innerHTML = filteredStatuses
      .map(renderStatusRow)
      .join("");
  }

  function renderStatusRow(status) {
    const groupLabel = getGroupLabel(status.group);

    const activeLabel = status.active ? "Active" : "Inactive";

    const activeClass = status.active ? "active" : "inactive";

    return `
      <tr
        data-status-id="${escapeHtml(status.id)}"
      >

        <td>

          <div
            style="
              display:flex;
              align-items:center;
              gap:9px;
              font-weight:600;
            "
          >

            <span
              style="
                width:9px;
                height:9px;
                flex:0 0 9px;
                border-radius:50%;
                background:${escapeAttribute(status.color)};
                box-shadow:0 0 0 3px ${escapeAttribute(
                  hexToRgba(status.color, 0.12),
                )};
              "
            ></span>

            <span>
              ${escapeHtml(status.name)}
            </span>

          </div>

        </td>


        <td>
          ${escapeHtml(groupLabel)}
        </td>


        <td>

          <div
            style="
              display:flex;
              align-items:center;
              gap:8px;
            "
          >

            <span
              style="
                width:22px;
                height:22px;
                display:inline-block;
                border-radius:6px;
                border:1px solid rgba(7,27,58,.12);
                background:${escapeAttribute(status.color)};
              "
              title="${escapeAttribute(status.color)}"
            ></span>

            <span
              style="
                font-family:'IBM Plex Mono',monospace;
                font-size:11px;
                color:#607d9e;
              "
            >
              ${escapeHtml(status.color.toUpperCase())}
            </span>

          </div>

        </td>


        <td>

          <span
            style="
              font-family:'IBM Plex Mono',monospace;
              color:#385b80;
              font-size:12px;
            "
          >
            ${escapeHtml(String(status.sortOrder))}
          </span>

        </td>


        <td>

          <span
            class="lifecycle-status-badge ${activeClass}"
          >

            <span
              class="lifecycle-status-dot"
            ></span>

            ${activeLabel}

          </span>

        </td>


        <td>

          <span
            style="
              color:#607d9e;
              font-size:11px;
            "
          >
            ${formatDate(status.updatedAt)}
          </span>

        </td>


        <td>

          <div
            style="
              display:flex;
              align-items:center;
              gap:6px;
              white-space:nowrap;
            "
          >

            <button
              type="button"
              class="btn lifecycle-row-edit"
              data-action="edit"
              data-id="${escapeAttribute(status.id)}"
            >
              Edit
            </button>


            <button
              type="button"
              class="btn lifecycle-row-delete"
              data-action="delete"
              data-id="${escapeAttribute(status.id)}"
            >
              Delete
            </button>

          </div>

        </td>

      </tr>
    `;
  }

  /* =========================================================
     RESULT COUNT
  ========================================================= */

  function renderResultCount() {
    const filteredCount = filteredStatuses.length;

    const totalCount = statuses.length;

    if (elements.resultCount) {
      elements.resultCount.textContent =
        filteredCount === totalCount
          ? `${totalCount} statuses`
          : `${filteredCount} of ${totalCount} statuses`;
    }

    setText(elements.showingCount, filteredCount);
  }

  /* =========================================================
     ADD STATUS
  ========================================================= */

  function openAddModal() {
    if (!elements.addModal) {
      return;
    }

    resetAddForm();

    if (typeof elements.addModal.showModal === "function") {
      elements.addModal.showModal();
    } else {
      elements.addModal.setAttribute("open", "");
    }

    window.setTimeout(() => {
      elements.addName?.focus();
    }, 50);
  }

  function closeAddModal() {
    if (!elements.addModal) {
      return;
    }

    if (typeof elements.addModal.close === "function") {
      elements.addModal.close();
    } else {
      elements.addModal.removeAttribute("open");
    }
  }

  function resetAddForm() {
    elements.addForm?.reset();

    if (elements.addSortOrder) {
      elements.addSortOrder.value = String(getNextSortOrder());
    }

    if (elements.addColor) {
      elements.addColor.value = "#14B8A6";
    }

    if (elements.addActive) {
      elements.addActive.checked = true;
    }
  }

  function getNextSortOrder() {
    if (statuses.length === 0) {
      return 1;
    }

    return (
      Math.max(...statuses.map((status) => Number(status.sortOrder) || 0)) + 1
    );
  }

  function handleAddSubmit(event) {
    event.preventDefault();

    const name = elements.addName?.value.trim() || "";

    const group = elements.addGroup?.value || "";

    const sortOrder = Number(elements.addSortOrder?.value || 0);

    const color = elements.addColor?.value || "#14B8A6";

    const active = elements.addActive?.checked !== false;

    if (!name) {
      showToast("Status Name wajib diisi.", "error");

      elements.addName?.focus();

      return;
    }

    if (!group) {
      showToast("Status Group wajib dipilih.", "error");

      elements.addGroup?.focus();

      return;
    }

    const duplicate = statuses.some(
      (status) => status.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      showToast("Status dengan nama tersebut sudah ada.", "error");

      elements.addName?.focus();

      return;
    }

    const newStatus = {
      id: createStatusId(),

      name,

      group,

      color,

      sortOrder: Number.isFinite(sortOrder) ? sortOrder : getNextSortOrder(),

      active,

      updatedAt: new Date().toISOString(),
    };

    statuses.push(newStatus);

    saveStatuses();

    closeAddModal();

    render();

    showToast("Status berhasil ditambahkan.", "success");
  }

  /* =========================================================
     EDIT STATUS
  ========================================================= */

  function openEditModal(id) {
    const status = statuses.find((item) => item.id === id);

    if (!status) {
      showToast("Status tidak ditemukan.", "error");

      return;
    }

    if (elements.editId) {
      elements.editId.value = status.id;
    }

    if (elements.editCode) {
      elements.editCode.value = status.id;
    }

    if (elements.editName) {
      elements.editName.value = status.name;
    }

    if (elements.editGroup) {
      elements.editGroup.value = status.group;
    }

    if (elements.editSortOrder) {
      elements.editSortOrder.value = String(status.sortOrder);
    }

    if (elements.editColor) {
      elements.editColor.value = normalizeHexColor(status.color);
    }

    if (elements.editActive) {
      elements.editActive.checked = status.active;
    }

    if (!elements.editModal) {
      return;
    }

    if (typeof elements.editModal.showModal === "function") {
      elements.editModal.showModal();
    } else {
      elements.editModal.setAttribute("open", "");
    }

    window.setTimeout(() => {
      elements.editName?.focus();
    }, 50);
  }

  function closeEditModal() {
    if (!elements.editModal) {
      return;
    }

    if (typeof elements.editModal.close === "function") {
      elements.editModal.close();
    } else {
      elements.editModal.removeAttribute("open");
    }
  }

  function handleEditSubmit(event) {
    event.preventDefault();

    const id = elements.editId?.value || "";

    const status = statuses.find((item) => item.id === id);

    if (!status) {
      showToast("Status tidak ditemukan.", "error");

      return;
    }

    const name = elements.editName?.value.trim() || "";

    const group = elements.editGroup?.value || "";

    const sortOrder = Number(elements.editSortOrder?.value || 0);

    const color = elements.editColor?.value || "#14B8A6";

    const active = elements.editActive?.checked === true;

    if (!name) {
      showToast("Status Name wajib diisi.", "error");

      elements.editName?.focus();

      return;
    }

    if (!group) {
      showToast("Status Group wajib dipilih.", "error");

      elements.editGroup?.focus();

      return;
    }

    const duplicate = statuses.some(
      (item) =>
        item.id !== id && item.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      showToast("Status dengan nama tersebut sudah ada.", "error");

      elements.editName?.focus();

      return;
    }

    status.name = name;

    status.group = group;

    status.sortOrder = Number.isFinite(sortOrder) ? sortOrder : 0;

    status.color = color;

    status.active = active;

    status.updatedAt = new Date().toISOString();

    saveStatuses();

    closeEditModal();

    render();

    showToast("Status berhasil diperbarui.", "success");
  }

  /* =========================================================
     TABLE ACTIONS
  ========================================================= */

  function handleTableAction(event) {
    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) {
      return;
    }

    const action = actionButton.dataset.action;

    const id = actionButton.dataset.id;

    if (!id) {
      return;
    }

    if (action === "edit") {
      openEditModal(id);

      return;
    }

    if (action === "delete") {
      deleteStatus(id);
    }
  }

  /* =========================================================
     DELETE STATUS
  ========================================================= */

  function deleteStatus(id) {
    const status = statuses.find((item) => item.id === id);

    if (!status) {
      return;
    }

    const confirmed = window.confirm(`Hapus status "${status.name}"?`);

    if (!confirmed) {
      return;
    }

    statuses = statuses.filter((item) => item.id !== id);

    saveStatuses();

    render();

    showToast("Status berhasil dihapus.", "success");
  }

  /* =========================================================
     MODAL BACKDROP
  ========================================================= */

  function handleModalBackdropClick(event) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.currentTarget === elements.addModal) {
      closeAddModal();
    }

    if (event.currentTarget === elements.editModal) {
      closeEditModal();
    }
  }

  /* =========================================================
     TOAST
  ========================================================= */

  function showToast(message, type = "success") {
    let container = document.getElementById("netassetToastContainer");

    if (!container) {
      container = document.createElement("div");

      container.id = "netassetToastContainer";

      container.style.position = "fixed";

      container.style.right = "24px";

      container.style.bottom = "24px";

      container.style.zIndex = "9999";

      container.style.display = "flex";

      container.style.flexDirection = "column";

      container.style.gap = "10px";

      document.body.appendChild(container);
    }

    const toast = document.createElement("div");

    toast.style.minWidth = "280px";

    toast.style.maxWidth = "380px";

    toast.style.padding = "13px 16px";

    toast.style.border = "1px solid #d5e0ed";

    toast.style.borderRadius = "10px";

    toast.style.background = "#ffffff";

    toast.style.color = "#071b3a";

    toast.style.fontFamily = '"Inter", sans-serif';

    toast.style.fontSize = "12px";

    toast.style.fontWeight = "500";

    toast.style.boxShadow = "0 12px 30px rgba(7, 27, 58, 0.14)";

    toast.style.opacity = "0";

    toast.style.transform = "translateY(8px)";

    toast.style.transition = "opacity .18s ease, transform .18s ease";

    if (type === "error") {
      toast.style.borderColor = "#e7b6b6";

      toast.style.color = "#a33b3b";
    } else {
      toast.style.borderColor = "#b8e5dd";

      toast.style.color = "#087f77";
    }

    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = "1";

      toast.style.transform = "translateY(0)";
    });

    window.setTimeout(() => {
      toast.style.opacity = "0";

      toast.style.transform = "translateY(8px)";

      window.setTimeout(() => {
        toast.remove();
      }, 200);
    }, 2600);
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  function setText(element, value) {
    if (!element) {
      return;
    }

    element.textContent = String(value);
  }

  function getGroupLabel(group) {
    if (group === "operational") {
      return "Operational";
    }

    return "Lifecycle";
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function normalizeHexColor(color) {
    if (typeof color !== "string") {
      return "#14B8A6";
    }

    const value = color.trim();

    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      return value;
    }

    if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
      return value;
    }

    return "#14B8A6";
  }

  function hexToRgba(hex, alpha) {
    const normalized = normalizeHexColor(hex);

    let value = normalized.substring(1);

    if (value.length === 3) {
      value = value
        .split("")
        .map((character) => character + character)
        .join("");
    }

    const number = parseInt(value, 16);

    const red = (number >> 16) & 255;

    const green = (number >> 8) & 255;

    const blue = number & 255;

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }

  /* =========================================================
     DEBUG
  ========================================================= */

  function exposeDebugObject() {
    window.NETASSET_LIFECYCLE = {
      getStatuses() {
        return [...statuses];
      },

      getFilteredStatuses() {
        return [...filteredStatuses];
      },

      reload() {
        loadStatuses();
        render();
      },

      seedDefaults() {
        statuses = DEFAULT_STATUSES.map(normalizeStatus);

        saveStatuses();

        render();

        showToast("Default status berhasil dimuat.", "success");
      },

      clear() {
        const confirmed = window.confirm(
          "Hapus semua Lifecycle / Status dari localStorage?",
        );

        if (!confirmed) {
          return;
        }

        statuses = [];

        saveStatuses();

        render();

        showToast("Semua status berhasil dihapus.", "success");
      },
    };
  }

  /* =========================================================
     START
  ========================================================= */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {
      once: true,
    });
  } else {
    init();
  }
})();
