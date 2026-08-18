/* ==========================================================================
   NETASSET — VIRTUAL RESOURCES / VPN
   ========================================================================== */

const VPN_STORAGE_KEY = "netasset_vpns";

/* ==========================================================================
   DEMO DATA
   ========================================================================== */

const VPN_DEMO_DATA = [
  {
    vpnCode: "VPN-0001",
    vpnName: "Jakarta–Surabaya Core VPN",
    description:
      "Secure site-to-site connection between Jakarta and Surabaya core infrastructure.",
    type: "Site-to-Site",
    protocol: "IPSec",
    encryption: "AES-256",
    authentication: "PSK",
    localEndpoint: "203.0.113.10",
    remoteEndpoint: "198.51.100.10",
    remoteNetwork: "10.20.0.0/16",

    lifecycleStatus: "Active",
    operationalStatus: "Active",

    startDate: "2026-01-10",
    expiryDate: "2027-01-10",

    customer: "PT Nusantara Digital",
    location: "Jakarta DC-01",
    relatedAsset: "RTR-JKT-001",

    createdAt: "2026-07-20 09:15",
    updatedAt: "2026-08-10 14:20",
  },

  {
    vpnCode: "VPN-0002",
    vpnName: "Jakarta–Bandung Branch VPN",
    description: "Secure branch connectivity between Jakarta and Bandung.",
    type: "Site-to-Site",
    protocol: "IPSec",
    encryption: "AES-256",
    authentication: "PSK",
    localEndpoint: "203.0.113.11",
    remoteEndpoint: "198.51.100.11",
    remoteNetwork: "10.30.0.0/16",

    lifecycleStatus: "Active",
    operationalStatus: "Active",

    startDate: "2026-02-15",
    expiryDate: "2027-02-15",

    customer: "PT Global Network Indonesia",
    location: "Jakarta POP-01",
    relatedAsset: "RTR-JKT-002",

    createdAt: "2026-07-21 10:10",
    updatedAt: "2026-08-09 11:30",
  },

  {
    vpnCode: "VPN-0003",
    vpnName: "Remote Engineer VPN",
    description: "Remote access VPN for authorized network engineers.",
    type: "Remote Access",
    protocol: "WireGuard",
    encryption: "ChaCha20",
    authentication: "Certificate",
    localEndpoint: "203.0.113.20",
    remoteEndpoint: "Dynamic",
    remoteNetwork: "10.40.0.0/16",

    lifecycleStatus: "Active",
    operationalStatus: "Active",

    startDate: "2026-03-01",
    expiryDate: "2027-03-01",

    customer: "PT Nusantara Digital",
    location: "Jakarta DC-01",
    relatedAsset: "RTR-JKT-001",

    createdAt: "2026-07-25 08:45",
    updatedAt: "2026-08-08 16:15",
  },

  {
    vpnCode: "VPN-0004",
    vpnName: "Customer Portal Secure VPN",
    description: "Secure VPN connection for customer portal infrastructure.",
    type: "IPSec",
    protocol: "IPSec",
    encryption: "AES-256",
    authentication: "Certificate",
    localEndpoint: "203.0.113.30",
    remoteEndpoint: "198.51.100.30",
    remoteNetwork: "10.60.0.0/16",

    lifecycleStatus: "Provisioned",
    operationalStatus: "Inactive",

    startDate: "2026-05-01",
    expiryDate: "2027-05-01",

    customer: "PT Data Prima",
    location: "Jakarta POP-01",
    relatedAsset: "RTR-JKT-003",

    createdAt: "2026-08-01 13:20",
    updatedAt: "2026-08-11 09:00",
  },

  {
    vpnCode: "VPN-0005",
    vpnName: "Legacy Branch VPN",
    description: "Legacy branch VPN connection scheduled for retirement.",
    type: "Site-to-Site",
    protocol: "OpenVPN",
    encryption: "AES-128",
    authentication: "PSK",
    localEndpoint: "203.0.113.40",
    remoteEndpoint: "198.51.100.40",
    remoteNetwork: "10.50.0.0/16",

    lifecycleStatus: "Retired",
    operationalStatus: "Expired",

    startDate: "2024-01-01",
    expiryDate: "2026-06-30",

    customer: "PT Global Network Indonesia",
    location: "Surabaya POP-01",
    relatedAsset: "RTR-SBY-001",

    createdAt: "2026-06-15 10:00",
    updatedAt: "2026-07-30 17:40",
  },
];

