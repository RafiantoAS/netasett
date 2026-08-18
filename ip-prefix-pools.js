/* ==========================================================================
   ip-prefix-pools.js
   Network Resources — IP Prefix / Pool
   ========================================================================== */

/* ==========================================================================
   DEMO DATA
   ========================================================================== */

const DEFAULT_PREFIXES = [
  {
    id: 1,
    prefix: "10.10.0.0/24",
    name: "Jakarta Management Network",
    ipVersion: "IPv4",
    type: "Management",
    gateway: "10.10.0.1",
    vlan: "100",
    location: "POP Jakarta",
    provider: "NAP-A",
    status: "Active",
    used: 32,
    total: 254,
    description: "Management network for Jakarta POP.",
  },

  {
    id: 2,
    prefix: "10.20.0.0/24",
    name: "Jakarta Customer Network",
    ipVersion: "IPv4",
    type: "Customer",
    gateway: "10.20.0.1",
    vlan: "200",
    location: "POP Jakarta",
    provider: "NAP-A",
    status: "Active",
    used: 148,
    total: 254,
    description: "Customer access network.",
  },

  {
    id: 3,
    prefix: "10.30.0.0/25",
    name: "South Jakarta Infrastructure",
    ipVersion: "IPv4",
    type: "Infrastructure",
    gateway: "10.30.0.1",
    vlan: "300",
    location: "POP Jakarta Selatan",
    provider: "NAP-B",
    status: "Active",
    used: 68,
    total: 126,
    description: "Infrastructure subnet for South Jakarta POP.",
  },

  {
    id: 4,
    prefix: "10.40.0.0/24",
    name: "Bandung Transit Network",
    ipVersion: "IPv4",
    type: "Transit",
    gateway: "10.40.0.1",
    vlan: "400",
    location: "POP Bandung",
    provider: "NAP-C",
    status: "Reserved",
    used: 0,
    total: 254,
    description: "Reserved transit network.",
  },

  {
    id: 5,
    prefix: "10.50.0.0/28",
    name: "Legacy Loopback Pool",
    ipVersion: "IPv4",
    type: "Loopback",
    gateway: "10.50.0.1",
    vlan: "",
    location: "POP Jakarta",
    provider: "Internal",
    status: "Deprecated",
    used: 12,
    total: 14,
    description: "Legacy loopback allocation.",
  },
];

let prefixes = loadPrefixes();

let editingId = null;

/* ==========================================================================
   DOM
   ========================================================================== */

const tableBody = document.getElementById("prefixTableBody");

const searchInput = document.getElementById("prefixSearch");

const ipVersionFilter = document.getElementById("ipVersionFilter");

const statusFilter = document.getElementById("prefixStatusFilter");

const addButton = document.getElementById("addPrefixButton");

const dialog = document.getElementById("prefixDialog");

const closeDialogButton = document.getElementById("closePrefixDialog");

const cancelButton = document.getElementById("cancelPrefixButton");

const form = document.getElementById("prefixForm");

const dialogTitle = document.getElementById("dialogTitle");

const resetDemoButton = document.getElementById("resetDemoButton");

/* ==========================================================================
   STORAGE
   ========================================================================== */

