/* ==========================================================================
   NETASSET — Shared Application JavaScript
   ========================================================================== */

/* ==========================================================================
   SIDEBAR
   ========================================================================== */

function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");

  if (sidebar) {
    sidebar.classList.toggle("open");
  }
}

/* ==========================================================================
   MODAL
   ========================================================================== */

function openModal(id) {
  const modal = document.getElementById(id);

  if (modal && typeof modal.showModal === "function") {
    modal.showModal();
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);

  if (modal) {
    modal.close();
  }
}

/* ==========================================================================
   TOAST
   ========================================================================== */

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  const text = toast.querySelector(".toast-text");

  if (text) {
    text.textContent = message;
  }

  toast.classList.add("show");

  clearTimeout(showToast._timer);

  showToast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

/* ==========================================================================
   GENERIC TABLE SEARCH
   ========================================================================== */

function wireTableSearch(inputId, tableBodyId, emptyStateId) {
  const input = document.getElementById(inputId);
  const tbody = document.getElementById(tableBodyId);

  if (!input || !tbody) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();

    let visible = 0;

    tbody.querySelectorAll("tr").forEach((row) => {
      const match = row.textContent.toLowerCase().includes(query);

      row.style.display = match ? "" : "none";

      if (match) {
        visible++;
      }
    });

    const empty = document.getElementById(emptyStateId);

    if (empty) {
      empty.style.display = visible === 0 ? "block" : "none";
    }
  });
}

/* ==========================================================================
   GENERIC STATUS FILTER
   ========================================================================== */

function wireStatusFilter(selectId, tableBodyId) {
  const select = document.getElementById(selectId);
  const tbody = document.getElementById(tableBodyId);

  if (!select || !tbody) return;

  select.addEventListener("change", () => {
    const value = select.value;

    tbody.querySelectorAll("tr").forEach((row) => {
      row.style.display =
        value === "all" || row.dataset.status === value ? "" : "none";
    });
  });
}

/* ==========================================================================
   DETAIL TABS
   ========================================================================== */

function wireTabs() {
  document.querySelectorAll(".detail-tabs").forEach((tabBar) => {
    const buttons = tabBar.querySelectorAll(".tab-btn");
    const scope = tabBar.parentElement;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.tab;

        buttons.forEach((btn) => {
          btn.classList.toggle("active", btn === button);
        });

        scope.querySelectorAll("[data-tab-panel]").forEach((panel) => {
          panel.classList.toggle("active", panel.dataset.tabPanel === target);
        });
      });
    });
  });
}

/* ==========================================================================
   ROUTER DATA
   ========================================================================== */

const NETASSET_ROUTER_STORAGE = "netasset.routers.v1";

const defaultRouters = [
  {
    assetCode: "RTR-0001",
    assetName: "Core Router Jakarta-01",
    hostname: "core-jkt-01",
    vendor: "MikroTik",
    model: "CCR1009-7G-1C-1S+",
    serialNumber: "MIK-CCR1009-24001",
    partNumber: "",
    managementIp: "10.10.0.1",
    macAddress: "4C:5E:0C:91:10:01",
    os: "RouterOS",
    osVersion: "7.16.2",
    routerRole: "Core",
    location: "POP Jakarta",
    rack: "Rack-01",
    rackU: "20",
    provider: "NAP-A",
    lifecycleStatus: "active",
    operationalStatus: "up",
    upstream: "",
    downstream: "RTR-0002",
    connectedTo: "RTR-0003",
  },

  {
    assetCode: "RTR-0002",
    assetName: "Distribution Router Jakarta-01",
    hostname: "dist-jkt-01",
    vendor: "Cisco",
    model: "ASR 1001-X",
    serialNumber: "FCZ2451A01X",
    partNumber: "",
    managementIp: "10.10.0.2",
    macAddress: "00:1B:54:AA:10:02",
    os: "IOS XE",
    osVersion: "17.9.4",
    routerRole: "Distribution",
    location: "POP Jakarta",
    rack: "Rack-01",
    rackU: "24",
    provider: "NAP-A",
    lifecycleStatus: "active",
    operationalStatus: "up",
    upstream: "RTR-0001",
    downstream: "RTR-0004",
    connectedTo: "",
  },

  {
    assetCode: "RTR-0003",
    assetName: "Edge Router South Jakarta",
    hostname: "edge-jaksel-01",
    vendor: "Juniper",
    model: "MX204",
    serialNumber: "JNPRMX204-003",
    partNumber: "",
    managementIp: "10.20.0.1",
    macAddress: "2C:6B:F5:20:30:01",
    os: "Junos",
    osVersion: "23.4R1",
    routerRole: "Edge",
    location: "POP Jakarta Selatan",
    rack: "Rack-02",
    rackU: "18",
    provider: "NAP-B",
    lifecycleStatus: "maintenance",
    operationalStatus: "down",
    upstream: "RTR-0001",
    downstream: "",
    connectedTo: "",
  },

  {
    assetCode: "RTR-0004",
    assetName: "CPE Router Maju Jaya",
    hostname: "ce-majujaya-01",
    vendor: "MikroTik",
    model: "CCR2004-1G-12S+2XS",
    serialNumber: "MIK-CCR2004-004",
    partNumber: "",
    managementIp: "10.30.0.10",
    macAddress: "48:8F:5A:30:40:10",
    os: "RouterOS",
    osVersion: "7.15.3",
    routerRole: "CPE",
    location: "POP Jakarta",
    rack: "Rack-03",
    rackU: "10",
    provider: "NAP-A",
    lifecycleStatus: "active",
    operationalStatus: "up",
    upstream: "RTR-0002",
    downstream: "",
    connectedTo: "",
  },

  {
    assetCode: "RTR-0005",
    assetName: "Legacy Router Bandung",
    hostname: "edge-bdg-legacy",
    vendor: "Cisco",
    model: "ISR 4431",
    serialNumber: "FTX1234L001",
    partNumber: "",
    managementIp: "10.40.0.1",
    macAddress: "00:1C:73:40:50:01",
    os: "IOS XE",
    osVersion: "16.12.8",
    routerRole: "Edge",
    location: "POP Bandung",
    rack: "Rack-01",
    rackU: "12",
    provider: "NAP-C",
    lifecycleStatus: "retired",
    operationalStatus: "down",
    upstream: "",
    downstream: "",
    connectedTo: "",
  },
];

/* ==========================================================================
   GET / SAVE ROUTERS
   ========================================================================== */

function getRouters() {
  try {
    const saved = localStorage.getItem(NETASSET_ROUTER_STORAGE);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Unable to read Router storage.", error);
  }

  return defaultRouters.map((router) => ({
    ...router,
  }));
}

function saveRouters(routers) {
  localStorage.setItem(NETASSET_ROUTER_STORAGE, JSON.stringify(routers));
}

/* ==========================================================================
   ROUTER LABELS
   ========================================================================== */

function routerStatusLabel(status) {
  return (
    {
      active: "Active",
      maintenance: "Maintenance",
      retired: "Retired",
      planned: "Planned",
    }[status] || status
  );
}

function operationalLabel(status) {
  return (
    {
      up: "UP",
      down: "DOWN",
      degraded: "Degraded",
    }[status] || status
  );
}

/* ==========================================================================
   ROUTER BADGE
   ========================================================================== */

function routerBadgeClass(status) {
  return (
    {
      active: "badge-active",
      maintenance: "badge-pending",
      retired: "badge-retired",
      planned: "badge-inactive",
    }[status] || "badge-inactive"
  );
}

/* ==========================================================================
   NEXT ROUTER CODE
   ========================================================================== */

function nextRouterCode(routers) {
  const numbers = routers
    .map((router) => Number(String(router.assetCode).replace(/\D/g, "")))
    .filter(Number.isFinite);

  const next = Math.max(0, ...numbers) + 1;

  return `RTR-${String(next).padStart(4, "0")}`;
}

/* ==========================================================================
   ROUTER FORM DATA
   ========================================================================== */

function routerFormData(form) {
  const get = (name) => {
    const field = form.elements[name];

    return field ? field.value.trim() : "";
  };

  return {
    assetCode: get("assetCode"),
    assetName: get("assetName"),
    hostname: get("hostname"),
    vendor: get("vendor"),
    model: get("model"),
    serialNumber: get("serialNumber"),
    partNumber: get("partNumber"),
    managementIp: get("managementIp"),
    macAddress: get("macAddress"),
    os: get("os"),
    osVersion: get("osVersion"),
    routerRole: get("routerRole"),
    location: get("location"),
    rack: get("rack"),
    rackU: get("rackU"),
    provider: get("provider"),
    lifecycleStatus: get("lifecycleStatus"),
    operationalStatus: get("operationalStatus"),
    upstream: get("upstream"),
    downstream: get("downstream"),
    connectedTo: get("connectedTo"),
  };
}

/* ==========================================================================
   SET ROUTER FORM
   ========================================================================== */

function setRouterForm(form, router) {
  Object.entries(router).forEach(([key, value]) => {
    const field = form.elements[key];

    if (field) {
      field.value = value ?? "";
    }
  });
}

/* ==========================================================================
   ROUTER RELATIONSHIP OPTIONS
   ========================================================================== */