/* ==========================================================================
   STORAGE
   ========================================================================== */

function getVPNs() {
  try {
    const saved = localStorage.getItem(VPN_STORAGE_KEY);

    if (!saved) {
      return structuredClone(VPN_DEMO_DATA);
    }

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : structuredClone(VPN_DEMO_DATA);
  } catch (error) {
    console.error("Failed to load VPN data:", error);

    return structuredClone(VPN_DEMO_DATA);
  }
}

function saveVPNs(vpns) {
  localStorage.setItem(VPN_STORAGE_KEY, JSON.stringify(vpns));
}

/* ==========================================================================
   HELPERS
   ========================================================================== */

function escapeVPNHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getVPNTimestamp() {
  const now = new Date();

  return `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
}

function generateVPNCode() {
  const vpns = getVPNs();

  let highest = 0;

  vpns.forEach((vpn) => {
    const match = String(vpn.vpnCode || "").match(/^VPN-(\d+)$/);

    if (match) {
      highest = Math.max(highest, Number(match[1]));
    }
  });

  return `VPN-${String(highest + 1).padStart(4, "0")}`;
}

function getVPNStatusClass(status) {
  return String(status || "")
    .toLowerCase()
    .replaceAll(" ", "-");
}

/* ==========================================================================
   STATISTICS
   ========================================================================== */

function updateVPNStatistics(vpns) {
  const total = vpns.length;

  const active = vpns.filter(
    (vpn) => vpn.operationalStatus === "Active",
  ).length;

  const connected = vpns.filter(
    (vpn) =>
      vpn.operationalStatus === "Active" && vpn.lifecycleStatus === "Active",
  ).length;

  const now = new Date();

  const thirtyDays = new Date();

  thirtyDays.setDate(now.getDate() + 30);

  const expiringSoon = vpns.filter((vpn) => {
    if (!vpn.expiryDate) {
      return false;
    }

    const expiry = new Date(vpn.expiryDate);

    return expiry >= now && expiry <= thirtyDays;
  }).length;

  const set = (id, value) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  };

  set("statTotal", total);
  set("statActive", active);
  set("statConnected", connected);
  set("statExpiring", expiringSoon);
}

/* ==========================================================================
   FILTER
   ========================================================================== */

function getFilteredVPNs() {
  const vpns = getVPNs();

  const search =
    document.getElementById("vpnSearch")?.value?.trim().toLowerCase() || "";

  const type = document.getElementById("vpnTypeFilter")?.value || "";

  const status = document.getElementById("vpnStatusFilter")?.value || "";

  return vpns.filter((vpn) => {
    const haystack = [
      vpn.vpnCode,
      vpn.vpnName,
      vpn.type,
      vpn.protocol,
      vpn.localEndpoint,
      vpn.remoteEndpoint,
      vpn.customer,
      vpn.location,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !search || haystack.includes(search);

    const matchesType = !type || vpn.type === type;

    const matchesStatus = !status || vpn.operationalStatus === status;

    return matchesSearch && matchesType && matchesStatus;
  });
}

/* ==========================================================================
   RESULT COUNT
   ========================================================================== */

function updateVPNResultCount(shown, total) {
  const element = document.getElementById("vpnResultCount");

  if (element) {
    element.textContent = `${shown} of ${total} VPNs shown`;
  }
}

/* ==========================================================================
   TABLE
   ========================================================================== */

function renderVPNTable() {
  const tableBody = document.getElementById("vpnTableBody");

  if (!tableBody) {
    return;
  }

  const allVPNs = getVPNs();

  const filteredVPNs = getFilteredVPNs();

  updateVPNStatistics(allVPNs);

  if (filteredVPNs.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="vpn-empty">

            <div class="vpn-empty-icon">
              VPN
            </div>

            <h3>
              No VPN found
            </h3>

            <p>
              Tidak ada VPN yang sesuai
              dengan pencarian atau filter.
            </p>

          </div>
        </td>
      </tr>
    `;

    updateVPNResultCount(0, allVPNs.length);

    return;
  }

  tableBody.innerHTML = filteredVPNs
    .map((vpn) => {
      const statusClass = getVPNStatusClass(vpn.operationalStatus);

      const lifecycleClass = getVPNStatusClass(vpn.lifecycleStatus);

      return `
          <tr>

            <td>

              <div class="vpn-identity">

                <div class="vpn-icon">
                  VPN
                </div>


                <div class="vpn-identity-text">

                  <span
                    class="vpn-identity-name"
                  >
                    ${escapeVPNHtml(vpn.vpnName)}
                  </span>


                  <span
                    class="vpn-identity-code"
                  >
                    ${escapeVPNHtml(vpn.vpnCode)}
                  </span>

                </div>

              </div>

            </td>


            <td>
              ${escapeVPNHtml(vpn.type)}
            </td>


            <td>
              <span class="vpn-mono">
                ${escapeVPNHtml(vpn.protocol)}
              </span>
            </td>


            <td>
              <span class="vpn-mono">
                ${escapeVPNHtml(vpn.localEndpoint || "—")}
              </span>
            </td>


            <td>
              <span class="vpn-mono">
                ${escapeVPNHtml(vpn.remoteEndpoint || "—")}
              </span>
            </td>


            <td>

              <span
                class="vpn-badge vpn-badge-${escapeVPNHtml(statusClass)}"
              >
                ${escapeVPNHtml(vpn.operationalStatus)}
              </span>

            </td>


            <td>

              <span
                class="vpn-badge vpn-badge-${escapeVPNHtml(lifecycleClass)}"
              >
                ${escapeVPNHtml(vpn.lifecycleStatus)}
              </span>

            </td>


            <td>

              <div class="vpn-row-actions">

                <button
                  type="button"
                  class="vpn-action-btn primary"
                  data-vpn-view="${escapeVPNHtml(vpn.vpnCode)}"
                >
                  View
                </button>


                <button
                  type="button"
                  class="vpn-action-btn"
                  data-vpn-edit="${escapeVPNHtml(vpn.vpnCode)}"
                >
                  Edit
                </button>

              </div>

            </td>

          </tr>
        `;
    })
    .join("");

  updateVPNResultCount(filteredVPNs.length, allVPNs.length);
}