function loadPrefixes() {
  try {
    const saved = localStorage.getItem("netasset_ip_prefixes");

    if (!saved) {
      return structuredClone(DEFAULT_PREFIXES);
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : structuredClone(DEFAULT_PREFIXES);
  } catch (error) {
    console.error("Failed to load IP prefixes:", error);

    return structuredClone(DEFAULT_PREFIXES);
  }
}

function savePrefixes() {
  localStorage.setItem("netasset_ip_prefixes", JSON.stringify(prefixes));
}

/* ==========================================================================
   UTILITIES
   ========================================================================== */

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getUtilization(item) {
  if (!item.total) {
    return 0;
  }

  return Math.min(100, Math.round((item.used / item.total) * 100));
}

function getStatusClass(status) {
  const classes = {
    Active: "prefix-status-active",
    Reserved: "prefix-status-reserved",
    Deprecated: "prefix-status-deprecated",
  };

  return classes[status] || "";
}

/* ==========================================================================
   RENDER
   ========================================================================== */

function renderPrefixes() {
  const search = searchInput.value.trim().toLowerCase();

  const selectedVersion = ipVersionFilter.value;

  const selectedStatus = statusFilter.value;

  const filtered = prefixes.filter((item) => {
    const matchesSearch =
      !search ||
      [
        item.prefix,
        item.name,
        item.gateway,
        item.vlan,
        item.location,
        item.provider,
        item.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search);

    const matchesVersion =
      !selectedVersion || item.ipVersion === selectedVersion;

    const matchesStatus = !selectedStatus || item.status === selectedStatus;

    return matchesSearch && matchesVersion && matchesStatus;
  });

  tableBody.innerHTML = filtered.length
    ? filtered.map(renderPrefixRow).join("")
    : `
            <tr>
                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:40px;
                        color:var(--text-muted);
                    "
                >
                    No IP prefix found.
                </td>
            </tr>
        `;

  updateSummary();

  updateCount(filtered.length);
}

function renderPrefixRow(item) {
  const utilization = getUtilization(item);

  const statusClass = getStatusClass(item.status);

  return `
        <tr>

            <td>

                <div class="prefix-name-cell">

                    <div class="prefix-icon">
                        IP
                    </div>

                    <div class="prefix-name-text">

                        <span class="prefix-name">
                            ${escapeHtml(item.name)}
                        </span>

                        <span class="prefix-cidr">
                            ${escapeHtml(item.prefix)}
                        </span>

                    </div>

                </div>

            </td>


            <td>
                ${escapeHtml(item.type)}
            </td>


            <td>
                <span class="prefix-technical">
                    ${escapeHtml(item.ipVersion)}
                </span>
            </td>


            <td>
                <span class="prefix-technical">
                    ${escapeHtml(item.gateway || "—")}
                </span>
            </td>


            <td>

                <div class="prefix-utilization">

                    <div class="prefix-utilization-top">

                        <span class="prefix-utilization-percent">
                            ${utilization}%
                        </span>

                        <span>
                            ${item.used}/${item.total}
                        </span>

                    </div>

                    <div class="prefix-utilization-bar">

                        <div
                            class="prefix-utilization-fill"
                            style="width:${utilization}%"
                        ></div>

                    </div>

                    <div class="prefix-utilization-meta">
                        ${Math.max(0, item.total - item.used)} available
                    </div>

                </div>

            </td>


            <td>
                ${escapeHtml(item.location)}
            </td>


            <td>

                <span
                    class="
                        prefix-status
                        ${statusClass}
                    "
                >
                    ${escapeHtml(item.status)}
                </span>

            </td>


            <td>

                <div class="prefix-actions">

                    <button
                        type="button"
                        class="prefix-action"
                        title="View"
                        data-action="view"
                        data-id="${item.id}"
                    >
                        ◉
                    </button>

                    <button
                        type="button"
                        class="prefix-action"
                        title="Edit"
                        data-action="edit"
                        data-id="${item.id}"
                    >
                        ✎
                    </button>

                </div>

            </td>

        </tr>
    `;
}

/* ==========================================================================
   SUMMARY
   ========================================================================== */

function updateSummary() {
  const total = prefixes.length;

  const active = prefixes.filter((item) => item.status === "Active").length;

  const reserved = prefixes.filter((item) => item.status === "Reserved").length;

  const deprecated = prefixes.filter(
    (item) => item.status === "Deprecated",
  ).length;

  document.getElementById("totalPrefix").textContent = total;

  document.getElementById("activePrefix").textContent = active;

  document.getElementById("reservedPrefix").textContent = reserved;

  document.getElementById("deprecatedPrefix").textContent = deprecated;
}

function updateCount(count) {
  document.getElementById("prefixCount").textContent =
    `${count} ${count === 1 ? "prefix" : "prefixes"}`;
}

/* ==========================================================================
   DIALOG
   ========================================================================== */

function openAddDialog() {
  editingId = null;

  dialogTitle.textContent = "Add IP Prefix";

  form.reset();

  document.getElementById("ipVersion").value = "IPv4";

  document.getElementById("prefixType").value = "Management";

  document.getElementById("prefixStatus").value = "Active";

  dialog.showModal();
}

function openEditDialog(id) {
  const item = prefixes.find((prefix) => prefix.id === id);

  if (!item) {
    return;
  }

  editingId = id;

  dialogTitle.textContent = "Edit IP Prefix";

  document.getElementById("prefix").value = item.prefix;

  document.getElementById("prefixName").value = item.name;

  document.getElementById("ipVersion").value = item.ipVersion;

  document.getElementById("prefixType").value = item.type;

  document.getElementById("gateway").value = item.gateway;

  document.getElementById("vlan").value = item.vlan;

  document.getElementById("location").value = item.location;

  document.getElementById("provider").value = item.provider;

  document.getElementById("description").value = item.description;

  document.getElementById("prefixStatus").value = item.status;

  dialog.showModal();
}

function closeDialog() {
  dialog.close();

  editingId = null;

  form.reset();
}

/* ==========================================================================
   FORM SUBMIT
   ========================================================================== */

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const data = {
    prefix: formData.get("prefix").trim(),

    name: formData.get("name").trim(),

    ipVersion: formData.get("ipVersion"),

    type: formData.get("type"),

    gateway: formData.get("gateway").trim(),

    vlan: formData.get("vlan").trim(),

    location: formData.get("location"),

    provider: formData.get("provider"),

    status: formData.get("status"),

    description: formData.get("description").trim(),
  };

  if (!data.prefix || !data.name) {
    alert("Prefix dan Prefix Name wajib diisi.");

    return;
  }

  if (editingId !== null) {
    const index = prefixes.findIndex((item) => item.id === editingId);

    if (index !== -1) {
      prefixes[index] = {
        ...prefixes[index],
        ...data,
      };
    }
  } else {
    prefixes.push({
      id: Date.now(),

      ...data,

      used: 0,

      total:
        data.ipVersion === "IPv6" ? 65536 : calculateIpv4Usable(data.prefix),
    });
  }

  savePrefixes();

  renderPrefixes();

  closeDialog();
});