function refreshRouterRelationshipOptions(currentCode = "") {
  const routers = getRouters();

  ["upstream", "downstream", "connectedTo"].forEach((name) => {
    const select = document.querySelector(`#routerForm [name="${name}"]`);

    if (!select) return;

    const selected = select.value;

    select.innerHTML =
      '<option value="">+ Select Asset</option>' +
      routers
        .filter((router) => router.assetCode !== currentCode)
        .map(
          (router) =>
            `<option value="${router.assetCode}">
              ${router.assetCode} — ${router.assetName}
            </option>`,
        )
        .join("");

    if ([...select.options].some((option) => option.value === selected)) {
      select.value = selected;
    }
  });
}

/* ==========================================================================
   ROUTER TABLE
   ========================================================================== */

function refreshRouterTable() {
  const tbody = document.getElementById("routerTableBody");

  if (!tbody) return;

  const routers = getRouters();

  const query = (document.getElementById("routerSearch")?.value || "")
    .trim()
    .toLowerCase();

  const status = document.getElementById("routerStatusFilter")?.value || "all";

  const role = document.getElementById("routerRoleFilter")?.value || "all";

  const filtered = routers.filter((router) => {
    const haystack = Object.values(router).join(" ").toLowerCase();

    const matchesQuery = !query || haystack.includes(query);

    const matchesStatus = status === "all" || router.lifecycleStatus === status;

    const matchesRole = role === "all" || router.routerRole === role;

    return matchesQuery && matchesStatus && matchesRole;
  });

  tbody.innerHTML = filtered
    .map(
      (router) => `
        <tr data-status="${router.lifecycleStatus}">

          <td>
            <div class="router-name-cell">

              <div class="asset-type-icon router-icon">
                RT
              </div>

              <div class="router-name-text">

                <a
                  href="router-detail.html?asset=${encodeURIComponent(
                    router.assetCode,
                  )}"
                  class="cell-primary"
                >
                  ${router.assetName}
                </a>

                <span class="router-code-inline">
                  ${router.assetCode}
                </span>

              </div>

            </div>
          </td>

          <td>
            <div class="router-hostname">
              ${router.hostname || "—"}
            </div>

            <div class="cell-muted">
              ${router.routerRole || "—"}
            </div>
          </td>

          <td class="cell-mono">
            ${router.managementIp || "—"}
          </td>

          <td>
            ${router.location || "—"}

            <div class="cell-muted">
              ${router.rack || "—"}
              ${router.rackU ? ` · U${router.rackU}` : ""}
            </div>
          </td>

          <td>
            ${router.provider || "—"}
          </td>

          <td>
            <span
              class="badge ${routerBadgeClass(router.lifecycleStatus)}"
            >
              ${routerStatusLabel(router.lifecycleStatus)}
            </span>
          </td>

          <td>
            <span
              class="router-operational router-operational-${router.operationalStatus}"
            >
              ${operationalLabel(router.operationalStatus)}
            </span>
          </td>

          <td class="row-actions">

            <a
              href="router-detail.html?asset=${encodeURIComponent(
                router.assetCode,
              )}"
              class="icon-btn"
              title="View"
            >
              👁
            </a>

            <button
              class="icon-btn"
              title="Edit"
              onclick="openRouterEdit('${router.assetCode}')"
            >
              ✎
            </button>

          </td>

        </tr>
      `,
    )
    .join("");

  const empty = document.getElementById("routerEmptyState");

  if (empty) {
    empty.style.display = filtered.length ? "none" : "block";
  }

  const total = routers.length;

  const active = routers.filter(
    (router) => router.lifecycleStatus === "active",
  ).length;

  const maintenance = routers.filter(
    (router) => router.lifecycleStatus === "maintenance",
  ).length;

  const retired = routers.filter(
    (router) => router.lifecycleStatus === "retired",
  ).length;

  document.getElementById("routerTotalCount")?.replaceChildren(String(total));

  document.getElementById("routerActiveCount")?.replaceChildren(String(active));

  document
    .getElementById("routerMaintenanceCount")
    ?.replaceChildren(String(maintenance));

  document
    .getElementById("routerRetiredCount")
    ?.replaceChildren(String(retired));

  document
    .getElementById("routerResultCount")
    ?.replaceChildren(`${filtered.length} of ${total} routers`);
}

/* ==========================================================================
   ADD ROUTER
   ========================================================================== */

function openRouterAdd() {
  const form = document.getElementById("routerForm");

  if (!form) return;

  form.reset();

  document.getElementById("routerModalTitle").textContent = "Add Router";

  document.getElementById("routerSubmitLabel").textContent = "Save Router";

  form.elements.assetCode.value = nextRouterCode(getRouters());

  form.dataset.mode = "add";
  form.dataset.originalCode = "";

  refreshRouterRelationshipOptions("");

  openModal("routerModal");
}

/* ==========================================================================
   EDIT ROUTER
   ========================================================================== */

function openRouterEdit(assetCode) {
  const router = getRouters().find((item) => item.assetCode === assetCode);

  const form = document.getElementById("routerForm");

  if (!router || !form) {
    return;
  }

  form.reset();

  setRouterForm(form, router);

  document.getElementById("routerModalTitle").textContent = "Edit Router";

  document.getElementById("routerSubmitLabel").textContent = "Save Changes";

  form.dataset.mode = "edit";
  form.dataset.originalCode = router.assetCode;

  refreshRouterRelationshipOptions(router.assetCode);

  setRouterForm(form, router);

  openModal("routerModal");
}

/* ==========================================================================
   SAVE ROUTER
   ========================================================================== */

function saveRouterFromForm(event) {
  event.preventDefault();

  const form = event.currentTarget;

  const data = routerFormData(form);

  const routers = getRouters();

  const originalCode = form.dataset.originalCode || "";

  if (!data.assetName || !data.hostname || !data.vendor || !data.model) {
    showToast("Lengkapi field Router yang wajib diisi");

    return;
  }

  if (
    routers.some(
      (router) =>
        router.assetCode === data.assetCode &&
        router.assetCode !== originalCode,
    )
  ) {
    showToast("Asset Code sudah digunakan");

    return;
  }

  if (
    data.managementIp &&
    routers.some(
      (router) =>
        router.managementIp === data.managementIp &&
        router.assetCode !== originalCode,
    )
  ) {
    showToast("Management IP sudah digunakan");

    return;
  }

  if (
    data.lifecycleStatus === "retired" &&
    [data.upstream, data.downstream, data.connectedTo].some(Boolean)
  ) {
    showToast("Router retired tidak boleh memiliki relationship aktif");

    return;
  }

  if (form.dataset.mode === "edit") {
    const index = routers.findIndex(
      (router) => router.assetCode === originalCode,
    );

    if (index !== -1) {
      routers[index] = data;
    }
  } else {
    routers.push(data);
  }

  saveRouters(routers);

  closeModal("routerModal");

  refreshRouterTable();

  refreshRouterRelationshipOptions(data.assetCode);

  showToast(
    form.dataset.mode === "edit"
      ? "Router berhasil diperbarui"
      : "Router berhasil ditambahkan",
  );
}

/* ==========================================================================
   RESET ROUTER DEMO DATA
   ========================================================================== */

function resetRouterDemoData() {
  localStorage.removeItem(NETASSET_ROUTER_STORAGE);

  refreshRouterTable();

  showToast("Data Router demo dikembalikan");
}

/* ==========================================================================
   LOAD ROUTER DETAIL
   ========================================================================== */

function loadRouterDetail() {
  const code =
    new URLSearchParams(window.location.search).get("asset") || "RTR-0001";

  const routers = getRouters();

  const router = routers.find((item) => item.assetCode === code) || routers[0];

  if (!router) return;

  function set(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value || "—";
    }
  }

  set("detailAssetCode", router.assetCode);

  set("detailAssetName", router.assetName);

  set("detailHostname", router.hostname);

  set("detailVendor", router.vendor);

  set("detailModel", router.model);

  set("detailSerial", router.serialNumber);

  set("detailPartNumber", router.partNumber);

  set("detailManagementIp", router.managementIp);

  set("detailMac", router.macAddress);

  set("detailOs", router.os);

  set("detailOsVersion", router.osVersion);

  set("detailRouterRole", router.routerRole);

  set("detailLocation", router.location);

  set("detailRack", router.rack);

  set("detailRackU", router.rackU ? `U${router.rackU}` : "—");

  set("detailProvider", router.provider);

  set("detailLifecycle", routerStatusLabel(router.lifecycleStatus));

  set("detailOperational", operationalLabel(router.operationalStatus));

  set("detailUpstream", router.upstream);

  set("detailDownstream", router.downstream);

  set("detailConnectedTo", router.connectedTo);

  set("relUpstream", router.upstream);

  set("relDownstream", router.downstream);

  set("relConnectedTo", router.connectedTo);

  set("topologyCurrentName", router.assetName);

  set("topologyCurrentCode", router.assetCode);

  set("detailBreadcrumbCode", router.assetCode);

  document
    .getElementById("routerDetailTitle")
    ?.replaceChildren(router.assetName);

  document
    .getElementById("routerDetailCode")
    ?.replaceChildren(router.assetCode);

  const lifecycle = document.getElementById("detailLifecycleBadge");

  if (lifecycle) {
    lifecycle.className = `badge ${routerBadgeClass(router.lifecycleStatus)}`;

    lifecycle.textContent = routerStatusLabel(router.lifecycleStatus);
  }

  const operational = document.getElementById("detailOperationalBadge");

  if (operational) {
    operational.className = `router-operational router-operational-${router.operationalStatus}`;

    operational.textContent = operationalLabel(router.operationalStatus);
  }

  const editButton = document.getElementById("editRouterDetailBtn");

  if (editButton) {
    editButton.href = `router.html?edit=${encodeURIComponent(
      router.assetCode,
    )}`;
  }
}