/* ==========================================================================
   ADD / EDIT MODAL
   ========================================================================== */

let editingVPNCode = null;

function openVPNModal(vpn = null) {
  const modal = document.getElementById("vpnModal");

  const form = document.getElementById("vpnForm");

  const title = document.getElementById("vpnModalTitle");

  if (!modal || !form) {
    return;
  }

  editingVPNCode = vpn?.vpnCode || null;

  if (title) {
    title.textContent = vpn ? `Edit VPN — ${vpn.vpnCode}` : "Add VPN";
  }

  form.reset();

  if (vpn) {
    const values = {
      vpnCode: vpn.vpnCode,

      vpnName: vpn.vpnName,

      vpnDescription: vpn.description,

      vpnType: vpn.type,

      vpnProtocol: vpn.protocol,

      vpnEncryption: vpn.encryption,

      vpnAuthentication: vpn.authentication,

      vpnLocalEndpoint: vpn.localEndpoint,

      vpnRemoteEndpoint: vpn.remoteEndpoint,

      vpnRemoteNetwork: vpn.remoteNetwork,

      vpnLifecycle: vpn.lifecycleStatus,

      vpnStatus: vpn.operationalStatus,

      vpnStartDate: vpn.startDate,

      vpnExpiryDate: vpn.expiryDate,

      vpnCustomer: vpn.customer,

      vpnLocation: vpn.location,

      vpnRelatedAsset: vpn.relatedAsset,
    };

    Object.entries(values).forEach(([id, value]) => {
      const element = document.getElementById(id);

      if (element) {
        element.value = value || "";
      }
    });
  }

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function closeVPNModal() {
  const modal = document.getElementById("vpnModal");

  if (!modal) {
    return;
  }

  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }

  editingVPNCode = null;
}

