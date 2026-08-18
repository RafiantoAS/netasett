/* =========================================================
   NETASSET
   LOCATION DETAIL
   location-detail.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const STORAGE_KEY = "netasset_locations_demo";

  let locations = [];
  let currentLocation = null;

  /* =====================================================
     DOM
  ====================================================== */

  const $ = (selector) => document.querySelector(selector);

  const $$ = (selector) => document.querySelectorAll(selector);

  /* =====================================================
     INITIALIZATION
  ====================================================== */

  init();

  function init() {
    loadLocations();

    currentLocation = getCurrentLocation();

    if (!currentLocation) {
      showNotFound();
      return;
    }

    renderLocation();

    setupTabs();

    setupEdit();

    setupNavigation();

    setupModal();

    restoreTab();
  }

  /* =====================================================
     STORAGE
  ====================================================== */

  function loadLocations() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        locations = [];
        return;
      }

      const parsed = JSON.parse(saved);

      locations = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Failed to load locations:", error);

      locations = [];
    }
  }

  function saveLocations() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  }

  /* =====================================================
     CURRENT LOCATION
  ====================================================== */

  function getCurrentLocation() {
    const params = new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id) {
      return null;
    }

    return (
      locations.find(
        (location) =>
          String(location.id).toLowerCase() === String(id).toLowerCase(),
      ) || null
    );
  }

  /* =====================================================
     RENDER MAIN LOCATION
  ====================================================== */

  function renderLocation() {
    renderHero();

    renderOverview();

    renderHierarchy();

    renderAssets();

    renderNetwork();

    updateTitle();
  }

  /* =====================================================
     HERO
  ====================================================== */

  function renderHero() {
    setText("#detailBreadcrumbCode", currentLocation.id);

    setText("#detailLocationName", currentLocation.name);

    setText("#detailLocationCode", currentLocation.id);

    setText("#detailLocationType", currentLocation.type);
  }

  /* =====================================================
     OVERVIEW
  ====================================================== */

  function renderOverview() {
    setText("#overviewLocationCode", currentLocation.id);

    setText("#overviewLocationName", currentLocation.name);

    setText("#overviewLocationType", currentLocation.type);

    setText("#overviewParentLocation", currentLocation.parent || "No Parent");

    setText("#overviewCoordinates", currentLocation.coordinates || "—");

    setText("#overviewAddress", currentLocation.address || "—");

    setText("#overviewDescription", createDescription());
  }

  function createDescription() {
    return `${currentLocation.name} is a ${currentLocation.type} location serving as part of the NETASSET network infrastructure hierarchy.`;
  }

  /* =====================================================
     HIERARCHY
  ====================================================== */

  function renderHierarchy() {
    renderParent();

    renderChildren();

    renderTree();
  }

  function getParent() {
    if (!currentLocation.parent) {
      return null;
    }

    return (
      locations.find((location) => location.name === currentLocation.parent) ||
      null
    );
  }

  function getChildren() {
    return locations.filter(
      (location) => location.parent === currentLocation.name,
    );
  }

  /* =====================================================
     PARENT
  ====================================================== */

  function renderParent() {
    const container = $(".location-hierarchy-empty");

    if (!container) {
      return;
    }

    const parent = getParent();

    if (!parent) {
      container.innerHTML = `
        <div class="location-empty-icon">
          —
        </div>

        <strong>
          No Parent Location
        </strong>

        <span>
          This location is a top-level location.
        </span>
      `;

      return;
    }

    container.innerHTML = `

      <a
        href="location-detail.html?id=${encodeURIComponent(parent.id)}"
        class="location-parent-link"
      >

        <div class="location-empty-icon">
          ${escapeHTML(shortType(parent.type))}
        </div>

        <strong>
          ${escapeHTML(parent.name)}
        </strong>

        <span>
          ${escapeHTML(parent.id)}
          ·
          ${escapeHTML(parent.type)}
        </span>

      </a>

    `;
  }

  /* =====================================================
     CHILDREN
  ====================================================== */

  function renderChildren() {
    const container = $(".location-child-list");

    if (!container) {
      return;
    }

    const children = getChildren();

    if (!children.length) {
      container.innerHTML = `

        <div class="location-hierarchy-empty">

          <div class="location-empty-icon">
            —
          </div>

          <strong>
            No Child Locations
          </strong>

          <span>
            No child locations are currently assigned.
          </span>

        </div>

      `;

      return;
    }

    container.innerHTML = children
      .map(
        (location) => `

            <a
              href="location-detail.html?id=${encodeURIComponent(location.id)}"
              class="location-child-item"
            >

              <div class="location-child-icon">
                ${escapeHTML(shortType(location.type))}
              </div>

              <div
                class="location-child-content"
              >

                <strong>
                  ${escapeHTML(location.name)}
                </strong>

                <span>
                  ${escapeHTML(location.id)}
                  ·
                  ${escapeHTML(location.type)}
                </span>

              </div>

              <span
                class="location-child-arrow"
              >
                →
              </span>

            </a>

          `,
      )
      .join("");
  }

  /* =====================================================
     LOCATION TREE
  ====================================================== */

  function renderTree() {
    const tree = $(".location-tree");

    if (!tree) {
      return;
    }

    const chain = buildChain();

    const children = getChildren();

    let html = "";

    chain.forEach((location, index) => {
      const current = location.id === currentLocation.id;

      html += `

          <div
            class="
              location-tree-node
              ${current ? "current" : ""}
            "
          >

            <div
              class="location-tree-icon"
            >
              ${escapeHTML(shortType(location.type))}
            </div>

            <div>

              <strong>
                ${escapeHTML(location.name)}
              </strong>

              <span>
                ${escapeHTML(location.id)}
                ·
                ${escapeHTML(location.type)}
              </span>

            </div>

          </div>

        `;
    });

    if (children.length) {
      html += `

        <div
          class="location-tree-children"
        >

          ${children
            .map(
              (child) => `

                <a
                  href="location-detail.html?id=${encodeURIComponent(child.id)}"
                  class="location-tree-node"
                >

                  <div
                    class="location-tree-icon small"
                  >
                    ${escapeHTML(shortType(child.type))}
                  </div>

                  <div>

                    <strong>
                      ${escapeHTML(child.name)}
                    </strong>

                    <span>
                      ${escapeHTML(child.id)}
                      ·
                      ${escapeHTML(child.type)}
                    </span>

                  </div>

                </a>

              `,
            )
            .join("")}

        </div>

      `;
    }

    tree.innerHTML = html;
  }

  function buildChain() {
    const chain = [];

    const visited = new Set();

    let location = currentLocation;

    while (location) {
      if (visited.has(location.id)) {
        break;
      }

      visited.add(location.id);

      chain.unshift(location);

      if (!location.parent) {
        break;
      }

      location =
        locations.find((item) => item.name === location.parent) || null;
    }

    return chain;
  }

  /* =====================================================
     ASSETS
  ====================================================== */

  function renderAssets() {
    const tbody = $("#locationAssetsBody");

    if (!tbody) {
      return;
    }

    /*
     * Untuk sekarang data asset menggunakan
     * demo data yang tersedia di halaman.
     */

    const assets = [
      {
        name: "Core Router",
        code: "RTR-JKT-001",
        type: "Router",
        role: "Core Network",
        status: "Active",
      },

      {
        name: "Core Switch",
        code: "SW-JKT-001",
        type: "Switch",
        role: "Distribution",
        status: "Active",
      },

      {
        name: "Application Server",
        code: "SRV-JKT-001",
        type: "Server",
        role: "Application",
        status: "Active",
      },
    ];

    tbody.innerHTML = assets
      .map(
        (asset) => `

            <tr>

              <td>

                <div
                  class="location-asset-cell"
                >

                  <div
                    class="location-asset-icon"
                  >
                    ${escapeHTML(asset.type.substring(0, 3).toUpperCase())}
                  </div>

                  <div>

                    <strong>
                      ${escapeHTML(asset.name)}
                    </strong>

                    <span
                      class="location-detail-mono"
                    >
                      ${escapeHTML(asset.code)}
                    </span>

                  </div>

                </div>

              </td>

              <td>
                ${escapeHTML(asset.type)}
              </td>

              <td>
                ${escapeHTML(asset.role)}
              </td>

              <td>

                <span
                  class="location-status-badge active"
                >

                  <span
                    class="status-dot"
                  ></span>

                  ${escapeHTML(asset.status)}

                </span>

              </td>

            </tr>

          `,
      )
      .join("");
  }

  /* =====================================================
     NETWORK
  ====================================================== */

  function renderNetwork() {
    /*
     * Network resources masih berupa
     * demo/template sampai module
     * Network Resources tersambung.
     */

    setText("#locationIpCount", "24");

    setText("#locationPoolCount", "3");

    setText("#locationVlanCount", "8");

    setText("#locationActiveVlanCount", "8");
  }

  /* =====================================================
     TABS
  ====================================================== */

  function setupTabs() {
    const tabs = $$(".location-detail-tab");

    const panels = $$(".location-detail-panel");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;

        if (!target) {
          return;
        }

        tabs.forEach((item) => {
          item.classList.toggle("active", item === tab);
        });

        panels.forEach((panel) => {
          panel.classList.toggle("active", panel.id === `tab-${target}`);
        });

        history.replaceState(null, "", `#${target}`);

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    });
  }

  /* =====================================================
     RESTORE TAB
  ====================================================== */

  function restoreTab() {
    const hash = window.location.hash.replace("#", "").trim();

    const validTabs = ["overview", "hierarchy", "assets", "network", "history"];

    const target = validTabs.includes(hash) ? hash : "overview";

    const tab = document.querySelector(
      `.location-detail-tab[data-tab="${target}"]`,
    );

    const panel = document.getElementById(`tab-${target}`);

    if (!tab || !panel) {
      return;
    }

    $$(".location-detail-tab").forEach((item) =>
      item.classList.remove("active"),
    );

    $$(".location-detail-panel").forEach((item) =>
      item.classList.remove("active"),
    );

    tab.classList.add("active");

    panel.classList.add("active");
  }

  /* =====================================================
     EDIT
  ====================================================== */

  function setupEdit() {
    const button = $("#editLocationButton");

    if (!button) {
      return;
    }

    button.addEventListener("click", openEditModal);
  }

  function openEditModal() {
    const modal = $("#editLocationModal");

    if (!modal) {
      return;
    }

    $("#editLocationCode").value = currentLocation.id || "";

    $("#editLocationName").value = currentLocation.name || "";

    $("#editLocationType").value = currentLocation.type || "";

    $("#editLocationCoordinates").value = currentLocation.coordinates || "";

    $("#editLocationAddress").value = currentLocation.address || "";

    populateParentOptions();

    $("#editLocationParent").value = currentLocation.parent || "";

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  }

  /* =====================================================
     PARENT SELECT
  ====================================================== */

  function populateParentOptions() {
    const select = $("#editLocationParent");

    if (!select) {
      return;
    }

    select.innerHTML = `

      <option value="">
        No Parent
      </option>

    `;

    locations
      .filter((location) => location.id !== currentLocation.id)
      .forEach((location) => {
        const option = document.createElement("option");

        option.value = location.name;

        option.textContent = `${location.name} (${location.id})`;

        select.appendChild(option);
      });
  }

  /* =====================================================
     MODAL
  ====================================================== */

  function setupModal() {
    const modal = $("#editLocationModal");

    const form = $("#editLocationForm");

    const close = $("#closeEditLocation");

    const cancel = $("#cancelEditLocation");

    if (!modal || !form) {
      return;
    }

    close?.addEventListener("click", () => modal.close());

    cancel?.addEventListener("click", () => modal.close());

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.close();
      }
    });

    form.addEventListener("submit", handleEditSubmit);
  }

  /* =====================================================
     SAVE EDIT
  ====================================================== */

  function handleEditSubmit(event) {
    event.preventDefault();

    const name = $("#editLocationName").value.trim();

    const type = $("#editLocationType").value;

    const parent = $("#editLocationParent").value;

    const coordinates = $("#editLocationCoordinates").value.trim();

    const address = $("#editLocationAddress").value.trim();

    if (!name || !type) {
      alert("Location Name dan Location Type wajib diisi.");

      return;
    }

    /*
     * Prevent self-parent.
     */

    if (parent === currentLocation.name) {
      alert("Location tidak dapat menjadi parent untuk dirinya sendiri.");

      return;
    }

    /*
     * Find actual location.
     */

    const index = locations.findIndex(
      (location) => location.id === currentLocation.id,
    );

    if (index === -1) {
      alert("Location tidak ditemukan.");

      return;
    }

    /*
     * Update.
     */

    locations[index] = {
      ...locations[index],

      name,

      type,

      parent: parent || "",

      coordinates,

      address,
    };

    currentLocation = locations[index];

    saveLocations();

    /*
     * Close modal.
     */

    const modal = $("#editLocationModal");

    modal?.close();

    /*
     * Re-render page.
     */

    renderLocation();

    /*
     * Feedback.
     */

    showToast("Location berhasil diperbarui.");
  }

  /* =====================================================
     NAVIGATION
  ====================================================== */

  function setupNavigation() {
    /*
     * Back
     */

    const back = document.querySelector(
      ".location-btn-secondary[href='locations.html']",
    );

    back?.addEventListener("click", (event) => {
      event.preventDefault();

      window.location.href = "locations.html";
    });
  }

  /* =====================================================
     TOAST
  ====================================================== */

  function showToast(message) {
    let toast = document.querySelector(".location-detail-toast");

    if (!toast) {
      toast = document.createElement("div");

      toast.className = "location-detail-toast";

      document.body.appendChild(toast);
    }

    toast.textContent = message;

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  /* =====================================================
     NOT FOUND
  ====================================================== */

  function showNotFound() {
    const container = $(".location-detail");

    if (!container) {
      return;
    }

    container.innerHTML = `

      <section
        class="location-detail-not-found"
      >

        <div
          class="location-detail-not-found-icon"
        >
          !
        </div>

        <h1>
          Location Not Found
        </h1>

        <p>
          The requested location could not
          be found.
        </p>

        <a
          href="locations.html"
          class="location-btn location-btn-primary"
        >
          ← Back to Locations
        </a>

      </section>

    `;
  }

  /* =====================================================
     HELPERS
  ====================================================== */

  function setText(selector, value) {
    const element = $(selector);

    if (!element) {
      return;
    }

    element.textContent =
      value === undefined || value === null || value === "" ? "—" : value;
  }

  function shortType(type) {
    const map = {
      "Data Center": "DC",

      Building: "BLD",

      Floor: "FL",

      Room: "RM",

      Rack: "RCK",

      POP: "POP",

      Other: "LOC",
    };

    return map[type] || "LOC";
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function updateTitle() {
    document.title = `${currentLocation.name} · NETASSET`;
  }

  /* =====================================================
     DEBUG
  ====================================================== */

  window.NETASSET_LOCATION_DETAIL = {
    getCurrent() {
      return currentLocation;
    },

    getLocations() {
      return locations;
    },

    refresh() {
      loadLocations();

      currentLocation = getCurrentLocation();

      if (currentLocation) {
        renderLocation();
      }
    },
  };
});