/* ==========================================================================
   SWITCH DATA
   ========================================================================== */

const NETASSET_SWITCH_STORAGE = "netasset.switches.v1";

const defaultSwitches = [
  {
    assetCode: "SW-0001",
    assetName: "Core Switch Jakarta-01",
    hostname: "core-sw-jkt-01",

    vendor: "Cisco",
    model: "Catalyst 9500",

    serialNumber: "FOC1234SW001",
    partNumber: "",

    managementIp: "10.10.10.1",
    macAddress: "00:1B:54:AA:10:01",

    os: "IOS XE",
    osVersion: "17.9.4",

    switchRole: "Core",

    location: "POP Jakarta",
    rack: "Rack-02",
    rackU: "20",

    provider: "NAP-A",

    lifecycleStatus: "active",
    operationalStatus: "up",

    upstream: "RTR-0001",
    downstream: "SW-0002",
    connectedTo: "RTR-0001",
  },

  {
    assetCode: "SW-0002",
    assetName: "Distribution Switch Jakarta-01",
    hostname: "dist-sw-jkt-01",

    vendor: "Cisco",
    model: "Catalyst 9300",

    serialNumber: "FOC1234SW002",
    partNumber: "",

    managementIp: "10.10.20.1",
    macAddress: "00:1B:54:AA:20:01",

    os: "IOS XE",
    osVersion: "17.9.4",

    switchRole: "Distribution",

    location: "POP Jakarta",
    rack: "Rack-02",
    rackU: "24",

    provider: "NAP-A",

    lifecycleStatus: "active",
    operationalStatus: "up",

    upstream: "SW-0001",
    downstream: "SW-0003",
    connectedTo: "",
  },

  {
    assetCode: "SW-0003",
    assetName: "Access Switch Jakarta-01",
    hostname: "access-sw-jkt-01",

    vendor: "Aruba",
    model: "CX 6100",

    serialNumber: "CN1234SW003",
    partNumber: "",

    managementIp: "10.10.30.1",
    macAddress: "88:1D:FC:30:00:01",

    os: "ArubaOS",
    osVersion: "10.13",

    switchRole: "Access",

    location: "POP Jakarta",
    rack: "Rack-03",
    rackU: "12",

    provider: "NAP-A",

    lifecycleStatus: "maintenance",
    operationalStatus: "degraded",

    upstream: "SW-0002",
    downstream: "",
    connectedTo: "",
  },

  {
    assetCode: "SW-0004",
    assetName: "Access Switch Bandung-01",
    hostname: "access-sw-bdg-01",

    vendor: "Huawei",
    model: "S5735",

    serialNumber: "HW1234SW004",
    partNumber: "",

    managementIp: "10.40.10.1",
    macAddress: "00:E0:FC:40:00:01",

    os: "VRP",
    osVersion: "V200R022",

    switchRole: "Access",

    location: "POP Bandung",
    rack: "Rack-01",
    rackU: "10",

    provider: "NAP-C",

    lifecycleStatus: "active",
    operationalStatus: "up",

    upstream: "",
    downstream: "",
    connectedTo: "",
  },

  {
    assetCode: "SW-0005",
    assetName: "Legacy Switch Jakarta",
    hostname: "legacy-sw-jkt-01",

    vendor: "Cisco",
    model: "Catalyst 2960",

    serialNumber: "FOC1234SW005",
    partNumber: "",

    managementIp: "10.50.10.1",
    macAddress: "00:1B:54:50:00:01",

    os: "IOS",
    osVersion: "15.2",

    switchRole: "Access",

    location: "POP Jakarta",
    rack: "Rack-04",
    rackU: "8",

    provider: "NAP-B",

    lifecycleStatus: "retired",
    operationalStatus: "down",

    upstream: "",
    downstream: "",
    connectedTo: "",
  },
];

/* ==========================================================================
   GET / SAVE SWITCHES
   ========================================================================== */