/* ==========================================================================
   READ FORM
   ========================================================================== */

function readVPNForm() {
  const value = (id) => document.getElementById(id)?.value?.trim() || "";

  return {
    vpnCode: value("vpnCode"),

    vpnName: value("vpnName"),

    description: value("vpnDescription"),

    type: value("vpnType"),

    protocol: value("vpnProtocol"),

    encryption: value("vpnEncryption"),

    authentication: value("vpnAuthentication"),

    localEndpoint: value("vpnLocalEndpoint"),

    remoteEndpoint: value("vpnRemoteEndpoint"),

    remoteNetwork: value("vpnRemoteNetwork"),

    lifecycleStatus: value("vpnLifecycle") || "Provisioned",

    operationalStatus: value("vpnStatus") || "Active",

    startDate: value("vpnStartDate"),

    expiryDate: value("vpnExpiryDate"),

    customer: value("vpnCustomer"),

    location: value("vpnLocation"),

    relatedAsset: value("vpnRelatedAsset"),
  };
}

/* ==========================================================================
   VALIDATION
   ========================================================================== */

function validateVPNForm(data, editingCode = null) {
  const errors = [];

  if (!data.vpnName) {
    errors.push("VPN Name wajib diisi.");
  }

  if (!data.type) {
    errors.push("VPN Type wajib dipilih.");
  }

  if (!data.protocol) {
    errors.push("Protocol wajib dipilih.");
  }

  if (!data.localEndpoint) {
    errors.push("Local Endpoint wajib diisi.");
  }

  if (!data.remoteEndpoint) {
    errors.push("Remote Endpoint wajib diisi.");
  }

  const duplicate = getVPNs().find(
    (vpn) => vpn.vpnCode === data.vpnCode && vpn.vpnCode !== editingCode,
  );

  if (duplicate) {
    errors.push(`VPN Code ${data.vpnCode} sudah digunakan.`);
  }

  return errors;
}

/* ==========================================================================
   SAVE VPN
   ========================================================================== */

function handleVPNSubmit(event) {
  event.preventDefault();

  const data = readVPNForm();

  const errors = validateVPNForm(data, editingVPNCode);

  if (errors.length) {
    if (typeof showToast === "function") {
      showToast(errors[0]);
    } else {
      alert(errors[0]);
    }

    return;
  }

  const vpns = getVPNs();

  /* ========================================================
     EDIT
     ======================================================== */

  if (editingVPNCode) {
    const index = vpns.findIndex((vpn) => vpn.vpnCode === editingVPNCode);

    if (index === -1) {
      return;
    }

    data.vpnCode = editingVPNCode;

    data.createdAt = vpns[index].createdAt;

    data.updatedAt = getVPNTimestamp();

    vpns[index] = data;
  } else {
    /* ========================================================
     ADD
     ======================================================== */
    data.vpnCode = data.vpnCode || generateVPNCode();

    data.createdAt = getVPNTimestamp();

    data.updatedAt = data.createdAt;

    vpns.push(data);
  }

  saveVPNs(vpns);

  closeVPNModal();

  renderVPNTable();

  if (typeof showToast === "function") {
    showToast(
      editingVPNCode
        ? "VPN berhasil diperbarui."
        : `${data.vpnCode} berhasil ditambahkan.`,
    );
  }
}