/* ==========================================================================
   SIMPLE IPV4 USABLE CALCULATION
   ========================================================================== */

function calculateIpv4Usable(prefix) {
  const match = prefix.match(/\/(\d+)$/);

  if (!match) {
    return 254;
  }

  const cidr = Number(match[1]);

  if (cidr >= 31) {
    return 2;
  }

  return Math.pow(2, 32 - cidr) - 2;
}

/* ==========================================================================
   TABLE ACTIONS
   ========================================================================== */

tableBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);

  const action = button.dataset.action;

  if (action === "edit") {
    openEditDialog(id);
  }

  if (action === "view") {
    const item = prefixes.find((prefix) => prefix.id === id);

    if (!item) {
      return;
    }

    alert(
      `${item.name}\n\n` +
        `${item.prefix}\n` +
        `${item.type}\n` +
        `${item.ipVersion}\n` +
        `${item.location}\n` +
        `${item.status}`,
    );
  }
});

/* ==========================================================================
   EVENTS
   ========================================================================== */

addButton.addEventListener("click", openAddDialog);

closeDialogButton.addEventListener("click", closeDialog);

cancelButton.addEventListener("click", closeDialog);

searchInput.addEventListener("input", renderPrefixes);

ipVersionFilter.addEventListener("change", renderPrefixes);

statusFilter.addEventListener("change", renderPrefixes);

resetDemoButton.addEventListener("click", () => {
  prefixes = structuredClone(DEFAULT_PREFIXES);

  savePrefixes();

  searchInput.value = "";

  ipVersionFilter.value = "";

  statusFilter.value = "";

  renderPrefixes();
});

/* ==========================================================================
   INITIAL RENDER
   ========================================================================== */

renderPrefixes();