function getSwitches() {
  try {
    const saved = localStorage.getItem(NETASSET_SWITCH_STORAGE);

    if (saved) {
      const parsed = JSON.parse(saved);

      /*
       * Hanya gunakan localStorage
       * apabila memang memiliki data Switch.
       *
       * Kalau kosong / [] → gunakan
       * defaultSwitches.
       */

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Unable to read Switch storage.", error);
  }

  return defaultSwitches.map((item) => ({
    ...item,
  }));
}

function saveSwitches(switches) {
  localStorage.setItem(NETASSET_SWITCH_STORAGE, JSON.stringify(switches));
}

/* ==========================================================================
   SWITCH LABELS
   ========================================================================== */

function switchStatusLabel(status) {
  return (
    {
      active: "Active",
      maintenance: "Maintenance",
      retired: "Retired",
      planned: "Planned",
    }[status] || status
  );
}

function switchOperationalLabel(status) {
  return (
    {
      up: "UP",
      down: "DOWN",
      degraded: "Degraded",
    }[status] || status
  );
}

/* ==========================================================================
   SWITCH BADGE
   ========================================================================== */

function switchBadgeClass(status) {
  return (
    {
      active: "badge-active",
      maintenance: "badge-pending",
      retired: "badge-retired",
      planned: "badge-inactive",
    }[status] || "badge-inactive"
  );
}

/* ==========================================================================
   NEXT SWITCH CODE
   ========================================================================== */

function nextSwitchCode(switches) {
  const numbers = switches
    .map((item) => Number(String(item.assetCode).replace(/\D/g, "")))
    .filter(Number.isFinite);

  const next = Math.max(0, ...numbers) + 1;

  return `SW-${String(next).padStart(4, "0")}`;
}

/* ==========================================================================
   SWITCH FORM DATA
   ========================================================================== */

function switchFormData(form) {
  const get = (name) => {
    const field = form.elements[name];

    return field ? field.value.trim() : "";
  };

  return {
    assetCode: get("assetCode"),
    assetName: get("assetName"),
    hostname: get("hostname"),

    vendor: get("vendor"),
    model: get("model"),

    serialNumber: get("serialNumber"),

    partNumber: get("partNumber"),

    managementIp: get("managementIp"),

    macAddress: get("macAddress"),

    os: get("os"),
    osVersion: get("osVersion"),

    switchRole: get("switchRole"),

    location: get("location"),

    rack: get("rack"),
    rackU: get("rackU"),

    provider: get("provider"),

    lifecycleStatus: get("lifecycleStatus"),

    operationalStatus: get("operationalStatus"),

    upstream: get("upstream"),

    downstream: get("downstream"),

    connectedTo: get("connectedTo"),
  };
}

/* ==========================================================================
   SET SWITCH FORM
   ========================================================================== */

function setSwitchForm(form, item) {
  Object.entries(item).forEach(([key, value]) => {
    const field = form.elements[key];

    if (field) {
      field.value = value ?? "";
    }
  });
}

/* ==========================================================================
   NETWORK ASSET OPTIONS
   Router + Switch
   ========================================================================== */

function getNetworkAssetOptions() {
  const routers =
    typeof getRouters === "function"
      ? getRouters().map((router) => ({
          assetCode: router.assetCode,

          assetName: router.assetName,

          assetType: "Router",
        }))
      : [];

  const switches = getSwitches().map((item) => ({
    assetCode: item.assetCode,

    assetName: item.assetName,

    assetType: "Switch",
  }));

  return [...routers, ...switches];
}

/* ==========================================================================
   SWITCH RELATIONSHIP OPTIONS
   ========================================================================== */

function refreshSwitchRelationshipOptions(currentCode = "") {
  const assets = getNetworkAssetOptions();

  ["upstream", "downstream", "connectedTo"].forEach((name) => {
    const select = document.querySelector(`#switchForm [name="${name}"]`);

    if (!select) return;

    const selected = select.value;

    select.innerHTML =
      '<option value="">+ Select Asset</option>' +
      assets
        .filter((asset) => asset.assetCode !== currentCode)
        .map(
          (asset) =>
            `<option value="${asset.assetCode}">
              ${asset.assetCode} — ${asset.assetName} (${asset.assetType})
            </option>`,
        )
        .join("");

    if ([...select.options].some((option) => option.value === selected)) {
      select.value = selected;
    }
  });
}

/* ==========================================================================
   SWITCH TABLE
   ========================================================================== */

function refreshSwitchTable() {
  const tbody = document.getElementById("switchTableBody");

  if (!tbody) return;

  const switches = getSwitches();

  const query = (document.getElementById("switchSearch")?.value || "")
    .trim()
    .toLowerCase();

  const status = document.getElementById("switchStatusFilter")?.value || "all";

  const role = document.getElementById("switchRoleFilter")?.value || "all";

  const filtered = switches.filter((item) => {
    const haystack = Object.values(item).join(" ").toLowerCase();

    const matchesQuery = !query || haystack.includes(query);

    const matchesStatus = status === "all" || item.lifecycleStatus === status;

    const matchesRole = role === "all" || item.switchRole === role;

    return matchesQuery && matchesStatus && matchesRole;
  });

  tbody.innerHTML = filtered
    .map(
      (item) => `
          <tr data-status="${item.lifecycleStatus}">

            <td>

              <div class="switch-name-cell">

                <div class="asset-type-icon switch-icon">
                  SW
                </div>

                <div class="switch-name-text">

                  <a
                    href="switch-detail.html?asset=${encodeURIComponent(
                      item.assetCode,
                    )}"
                    class="cell-primary"
                  >
                    ${item.assetName}
                  </a>

                  <span class="switch-code-inline">
                    ${item.assetCode}
                  </span>

                </div>

              </div>

            </td>

            <td>

              <div class="switch-hostname">
                ${item.hostname || "—"}
              </div>

              <div class="cell-muted">
                ${item.switchRole || "—"}
              </div>

            </td>

            <td class="cell-mono">
              ${item.managementIp || "—"}
            </td>

            <td>

              ${item.location || "—"}

              <div class="cell-muted">
                ${item.rack || "—"}
                ${item.rackU ? ` · U${item.rackU}` : ""}
              </div>

            </td>

            <td>
              ${item.provider || "—"}
            </td>

            <td>

              <span
                class="badge ${switchBadgeClass(item.lifecycleStatus)}"
              >
                ${switchStatusLabel(item.lifecycleStatus)}
              </span>

            </td>

            <td>

              <span
                class="switch-operational switch-operational-${item.operationalStatus}"
              >
                ${switchOperationalLabel(item.operationalStatus)}
              </span>

            </td>

            <td class="row-actions">

              <a
                href="switch-detail.html?asset=${encodeURIComponent(
                  item.assetCode,
                )}"
                class="icon-btn"
                title="View"
              >
                👁
              </a>

              <button
                class="icon-btn"
                title="Edit"
                onclick="openSwitchEdit('${item.assetCode}')"
              >
                ✎
              </button>

            </td>

          </tr>
        `,
    )
    .join("");

  const empty = document.getElementById("switchEmptyState");

  if (empty) {
    empty.style.display = filtered.length ? "none" : "block";
  }

  const total = switches.length;

  const active = switches.filter(
    (item) => item.lifecycleStatus === "active",
  ).length;

  const maintenance = switches.filter(
    (item) => item.lifecycleStatus === "maintenance",
  ).length;

  const retired = switches.filter(
    (item) => item.lifecycleStatus === "retired",
  ).length;

  document.getElementById("switchTotalCount")?.replaceChildren(String(total));

  document.getElementById("switchActiveCount")?.replaceChildren(String(active));

  document
    .getElementById("switchMaintenanceCount")
    ?.replaceChildren(String(maintenance));

  document
    .getElementById("switchRetiredCount")
    ?.replaceChildren(String(retired));

  document
    .getElementById("switchResultCount")
    ?.replaceChildren(`${filtered.length} of ${total} switches`);
}

/* ==========================================================================
   ADD SWITCH
   ========================================================================== */

function openSwitchAdd() {
  const form = document.getElementById("switchForm");

  if (!form) return;

  form.reset();

  document.getElementById("switchModalTitle").textContent = "Add Switch";

  document.getElementById("switchSubmitLabel").textContent = "Save Switch";

  form.elements.assetCode.value = nextSwitchCode(getSwitches());

  form.dataset.mode = "add";

  form.dataset.originalCode = "";

  refreshSwitchRelationshipOptions("");

  openModal("switchModal");
}

/* ==========================================================================
   EDIT SWITCH
   ========================================================================== */

function openSwitchEdit(assetCode) {
  const item = getSwitches().find(
    (switchItem) => switchItem.assetCode === assetCode,
  );

  const form = document.getElementById("switchForm");

  if (!item || !form) {
    return;
  }

  form.reset();

  form.dataset.mode = "edit";

  form.dataset.originalCode = item.assetCode;

  refreshSwitchRelationshipOptions(item.assetCode);

  setSwitchForm(form, item);

  document.getElementById("switchModalTitle").textContent = "Edit Switch";

  document.getElementById("switchSubmitLabel").textContent = "Save Changes";

  openModal("switchModal");
}

/* ==========================================================================
   SAVE SWITCH
   ========================================================================== */

function saveSwitchFromForm(event) {
  event.preventDefault();

  const form = event.currentTarget;

  const data = switchFormData(form);

  const switches = getSwitches();

  const originalCode = form.dataset.originalCode || "";

  /* REQUIRED */

  if (
    !data.assetName ||
    !data.hostname ||
    !data.vendor ||
    !data.model ||
    !data.switchRole
  ) {
    showToast("Lengkapi field Switch yang wajib diisi");

    return;
  }

  /* UNIQUE ASSET CODE */

  if (
    switches.some(
      (item) =>
        item.assetCode === data.assetCode && item.assetCode !== originalCode,
    )
  ) {
    showToast("Asset Code sudah digunakan");

    return;
  }

  /* UNIQUE MANAGEMENT IP */

  const routerIpConflict =
    typeof getRouters === "function"
      ? getRouters().some(
          (router) =>
            data.managementIp && router.managementIp === data.managementIp,
        )
      : false;

  const switchIpConflict = switches.some(
    (item) =>
      data.managementIp &&
      item.managementIp === data.managementIp &&
      item.assetCode !== originalCode,
  );

  if (routerIpConflict || switchIpConflict) {
    showToast("Management IP sudah digunakan");

    return;
  }

  /* RETIRED VALIDATION */

  if (
    data.lifecycleStatus === "retired" &&
    [data.upstream, data.downstream, data.connectedTo].some(Boolean)
  ) {
    showToast("Switch retired tidak boleh memiliki relationship aktif");

    return;
  }

  /* SAVE */

  if (form.dataset.mode === "edit") {
    const index = switches.findIndex((item) => item.assetCode === originalCode);

    if (index !== -1) {
      switches[index] = data;
    }
  } else {
    switches.push(data);
  }

  saveSwitches(switches);

  closeModal("switchModal");

  refreshSwitchTable();

  showToast(
    form.dataset.mode === "edit"
      ? "Switch berhasil diperbarui"
      : "Switch berhasil ditambahkan",
  );
}

/* ==========================================================================
   RESET SWITCH DEMO DATA
   ========================================================================== */

function resetSwitchDemoData() {
  localStorage.removeItem(NETASSET_SWITCH_STORAGE);

  refreshSwitchTable();

  showToast("Data Switch demo dikembalikan");
}

/* ==========================================================================
   LOAD SWITCH DETAIL
   ========================================================================== */

function loadSwitchDetail() {
  const code =
    new URLSearchParams(window.location.search).get("asset") || "SW-0001";

  const switches = getSwitches();

  const item =
    switches.find((switchItem) => switchItem.assetCode === code) || switches[0];

  if (!item) return;

  function set(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value || "—";
    }
  }

  /* BASIC */

  set("switchDetailAssetCode", item.assetCode);

  set("switchDetailAssetName", item.assetName);

  set("switchDetailHostname", item.hostname);

  set("switchDetailVendor", item.vendor);

  set("switchDetailModel", item.model);

  set("switchDetailSerial", item.serialNumber);

  set("switchDetailPartNumber", item.partNumber);

  /* NETWORK */

  set("switchDetailManagementIp", item.managementIp);

  set("switchDetailMac", item.macAddress);

  set("switchDetailOs", item.os);

  set("switchDetailOsVersion", item.osVersion);

  /* SWITCH */

  set("switchDetailRole", item.switchRole);

  /* LOCATION */

  set("switchDetailLocation", item.location);

  set("switchDetailRack", item.rack);

  set("switchDetailRackU", item.rackU ? `U${item.rackU}` : "—");

  /* PROVIDER */

  set("switchDetailProvider", item.provider);

  /* STATUS */

  set("switchDetailLifecycle", switchStatusLabel(item.lifecycleStatus));

  set(
    "switchDetailOperational",
    switchOperationalLabel(item.operationalStatus),
  );

  /* RELATIONSHIPS */

  set("switchDetailUpstream", item.upstream);

  set("switchDetailDownstream", item.downstream);

  set("switchRelUpstream", item.upstream);

  set("switchRelDownstream", item.downstream);

  set("switchRelConnectedTo", item.connectedTo);

  /* TOPOLOGY */

  set("switchTopologyCurrentName", item.assetName);

  set("switchTopologyCurrentCode", item.assetCode);

  set("switchDetailBreadcrumbCode", item.assetCode);

  /* HEADER */

  document.getElementById("switchDetailTitle")?.replaceChildren(item.assetName);

  document.getElementById("switchDetailCode")?.replaceChildren(item.assetCode);

  /* LIFECYCLE BADGE */

  const lifecycle = document.getElementById("switchDetailLifecycleBadge");

  if (lifecycle) {
    lifecycle.className = `badge ${switchBadgeClass(item.lifecycleStatus)}`;

    lifecycle.textContent = switchStatusLabel(item.lifecycleStatus);
  }

  /* OPERATIONAL BADGE */

  const operational = document.getElementById("switchDetailOperationalBadge");

  if (operational) {
    operational.className = `switch-operational switch-operational-${item.operationalStatus}`;

    operational.textContent = switchOperationalLabel(item.operationalStatus);
  }

  /* EDIT BUTTON */

  const editButton = document.getElementById("editSwitchDetailBtn");

  if (editButton) {
    editButton.href = `switch.html?edit=${encodeURIComponent(item.assetCode)}`;
  }
}