/* ==========================================================================
   VIEW DETAIL
   ========================================================================== */

function openVPNDetail(vpnCode) {
  window.location.href = `vpn-detail.html?code=${encodeURIComponent(vpnCode)}`;
}

/* ==========================================================================
   EDIT VPN
   ========================================================================== */

function editVPN(vpnCode) {
  const vpn = getVPNs().find((item) => item.vpnCode === vpnCode);

  if (!vpn) {
    if (typeof showToast === "function") {
      showToast("VPN tidak ditemukan.");
    }

    return;
  }

  openVPNModal(vpn);
}

/* ==========================================================================
   TABLE CLICK
   ========================================================================== */

function handleVPNTableClick(event) {
  const viewButton = event.target.closest("[data-vpn-view]");

  const editButton = event.target.closest("[data-vpn-edit]");

  if (viewButton) {
    openVPNDetail(viewButton.getAttribute("data-vpn-view"));

    return;
  }

  if (editButton) {
    editVPN(editButton.getAttribute("data-vpn-edit"));
  }
}

/* ==========================================================================
   MODAL INIT
   ========================================================================== */

function initVPNModal() {
  const modal = document.getElementById("vpnModal");

  document
    .getElementById("vpnModalClose")
    ?.addEventListener("click", closeVPNModal);

  document
    .getElementById("vpnCancelBtn")
    ?.addEventListener("click", closeVPNModal);

  document
    .getElementById("vpnForm")
    ?.addEventListener("submit", handleVPNSubmit);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeVPNModal();
    }
  });
}

/* ==========================================================================
   RESET DEMO DATA
   ========================================================================== */

function resetVPNDemoData() {
  if (!window.confirm("Reset semua data VPN ke demo awal?")) {
    return;
  }

  saveVPNs(structuredClone(VPN_DEMO_DATA));

  renderVPNTable();

  if (typeof showToast === "function") {
    showToast("Data VPN berhasil di-reset.");
  }
}

/* ==========================================================================
   INIT VPN PAGE
   ========================================================================== */

function initVPNPage() {
  const tableBody = document.getElementById("vpnTableBody");

  if (!tableBody) {
    return;
  }

  /* ========================================================
     INITIAL DATA
     ======================================================== */

  if (!localStorage.getItem(VPN_STORAGE_KEY)) {
    saveVPNs(structuredClone(VPN_DEMO_DATA));
  }

  /* ========================================================
     SEARCH
     ======================================================== */

  document
    .getElementById("vpnSearch")
    ?.addEventListener("input", renderVPNTable);

  /* ========================================================
     TYPE FILTER
     ======================================================== */

  document
    .getElementById("vpnTypeFilter")
    ?.addEventListener("change", renderVPNTable);

  /* ========================================================
     STATUS FILTER
     ======================================================== */

  document
    .getElementById("vpnStatusFilter")
    ?.addEventListener("change", renderVPNTable);

  /* ========================================================
     ADD VPN
     ======================================================== */

  document
    .getElementById("vpnAddBtn")
    ?.addEventListener("click", () => openVPNModal());

  /* ========================================================
     REFRESH
     ======================================================== */

  document
    .getElementById("vpnRefreshBtn")
    ?.addEventListener("click", renderVPNTable);

  /* ========================================================
     RESET
     ======================================================== */

  document
    .getElementById("vpnResetBtn")
    ?.addEventListener("click", resetVPNDemoData);

  /* ========================================================
     TABLE ACTIONS
     ======================================================== */

  tableBody.addEventListener("click", handleVPNTableClick);

  /* ========================================================
     MODAL
     ======================================================== */

  initVPNModal();

  /* ========================================================
     FIRST RENDER
     ======================================================== */

  renderVPNTable();
}

/* ==========================================================================
   DOCUMENT READY
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initVPNPage();
});