/* ==========================================================================
   SWITCH INIT
   ========================================================================== */

function initSwitchPage() {
  const table = document.getElementById("switchTableBody");

  /* SWITCH LIST */

  if (table) {
    document
      .getElementById("switchSearch")
      ?.addEventListener("input", refreshSwitchTable);

    document
      .getElementById("switchStatusFilter")
      ?.addEventListener("change", refreshSwitchTable);

    document
      .getElementById("switchRoleFilter")
      ?.addEventListener("change", refreshSwitchTable);

    refreshSwitchTable();
  }

  /* SWITCH DETAIL */

  if (document.getElementById("switchDetailTitle")) {
    loadSwitchDetail();
  }

  /* EDIT FROM URL */

  const editCode = new URLSearchParams(window.location.search).get("edit");

  if (editCode && document.getElementById("switchForm")) {
    setTimeout(() => {
      openSwitchEdit(editCode);
    }, 0);
  }
}

/* ==========================================================================
   DOCUMENT READY
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================================
     DETAIL TABS
     ======================================================================== */

  wireTabs();

  /* ========================================================================
     ROUTER LIST
     ======================================================================== */

  if (document.getElementById("routerTableBody")) {
    const search = document.getElementById("routerSearch");

    const status = document.getElementById("routerStatusFilter");

    const role = document.getElementById("routerRoleFilter");

    search?.addEventListener("input", refreshRouterTable);

    status?.addEventListener("change", refreshRouterTable);

    role?.addEventListener("change", refreshRouterTable);

    refreshRouterTable();
  }

  /* ========================================================================
     ROUTER DETAIL
     ======================================================================== */

  if (document.getElementById("routerDetailTitle")) {
    loadRouterDetail();
  }

  /* ========================================================================
     SWITCH
     ======================================================================== */

  initSwitchPage();

  /* ========================================================================
     SERVER
     ======================================================================== */

  initServerPage();

  initServerTabs();

  initServerModalDismiss();
});

/* ==========================================================================
   NETASSET — SERVER MODULE
   ========================================================================== */

/* ==========================================================================
   SERVER STORAGE
   ========================================================================== */

const SERVER_STORAGE_KEY = "netasset_servers";

/* ==========================================================================
   SERVER DEMO DATA
   ========================================================================== */

const SERVER_DEMO_DATA = [
  {
    assetCode: "SRV-0001",
    assetName: "Core Application Server Jakarta-01",
    hostname: "app-jkt-01",
    vendor: "Dell",
    model: "PowerEdge R750",
    serialNumber: "DL-R750-001",

    cpu: "Intel Xeon Gold 6338",
    cpuCores: 32,
    ram: "128 GB",
    storage: "3.84 TB",
    raid: "RAID 10",

    os: "Ubuntu Server",
    osVersion: "24.04 LTS",

    managementIp: "10.10.100.10",

    location: "POP Jakarta",
    rack: "Rack-05",
    rackU: 20,

    provider: "NAP-A",

    lifecycleStatus: "active",
    operationalStatus: "up",

    hostedVm: "VM-0001",
    connectedTo: "SW-0001",
    storageRelation: "STG-0001",
    network: "VLAN-100",

    createdAt: "2026-07-18 09:32",
    updatedAt: "2026-08-10 14:20",
  },

  {
    assetCode: "SRV-0002",
    assetName: "Database Server Jakarta-01",
    hostname: "db-jkt-01",
    vendor: "HPE",
    model: "ProLiant DL380 Gen10",
    serialNumber: "HP-DL380-001",

    cpu: "Intel Xeon Silver 4214",
    cpuCores: 24,
    ram: "64 GB",
    storage: "2 TB",
    raid: "RAID 10",

    os: "Ubuntu Server",
    osVersion: "22.04 LTS",

    managementIp: "10.10.100.11",

    location: "POP Jakarta",
    rack: "Rack-05",
    rackU: 22,

    provider: "NAP-A",

    lifecycleStatus: "active",
    operationalStatus: "up",

    hostedVm: "VM-0002",
    connectedTo: "SW-0001",
    storageRelation: "STG-0002",
    network: "VLAN-100",

    createdAt: "2026-07-19 10:15",
    updatedAt: "2026-08-09 13:05",
  },

  {
    assetCode: "SRV-0003",
    assetName: "Virtualization Server Jakarta-01",
    hostname: "virt-jkt-01",
    vendor: "Dell",
    model: "PowerEdge R740",
    serialNumber: "DL-R740-001",

    cpu: "Intel Xeon Gold 6248R",
    cpuCores: 40,
    ram: "256 GB",
    storage: "7.68 TB",
    raid: "RAID 10",

    os: "VMware ESXi",
    osVersion: "8.0",

    managementIp: "10.10.100.12",

    location: "Data Center Jakarta",
    rack: "Rack-06",
    rackU: 18,

    provider: "NAP-B",

    lifecycleStatus: "active",
    operationalStatus: "up",

    hostedVm: "VM-0003",
    connectedTo: "SW-0002",
    storageRelation: "STG-0003",
    network: "VLAN-200",

    createdAt: "2026-07-20 08:45",
    updatedAt: "2026-08-08 16:12",
  },

  {
    assetCode: "SRV-0004",
    assetName: "Backup Server Bandung-01",
    hostname: "backup-bdg-01",
    vendor: "Lenovo",
    model: "ThinkSystem SR650",
    serialNumber: "LN-SR650-001",

    cpu: "Intel Xeon Silver 4310",
    cpuCores: 24,
    ram: "128 GB",
    storage: "12 TB",
    raid: "RAID 6",

    os: "Ubuntu Server",
    osVersion: "24.04 LTS",

    managementIp: "10.20.100.10",

    location: "POP Bandung",
    rack: "Rack-03",
    rackU: 14,

    provider: "NAP-B",

    lifecycleStatus: "maintenance",
    operationalStatus: "degraded",

    hostedVm: "",
    connectedTo: "SW-0003",
    storageRelation: "STG-0004",
    network: "VLAN-300",

    createdAt: "2026-07-22 11:20",
    updatedAt: "2026-08-11 08:05",
  },

  {
    assetCode: "SRV-0005",
    assetName: "Legacy Server Jakarta",
    hostname: "legacy-jkt-01",
    vendor: "HPE",
    model: "ProLiant DL360 Gen8",
    serialNumber: "HP-DL360-001",

    cpu: "Intel Xeon E5-2620",
    cpuCores: 8,
    ram: "32 GB",
    storage: "1 TB",
    raid: "RAID 5",

    os: "Ubuntu Server",
    osVersion: "18.04 LTS",

    managementIp: "10.10.100.20",

    location: "POP Jakarta",
    rack: "Rack-02",
    rackU: 30,

    provider: "NAP-A",

    lifecycleStatus: "retired",
    operationalStatus: "down",

    hostedVm: "",
    connectedTo: "",
    storageRelation: "",
    network: "",

    createdAt: "2024-03-12 10:30",
    updatedAt: "2026-07-01 17:45",
  },
];

/* ==========================================================================
   SERVER HELPERS
   ========================================================================== */

/**
 * Escape HTML so user-entered values do not break the table markup.
 */
function escapeServerHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Get servers from localStorage.
 */
function getServers() {
  try {
    const raw = localStorage.getItem(SERVER_STORAGE_KEY);

    if (!raw) {
      const initial = structuredClone(SERVER_DEMO_DATA);

      localStorage.setItem(SERVER_STORAGE_KEY, JSON.stringify(initial));

      return initial;
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : structuredClone(SERVER_DEMO_DATA);
  } catch (error) {
    console.error("Failed to load servers:", error);

    return structuredClone(SERVER_DEMO_DATA);
  }
}

/**
 * Save servers to localStorage.
 */
function saveServers(servers) {
  localStorage.setItem(SERVER_STORAGE_KEY, JSON.stringify(servers));
}

/**
 * Generate next server asset code.
 */
function generateServerAssetCode() {
  const servers = getServers();

  let maxNumber = 0;

  servers.forEach((server) => {
    const match = String(server.assetCode || "").match(/^SRV-(\d+)$/i);

    if (match) {
      const number = Number(match[1]);

      if (number > maxNumber) {
        maxNumber = number;
      }
    }
  });

  return "SRV-" + String(maxNumber + 1).padStart(4, "0");
}

/**
 * Convert lifecycle value into display label.
 */
function getServerLifecycleLabel(status) {
  const labels = {
    active: "Active",

    maintenance: "Maintenance",

    retired: "Retired",

    planned: "Planned",
  };

  return labels[status] || status || "-";
}

/**
 * Convert operational value into display label.
 */
function getServerOperationalLabel(status) {
  const labels = {
    up: "UP",

    degraded: "Degraded",

    down: "DOWN",
  };

  return labels[status] || status || "-";
}

/**
 * Return badge class for lifecycle.
 */
function getServerLifecycleBadgeClass(status) {
  switch (status) {
    case "active":
      return "badge-active";

    case "maintenance":
      return "badge-warning";

    case "retired":
      return "badge-inactive";

    case "planned":
      return "badge-neutral";

    default:
      return "badge-neutral";
  }
}

/**
 * Return operational class.
 */
function getServerOperationalClass(status) {
  switch (status) {
    case "up":
      return "server-operational-up";

    case "degraded":
      return "server-operational-degraded";

    case "down":
      return "server-operational-down";

    default:
      return "";
  }
}

/* ==========================================================================
   SERVER TABLE
   ========================================================================== */

/**
 * Render server table.
 */
function renderServerTable() {
  const tbody = document.getElementById("serverTableBody");

  if (!tbody) {
    return;
  }

  const searchInput = document.getElementById("serverSearch");

  const statusFilter = document.getElementById("serverStatusFilter");

  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const status = statusFilter ? statusFilter.value : "all";

  const servers = getServers();

  const filtered = servers.filter((server) => {
    const searchable = [
      server.assetCode,
      server.assetName,
      server.hostname,
      server.vendor,
      server.model,
      server.serialNumber,
      server.managementIp,
      server.location,
      server.rack,
      server.provider,
      server.cpu,
      server.os,
      server.osVersion,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || searchable.includes(query);

    const matchesStatus = status === "all" || server.lifecycleStatus === status;

    return matchesSearch && matchesStatus;
  });

  tbody.innerHTML = filtered.map((server) => renderServerRow(server)).join("");

  const emptyState = document.getElementById("serverEmptyState");

  if (emptyState) {
    emptyState.style.display = filtered.length === 0 ? "block" : "none";
  }

  updateServerTableCount(filtered.length, servers.length);

  updateServerStats(servers);
}

/**
 * Render one table row.
 */
function renderServerRow(server) {
  const lifecycleLabel = getServerLifecycleLabel(server.lifecycleStatus);

  const lifecycleClass = getServerLifecycleBadgeClass(server.lifecycleStatus);

  const operationalLabel = getServerOperationalLabel(server.operationalStatus);

  const operationalClass = getServerOperationalClass(server.operationalStatus);

  return `
    <tr
      data-status="${escapeServerHtml(server.lifecycleStatus)}"
      data-code="${escapeServerHtml(server.assetCode)}"
    >

      <td>

        <div class="server-name-cell">

          <div class="asset-type-icon server-icon">
            SV
          </div>

          <div class="server-name-text">

            <a
              href="server-detail.html?code=${encodeURIComponent(
                server.assetCode,
              )}"
              class="cell-primary"
            >
              ${escapeServerHtml(server.assetName)}
            </a>

            <span class="server-code-inline">
              ${escapeServerHtml(server.assetCode)}
            </span>

          </div>

        </div>

      </td>


      <td>

        <div class="server-name-text">

          <span class="server-hostname">
            ${escapeServerHtml(server.hostname)}
          </span>

          <span class="cell-muted">
            ${escapeServerHtml(server.vendor)}
            ·
            ${escapeServerHtml(server.model)}
          </span>

        </div>

      </td>


      <td>

        <span class="cell-mono">
          ${escapeServerHtml(server.managementIp || "—")}
        </span>

      </td>


      <td>

        <div class="server-name-text">

          <span class="cell-primary">
            ${escapeServerHtml(server.location || "—")}
          </span>

          <span class="cell-muted">
            ${server.rack ? escapeServerHtml(server.rack) : "—"}
            ${server.rackU ? ` · U${escapeServerHtml(server.rackU)}` : ""}
          </span>

        </div>

      </td>


      <td>

        <div class="server-name-text">

          <span class="cell-primary">
            ${escapeServerHtml(server.cpu)}
          </span>

          <span class="cell-muted">
            ${escapeServerHtml(server.cpuCores)}
            Core
            ·
            ${escapeServerHtml(server.ram)}
          </span>

        </div>

      </td>


      <td>

        <span
          class="badge ${lifecycleClass}"
        >
          ${lifecycleLabel}
        </span>

      </td>


      <td>

        <span
          class="server-operational ${operationalClass}"
        >
          ${operationalLabel}
        </span>

      </td>


      <td class="row-actions">

        <a
          href="server-detail.html?code=${encodeURIComponent(server.assetCode)}"
          class="icon-btn"
          title="View"
        >
          👁
        </a>


        <button
          type="button"
          class="icon-btn"
          title="Edit"
          onclick="openServerEdit('${escapeServerHtml(server.assetCode)}')"
        >
          ✎
        </button>

      </td>

    </tr>
  `;
}

/**
 * Update table result count.
 */
function updateServerTableCount(visible, total) {
  const result = document.getElementById("serverResultCount");

  const footer = document.getElementById("serverFooterCount");

  if (result) {
    result.textContent = `${visible} of ${total} servers`;
  }

  if (footer) {
    footer.textContent = `${visible} shown`;
  }
}

/* ==========================================================================
   SERVER STATISTICS
   ========================================================================== */

function updateServerStats(servers) {
  const total = servers.length;

  const active = servers.filter(
    (server) => server.lifecycleStatus === "active",
  ).length;

  const maintenance = servers.filter(
    (server) => server.lifecycleStatus === "maintenance",
  ).length;

  const retired = servers.filter(
    (server) => server.lifecycleStatus === "retired",
  ).length;

  const totalElement = document.getElementById("serverTotalCount");

  const activeElement = document.getElementById("serverActiveCount");

  const maintenanceElement = document.getElementById("serverMaintenanceCount");

  const retiredElement = document.getElementById("serverRetiredCount");

  if (totalElement) {
    totalElement.textContent = total;
  }

  if (activeElement) {
    activeElement.textContent = active;
  }

  if (maintenanceElement) {
    maintenanceElement.textContent = maintenance;
  }

  if (retiredElement) {
    retiredElement.textContent = retired;
  }
}

/* ==========================================================================
   SERVER FORM
   ========================================================================== */

/**
 * Open Add Server modal.
 */
function openServerAdd() {
  const modal = document.getElementById("serverModal");

  const form = document.getElementById("serverForm");

  if (!modal || !form) {
    return;
  }

  form.reset();

  const code = form.elements.assetCode;

  if (code) {
    code.value = generateServerAssetCode();
  }

  const title = document.getElementById("serverModalTitle");

  if (title) {
    title.textContent = "Add Server";
  }

  const submitLabel = document.getElementById("serverSubmitLabel");

  if (submitLabel) {
    submitLabel.textContent = "Save Server";
  }

  delete form.dataset.editingCode;

  refreshServerRelationshipOptions();

  modal.showModal();
}

/**
 * Open Edit Server modal.
 */
function openServerEdit(assetCode) {
  console.log("EDIT CLICKED:", assetCode);

  const modal = document.getElementById("serverModal");
  const form = document.getElementById("serverForm");

  console.log("Modal:", modal);
  console.log("Form:", form);

  if (!modal) {
    console.error("ERROR: #serverModal tidak ditemukan");
    alert("ERROR: serverModal tidak ditemukan");
    return;
  }

  if (!form) {
    console.error("ERROR: #serverForm tidak ditemukan");
    alert("ERROR: serverForm tidak ditemukan");
    return;
  }

  const servers = getServers();

  console.log("Servers:", servers);

  const server = servers.find((item) => item.assetCode === assetCode);

  console.log("Server yang dipilih:", server);

  if (!server) {
    console.error("ERROR: Server tidak ditemukan:", assetCode);
    alert(`Server ${assetCode} tidak ditemukan`);
    return;
  }

  form.reset();

  form.dataset.editingCode = assetCode;

  const title = document.getElementById("serverModalTitle");

  if (title) {
    title.textContent = "Edit Server";
  }

  const submitLabel = document.getElementById("serverSubmitLabel");

  if (submitLabel) {
    submitLabel.textContent = "Save Changes";
  }

  fillServerForm(form, server);

  refreshServerRelationshipOptions(assetCode);

  setTimeout(() => {
    setFormValue(form, "hostedVm", server.hostedVm);
    setFormValue(form, "connectedTo", server.connectedTo);
    setFormValue(form, "storageRelation", server.storageRelation);
    setFormValue(form, "network", server.network);
  }, 0);

  console.log("Membuka modal...");

  modal.showModal();

  console.log("Modal berhasil dibuka:", modal.open);
}

/**
 * Fill server form from object.
 */
function fillServerForm(form, server) {
  setFormValue(form, "assetCode", server.assetCode);

  setFormValue(form, "assetName", server.assetName);

  setFormValue(form, "hostname", server.hostname);

  setFormValue(form, "vendor", server.vendor);

  setFormValue(form, "model", server.model);

  setFormValue(form, "serialNumber", server.serialNumber);

  setFormValue(form, "cpu", server.cpu);

  setFormValue(form, "cpuCores", server.cpuCores);

  setFormValue(form, "ram", server.ram);

  setFormValue(form, "storage", server.storage);

  setFormValue(form, "raid", server.raid);

  setFormValue(form, "os", server.os);

  setFormValue(form, "osVersion", server.osVersion);

  setFormValue(form, "managementIp", server.managementIp);

  setFormValue(form, "location", server.location);

  setFormValue(form, "rack", server.rack);

  setFormValue(form, "rackU", server.rackU);

  setFormValue(form, "provider", server.provider);

  setFormValue(form, "lifecycleStatus", server.lifecycleStatus);

  setFormValue(form, "operationalStatus", server.operationalStatus);
}

/**
 * Safely set form value.
 */
function setFormValue(form, name, value) {
  const field = form.elements[name];

  if (!field) {
    return;
  }

  field.value = value === null || value === undefined ? "" : value;
}

/* ==========================================================================
   SERVER RELATIONSHIPS
   ========================================================================== */

/**
 * Populate relationship dropdowns.
 */
function refreshServerRelationshipOptions(currentCode = "") {
  const form = document.getElementById("serverForm");

  if (!form) {
    return;
  }

  /*
   * --------------------------------------------------------------
   * CONNECTED TO
   * --------------------------------------------------------------
   *
   * Context-aware:
   * Server dapat terhubung ke server,
   * switch, atau router.
   */

  const connectedTo = form.elements.connectedTo;

  if (connectedTo) {
    const previousValue = connectedTo.value;

    const assets = [
      {
        code: "RTR-0001",
        name: "Core Router Jakarta",
        type: "Router",
      },

      {
        code: "RTR-0002",
        name: "Edge Router Jakarta",
        type: "Router",
      },

      {
        code: "SW-0001",
        name: "Core Switch Jakarta-01",
        type: "Switch",
      },

      {
        code: "SW-0002",
        name: "Distribution Switch Jakarta-01",
        type: "Switch",
      },

      {
        code: "SW-0003",
        name: "Access Switch Bandung-01",
        type: "Switch",
      },
    ];

    getServers().forEach((server) => {
      if (server.assetCode !== currentCode) {
        assets.push({
          code: server.assetCode,

          name: server.assetName,

          type: "Server",
        });
      }
    });

    connectedTo.innerHTML = `
        <option value="">
          + Select Asset
        </option>

        ${assets
          .map(
            (asset) =>
              `
                  <option
                    value="${escapeServerHtml(asset.code)}"
                  >
                    ${escapeServerHtml(asset.code)}
                    —
                    ${escapeServerHtml(asset.name)}
                    (${escapeServerHtml(asset.type)})
                  </option>
                `,
          )
          .join("")}
      `;

    if (
      previousValue &&
      [...connectedTo.options].some((option) => option.value === previousValue)
    ) {
      connectedTo.value = previousValue;
    }
  }

  /*
   * --------------------------------------------------------------
   * HOSTED VM
   * --------------------------------------------------------------
   */

  const hostedVm = form.elements.hostedVm;

  if (hostedVm) {
    const previousValue = hostedVm.value;

    hostedVm.innerHTML = `
        <option value="">
          + Select VM
        </option>

        <option value="VM-0001">
          VM-0001 — Application VM
        </option>

        <option value="VM-0002">
          VM-0002 — Database VM
        </option>

        <option value="VM-0003">
          VM-0003 — Monitoring VM
        </option>

        <option value="VM-0004">
          VM-0004 — Customer Portal VM
        </option>
      `;

    if (
      [...hostedVm.options].some((option) => option.value === previousValue)
    ) {
      hostedVm.value = previousValue;
    }
  }

  /*
   * --------------------------------------------------------------
   * STORAGE
   * --------------------------------------------------------------
   */

  const storage = form.elements.storageRelation;

  if (storage) {
    const previousValue = storage.value;

    storage.innerHTML = `
        <option value="">
          + Select Storage
        </option>

        <option value="STG-0001">
          STG-0001 — Primary Storage
        </option>

        <option value="STG-0002">
          STG-0002 — Database Storage
        </option>

        <option value="STG-0003">
          STG-0003 — VM Storage
        </option>

        <option value="STG-0004">
          STG-0004 — Backup Storage
        </option>
      `;

    if ([...storage.options].some((option) => option.value === previousValue)) {
      storage.value = previousValue;
    }
  }

  /*
   * --------------------------------------------------------------
   * NETWORK
   * --------------------------------------------------------------
   */

  const network = form.elements.network;

  if (network) {
    const previousValue = network.value;

    network.innerHTML = `
        <option value="">
          + Select Network
        </option>

        <option value="VLAN-100">
          VLAN-100 — Server Network
        </option>

        <option value="VLAN-200">
          VLAN-200 — Virtualization Network
        </option>

        <option value="VLAN-300">
          VLAN-300 — Backup Network
        </option>
      `;

    if ([...network.options].some((option) => option.value === previousValue)) {
      network.value = previousValue;
    }
  }
}

/* ==========================================================================
   SERVER VALIDATION
   ========================================================================== */

/**
 * Validate server form.
 */
function validateServerForm(data, editingCode = "") {
  const errors = [];

  /*
   * --------------------------------------------------------------
   * REQUIRED BASIC INFORMATION
   * --------------------------------------------------------------
   */

  if (!data.assetName.trim()) {
    errors.push("Asset Name wajib diisi.");
  }

  if (!data.hostname.trim()) {
    errors.push("Hostname wajib diisi.");
  }

  if (!data.vendor.trim()) {
    errors.push("Vendor wajib diisi.");
  }

  if (!data.model.trim()) {
    errors.push("Model wajib diisi.");
  }

  /*
   * --------------------------------------------------------------
   * COMPUTE
   * --------------------------------------------------------------
   */

  if (!data.cpu.trim()) {
    errors.push("CPU wajib diisi.");
  }

  if (!data.cpuCores || Number(data.cpuCores) <= 0) {
    errors.push("CPU Core harus lebih dari 0.");
  }

  if (!data.ram.trim()) {
    errors.push("RAM wajib diisi.");
  }

  if (!data.storage.trim()) {
    errors.push("Storage wajib diisi.");
  }

  /*
   * --------------------------------------------------------------
   * MANAGEMENT IP
   * --------------------------------------------------------------
   */

  if (data.managementIp.trim()) {
    const ipPattern =
      /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

    if (!ipPattern.test(data.managementIp.trim())) {
      errors.push("Management IP tidak valid.");
    }
  }

  /*
   * --------------------------------------------------------------
   * UNIQUE MANAGEMENT IP
   * --------------------------------------------------------------
   */

  if (data.managementIp.trim()) {
    const servers = getServers();

    const duplicateIp = servers.some((server) => {
      return (
        server.assetCode !== editingCode &&
        server.managementIp?.trim().toLowerCase() ===
          data.managementIp.trim().toLowerCase()
      );
    });

    if (duplicateIp) {
      errors.push("Management IP sudah digunakan oleh server lain.");
    }
  }

  /*
   * --------------------------------------------------------------
   * SERIAL NUMBER UNIQUE
   * --------------------------------------------------------------
   */

  if (data.serialNumber.trim()) {
    const servers = getServers();

    const duplicateSerial = servers.some((server) => {
      return (
        server.assetCode !== editingCode &&
        server.serialNumber?.trim().toLowerCase() ===
          data.serialNumber.trim().toLowerCase()
      );
    });

    if (duplicateSerial) {
      errors.push("Serial Number sudah digunakan oleh server lain.");
    }
  }

  /*
   * --------------------------------------------------------------
   * RETIRED RULE
   * --------------------------------------------------------------
   *
   * Retired server tidak boleh memiliki
   * active relationships / assignment.
   */

  if (data.lifecycleStatus === "retired") {
    if (
      data.hostedVm ||
      data.connectedTo ||
      data.storageRelation ||
      data.network
    ) {
      errors.push("Server Retired tidak boleh memiliki relationship aktif.");
    }
  }

  return errors;
}

/* ==========================================================================
   SERVER SAVE
   ========================================================================== */

/**
 * Save Add/Edit Server.
 */
function saveServerFromForm(event) {
  event.preventDefault();

  const form = document.getElementById("serverForm");

  if (!form) {
    return;
  }

  const formData = new FormData(form);

  const editingCode = form.dataset.editingCode || "";

  const data = {
    assetCode: formData.get("assetCode") || generateServerAssetCode(),

    assetName: formData.get("assetName")?.trim() || "",

    hostname: formData.get("hostname")?.trim() || "",

    vendor: formData.get("vendor")?.trim() || "",

    model: formData.get("model")?.trim() || "",

    serialNumber: formData.get("serialNumber")?.trim() || "",

    cpu: formData.get("cpu")?.trim() || "",

    cpuCores: Number(formData.get("cpuCores") || 0),

    ram: formData.get("ram")?.trim() || "",

    storage: formData.get("storage")?.trim() || "",

    raid: formData.get("raid") || "",

    os: formData.get("os")?.trim() || "",

    osVersion: formData.get("osVersion")?.trim() || "",

    managementIp: formData.get("managementIp")?.trim() || "",

    location: formData.get("location") || "",

    rack: formData.get("rack") || "",

    rackU: Number(formData.get("rackU") || 0),

    provider: formData.get("provider") || "",

    lifecycleStatus: formData.get("lifecycleStatus") || "active",

    operationalStatus: formData.get("operationalStatus") || "up",

    hostedVm: formData.get("hostedVm") || "",

    connectedTo: formData.get("connectedTo") || "",

    storageRelation: formData.get("storageRelation") || "",

    network: formData.get("network") || "",
  };

  /*
   * Validation
   */

  const errors = validateServerForm(data, editingCode);

  if (errors.length > 0) {
    showToast(errors[0]);

    console.warn("Server validation errors:", errors);

    return;
  }

  const servers = getServers();

  /*
   * --------------------------------------------------------------
   * EDIT
   * --------------------------------------------------------------
   */

  if (editingCode) {
    const index = servers.findIndex(
      (server) => server.assetCode === editingCode,
    );

    if (index === -1) {
      showToast("Server tidak ditemukan.");

      return;
    }

    data.assetCode = editingCode;

    data.createdAt = servers[index].createdAt;

    data.updatedAt = getServerTimestamp();

    servers[index] = data;

    saveServers(servers);

    closeModal("serverModal");

    renderServerTable();

    showToast("Server berhasil diperbarui.");

    return;
  }

  /*
   * --------------------------------------------------------------
   * ADD
   * --------------------------------------------------------------
   */

  data.assetCode = generateServerAssetCode();

  data.createdAt = getServerTimestamp();

  data.updatedAt = data.createdAt;

  servers.push(data);

  saveServers(servers);

  closeModal("serverModal");

  renderServerTable();

  showToast("Server berhasil ditambahkan.");
}

/**
 * Timestamp for demo audit.
 */
function getServerTimestamp() {
  const now = new Date();

  const date = now.toISOString().slice(0, 10);

  const time = now.toTimeString().slice(0, 5);

  return `${date} ${time}`;
}

/* ==========================================================================
   RESET SERVER DEMO
   ========================================================================== */

/**
 * Reset server data.
 */
function resetServerDemoData() {
  const confirmed = window.confirm("Reset semua data Server ke demo awal?");

  if (!confirmed) {
    return;
  }

  const data = structuredClone(SERVER_DEMO_DATA);

  saveServers(data);

  renderServerTable();

  showToast("Server demo berhasil di-reset.");
}

/* ==========================================================================
   SERVER DETAIL PAGE
   ========================================================================== */

/**
 * Get query parameter.
 */
function getServerQueryCode() {
  const params = new URLSearchParams(window.location.search);

  return params.get("code") || params.get("assetCode") || "";
}

/**
 * Load server detail.
 */
function loadServerDetail() {
  const detailTitle = document.getElementById("serverDetailTitle");

  if (!detailTitle) {
    return;
  }

  const code = getServerQueryCode();

  const servers = getServers();

  /*
   * Default to first server
   * if no query parameter exists.
   */

  const server = code
    ? servers.find((item) => item.assetCode === code)
    : servers[0];

  if (!server) {
    showToast("Server tidak ditemukan.");

    return;
  }

  populateServerDetail(server);
}

/**
 * Populate detail page.
 */
function populateServerDetail(server) {
  setText("serverDetailTitle", server.assetName);

  setText("serverDetailCode", server.assetCode);

  setText("serverDetailBreadcrumbCode", server.assetCode);

  setText("serverDetailAssetCode", server.assetCode);

  setText("serverDetailAssetName", server.assetName);

  setText("serverDetailHostname", server.hostname);

  setText("serverDetailVendor", server.vendor);

  setText("serverDetailModel", server.model);

  setText("serverDetailSerial", server.serialNumber || "—");

  setText("serverDetailLocation", server.location || "—");

  setText("serverDetailRack", server.rack || "—");

  setText("serverDetailRackU", server.rackU ? `U${server.rackU}` : "—");

  setText("serverDetailProvider", server.provider || "—");

  setText(
    "serverDetailLifecycle",
    getServerLifecycleLabel(server.lifecycleStatus),
  );

  setText(
    "serverDetailOperational",
    getServerOperationalLabel(server.operationalStatus),
  );

  setText("serverDetailCpu", server.cpu || "—");

  setText(
    "serverDetailCpuCores",
    server.cpuCores ? `${server.cpuCores} Core` : "—",
  );

  setText("serverDetailRam", server.ram || "—");

  setText("serverDetailStorage", server.storage || "—");

  setText("serverDetailRaid", server.raid || "—");

  setText("serverDetailOs", server.os || "—");

  setText("serverDetailOsVersion", server.osVersion || "—");

  setText("serverDetailManagementIp", server.managementIp || "—");

  setText("serverDetailHostedVm", server.hostedVm || "—");

  setText("serverDetailConnectedTo", server.connectedTo || "—");

  setText("serverDetailStorageRelation", server.storageRelation || "—");

  setText("serverDetailNetwork", server.network || "—");

  /*
   * --------------------------------------------------------------
   * LIFECYCLE BADGE
   * --------------------------------------------------------------
   */

  const lifecycleBadge = document.getElementById("serverDetailLifecycleBadge");

  if (lifecycleBadge) {
    lifecycleBadge.className = `badge ${getServerLifecycleBadgeClass(
      server.lifecycleStatus,
    )}`;

    lifecycleBadge.textContent = getServerLifecycleLabel(
      server.lifecycleStatus,
    );
  }

  /*
   * --------------------------------------------------------------
   * OPERATIONAL BADGE
   * --------------------------------------------------------------
   */

  const operationalBadge = document.getElementById(
    "serverDetailOperationalBadge",
  );

  if (operationalBadge) {
    operationalBadge.className = `server-operational ${getServerOperationalClass(
      server.operationalStatus,
    )}`;

    operationalBadge.textContent = getServerOperationalLabel(
      server.operationalStatus,
    );
  }

  /*
   * --------------------------------------------------------------
   * EDIT LINK
   * --------------------------------------------------------------
   */

  const editButton = document.getElementById("editServerDetailBtn");

  if (editButton) {
    editButton.href = `server.html?edit=${encodeURIComponent(
      server.assetCode,
    )}`;
  }

  /*
   * --------------------------------------------------------------
   * PAGE TITLE
   * --------------------------------------------------------------
   */

  document.title = `${server.assetName} · NETASSET`;
}

/**
 * Generic set text helper.
 */
function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent =
      value === null || value === undefined || value === "" ? "—" : value;
  }
}

/* ==========================================================================
   SERVER EDIT VIA QUERY PARAMETER
   ========================================================================== */

/**
 * Handle server.html?edit=SRV-0001
 */
function handleServerEditQuery() {
  if (!document.getElementById("serverModal")) {
    return;
  }

  const params = new URLSearchParams(window.location.search);

  const editCode = params.get("edit");

  if (!editCode) {
    return;
  }

  /*
   * Wait until page initialization
   * has completed.
   */

  setTimeout(() => {
    openServerEdit(editCode);
  }, 50);
}

/* ==========================================================================
   SERVER PAGE INITIALIZATION
   ========================================================================== */

/**
 * Initialize Server list page.
 */
function initServerListPage() {
  const table = document.getElementById("serverTableBody");

  if (!table) {
    return;
  }

  /*
   * Initial render
   */

  renderServerTable();

  /*
   * Search
   */

  const search = document.getElementById("serverSearch");

  if (search) {
    search.addEventListener("input", () => {
      renderServerTable();
    });
  }

  /*
   * Status filter
   */

  const filter = document.getElementById("serverStatusFilter");

  if (filter) {
    filter.addEventListener("change", () => {
      renderServerTable();
    });
  }

  /*
   * Modal relationship refresh
   */

  const form = document.getElementById("serverForm");

  if (form) {
    const connectedTo = form.elements.connectedTo;

    const hostedVm = form.elements.hostedVm;

    const storage = form.elements.storageRelation;

    const network = form.elements.network;

    /*
     * Relationship values are
     * refreshed when modal opens,
     * so no heavy event listener
     * is required here.
     */

    [connectedTo, hostedVm, storage, network].forEach((element) => {
      element?.addEventListener("change", () => {
        /*
         * Reserved for future
         * relationship validation.
         */
      });
    });
  }

  /*
   * Handle ?edit=SRV-xxxx
   */

  handleServerEditQuery();
}

/**
 * Initialize Server detail page.
 */
function initServerDetailPage() {
  const detailTitle = document.getElementById("serverDetailTitle");

  if (!detailTitle) {
    return;
  }

  loadServerDetail();
}

/**
 * Main Server initializer.
 */
function initServerPage() {
  initServerListPage();

  initServerDetailPage();
}

/* ==========================================================================
   SERVER TABS
   ========================================================================== */

/**
 * Wire tabs on Server detail page.
 */
function initServerTabs() {
  const tabButtons = document.querySelectorAll(".server-detail-page .tab-btn");

  if (!tabButtons.length) {
    return;
  }

  const panels = document.querySelectorAll(
    ".server-detail-page [data-tab-panel]",
  );

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      tabButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.tabPanel === target);
      });
    });
  });
}

/* ==========================================================================
   SERVER MODAL CLOSE
   ========================================================================== */

/**
 * Close modal when clicking outside dialog.
 */
function initServerModalDismiss() {
  const modal = document.getElementById("serverModal");

  if (!modal) {
    return;
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
}
