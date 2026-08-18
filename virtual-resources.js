"use strict";

/* =========================================================
   NETASSET — VIRTUAL RESOURCES
   VM + VPN
   ========================================================= */

/* =========================================================
   VM
   ========================================================= */

const VM_STORAGE_KEY = "netasset_vms";

const VM_DEMO_DATA = [
  {
    assetCode: "VM-0001",
    vmName: "Application VM Jakarta-01",
    hostname: "app-vm-jkt-01",
    hypervisor: "Proxmox-01",
    vcpu: 4,
    ram: "8 GB",
    storage: "100 GB",
    operatingSystem: "Ubuntu",
    osVersion: "24.04",
    privateIp: "10.10.10.20",
    publicIp: "",
    vlan: "VLAN-100",
    lifecycleStatus: "Active",
    operationalStatus: "Running",
    hostedOn: "Proxmox-01",
    usesStorage: "Storage-JKT-01",
    connectedTo: "Management Network",
    createdAt: "2026-07-20",
    updatedAt: "2026-08-10",
  },

  {
    assetCode: "VM-0002",
    vmName: "Database VM Jakarta-01",
    hostname: "db-vm-jkt-01",
    hypervisor: "Proxmox-01",
    vcpu: 8,
    ram: "16 GB",
    storage: "250 GB",
    operatingSystem: "Ubuntu",
    osVersion: "22.04",
    privateIp: "10.10.10.21",
    publicIp: "",
    vlan: "VLAN-100",
    lifecycleStatus: "Active",
    operationalStatus: "Running",
    hostedOn: "Proxmox-01",
    usesStorage: "Storage-JKT-01",
    connectedTo: "Management Network",
    createdAt: "2026-07-21",
    updatedAt: "2026-08-09",
  },

  {
    assetCode: "VM-0003",
    vmName: "Monitoring VM Jakarta-01",
    hostname: "monitor-vm-jkt-01",
    hypervisor: "Proxmox-02",
    vcpu: 4,
    ram: "8 GB",
    storage: "150 GB",
    operatingSystem: "Debian",
    osVersion: "12",
    privateIp: "10.20.10.20",
    publicIp: "",
    vlan: "VLAN-200",
    lifecycleStatus: "Active",
    operationalStatus: "Running",
    hostedOn: "Proxmox-02",
    usesStorage: "Storage-JKT-02",
    connectedTo: "Infrastructure Network",
    createdAt: "2026-07-25",
    updatedAt: "2026-08-08",
  },

  {
    assetCode: "VM-0004",
    vmName: "Customer Portal VM",
    hostname: "portal-vm-jkt-01",
    hypervisor: "Proxmox-02",
    vcpu: 4,
    ram: "8 GB",
    storage: "120 GB",
    operatingSystem: "Ubuntu",
    osVersion: "24.04",
    privateIp: "10.30.10.20",
    publicIp: "103.10.20.30",
    vlan: "VLAN-300",
    lifecycleStatus: "Provisioned",
    operationalStatus: "Stopped",
    hostedOn: "Proxmox-02",
    usesStorage: "Storage-JKT-02",
    connectedTo: "Customer Network",
    createdAt: "2026-08-01",
    updatedAt: "2026-08-11",
  },

  {
    assetCode: "VM-0005",
    vmName: "Legacy Application VM",
    hostname: "legacy-vm-jkt-01",
    hypervisor: "Proxmox-02",
    vcpu: 2,
    ram: "4 GB",
    storage: "80 GB",
    operatingSystem: "Rocky Linux",
    osVersion: "9",
    privateIp: "10.50.10.20",
    publicIp: "",
    vlan: "VLAN-500",
    lifecycleStatus: "Retired",
    operationalStatus: "Stopped",
    hostedOn: "Proxmox-02",
    usesStorage: "Storage-JKT-02",
    connectedTo: "Infrastructure Network",
    createdAt: "2026-06-15",
    updatedAt: "2026-07-30",
  },
];

function getVMs() {
  try {
    const saved = localStorage.getItem(VM_STORAGE_KEY);

    if (!saved) {
      saveVMs(VM_DEMO_DATA);
      return [...VM_DEMO_DATA];
    }

    const data = JSON.parse(saved);

    if (!Array.isArray(data) || data.length === 0) {
      saveVMs(VM_DEMO_DATA);
      return [...VM_DEMO_DATA];
    }

    return data;
  } catch (error) {
    console.error(error);
    saveVMs(VM_DEMO_DATA);
    return [...VM_DEMO_DATA];
  }
}

function saveVMs(data) {
  localStorage.setItem(VM_STORAGE_KEY, JSON.stringify(data));
}

function generateVMCode() {
  const vms = getVMs();

  let highest = 0;

  vms.forEach((vm) => {
    const match = String(vm.assetCode || "").match(/^VM-(\d+)$/);

    if (match) {
      highest = Math.max(highest, Number(match[1]));
    }
  });

  return `VM-${String(highest + 1).padStart(4, "0")}`;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusClass(value) {
  return String(value || "")
    .toLowerCase()
    .replaceAll(" ", "-");
}

/* =========================================================
   VPN
   ========================================================= */

const VPN_STORAGE_KEY = "netasset_vpns";

const VPN_DEMO_DATA = [
  {
    vpnCode: "VPN-0001",
    vpnName: "Jakarta–Surabaya Core VPN",
    description: "Secure site-to-site connection.",
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
  },

  {
    vpnCode: "VPN-0002",
    vpnName: "Jakarta–Bandung Branch VPN",
    description: "Secure branch connectivity.",
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
  },

  {
    vpnCode: "VPN-0003",
    vpnName: "Remote Engineer VPN",
    description: "Remote access VPN for network engineers.",
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
  },

  {
    vpnCode: "VPN-0004",
    vpnName: "Customer Portal Secure VPN",
    description: "Secure VPN for customer portal.",
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
  },

  {
    vpnCode: "VPN-0005",
    vpnName: "Legacy Branch VPN",
    description: "Legacy VPN scheduled for retirement.",
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
  },
];

function getVPNs() {
  try {
    const saved = localStorage.getItem(VPN_STORAGE_KEY);

    /*
     * Jika sebelumnya tersimpan [] maka otomatis
     * dikembalikan ke demo data.
     */
    if (!saved) {
      saveVPNs(VPN_DEMO_DATA);
      return [...VPN_DEMO_DATA];
    }

    const data = JSON.parse(saved);

    if (!Array.isArray(data) || data.length === 0) {
      saveVPNs(VPN_DEMO_DATA);
      return [...VPN_DEMO_DATA];
    }

    return data;
  } catch (error) {
    console.error(error);
    saveVPNs(VPN_DEMO_DATA);
    return [...VPN_DEMO_DATA];
  }
}

function saveVPNs(data) {
  localStorage.setItem(VPN_STORAGE_KEY, JSON.stringify(data));
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

/* =========================================================
   VM RENDER
   ========================================================= */

function getFilteredVMs() {
  const vms = getVMs();

  const search =
    document.getElementById("vmSearch")?.value?.trim().toLowerCase() || "";

  const lifecycle =
    document.getElementById("vmLifecycleFilter")?.value || "all";

  const operational =
    document.getElementById("vmOperationalFilter")?.value || "all";

  return vms.filter((vm) => {
    const text = [
      vm.assetCode,
      vm.vmName,
      vm.hostname,
      vm.privateIp,
      vm.publicIp,
      vm.hypervisor,
      vm.operatingSystem,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!search || text.includes(search)) &&
      (lifecycle === "all" || vm.lifecycleStatus === lifecycle) &&
      (operational === "all" || vm.operationalStatus === operational)
    );
  });
}

function updateVMStats(vms) {
  const stats = {
    totalVm: vms.length,

    runningVm: vms.filter((vm) => vm.operationalStatus === "Running").length,

    stoppedVm: vms.filter((vm) => vm.operationalStatus === "Stopped").length,

    provisionedVm: vms.filter((vm) => vm.lifecycleStatus === "Provisioned")
      .length,
  };

  Object.entries(stats).forEach(([id, value]) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  });
}

function renderVMTable() {
  const tbody = document.getElementById("vmTableBody");

  if (!tbody) return;

  const all = getVMs();
  const filtered = getFilteredVMs();

  updateVMStats(all);

  tbody.innerHTML = "";

  if (!filtered.length) {
    tbody.innerHTML = `
            <tr>
                <td colspan="9">
                    <div class="empty-state">
                        <strong>No VM found</strong>
                        <span>
                            Tidak ada VM yang sesuai dengan filter.
                        </span>
                    </div>
                </td>
            </tr>
        `;

    return;
  }

  filtered.forEach((vm) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>
                <button
                    type="button"
                    class="table-link"
                    data-vm-view="${escapeHTML(vm.assetCode)}"
                >
                    ${escapeHTML(vm.assetCode)}
                </button>

                <div class="table-primary">
                    ${escapeHTML(vm.vmName)}
                </div>
            </td>

            <td>
                <div class="table-primary">
                    ${escapeHTML(vm.hostname)}
                </div>

                <div class="table-secondary">
                    ${escapeHTML(vm.hypervisor)}
                </div>
            </td>

            <td>
                <span class="mono">
                    ${escapeHTML(vm.privateIp)}
                </span>

                ${
                  vm.publicIp
                    ? `
                            <div class="table-secondary mono">
                                ${escapeHTML(vm.publicIp)}
                            </div>
                          `
                    : ""
                }
            </td>

            <td>
                <span class="mono">
                    ${escapeHTML(vm.vcpu)} vCPU
                </span>

                <div class="table-secondary">
                    ${escapeHTML(vm.ram)}
                </div>
            </td>

            <td>
                <span class="mono">
                    ${escapeHTML(vm.storage)}
                </span>
            </td>

            <td>
                <div class="table-primary">
                    ${escapeHTML(vm.operatingSystem)}
                </div>

                <div class="table-secondary">
                    ${escapeHTML(vm.osVersion)}
                </div>
            </td>

            <td>
                <span class="status-badge ${statusClass(vm.lifecycleStatus)}">
                    ${escapeHTML(vm.lifecycleStatus)}
                </span>
            </td>

            <td>
                <span class="status-badge ${statusClass(vm.operationalStatus)}">
                    ${escapeHTML(vm.operationalStatus)}
                </span>
            </td>

            <td>
                <div class="table-actions">

                    <button
                        type="button"
                        class="action-btn"
                        data-vm-view="${escapeHTML(vm.assetCode)}"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        class="action-btn"
                        data-vm-edit="${escapeHTML(vm.assetCode)}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="action-btn action-btn-danger"
                        data-vm-delete="${escapeHTML(vm.assetCode)}"
                    >
                        Delete
                    </button>

                </div>
            </td>
        `;

    tbody.appendChild(row);
  });

  const result = document.getElementById("vmResultCount");

  if (result) {
    result.textContent = `${filtered.length} of ${all.length} VMs shown`;
  }
}

/* =========================================================
   VM MODAL
   ========================================================= */

function openVMModal(mode = "add", assetCode = "") {
  const modal = document.getElementById("vmModal");

  if (!modal) {
    console.warn("vmModal tidak ditemukan di HTML.");
    return;
  }

  const form = document.getElementById("vmForm");

  if (!form) {
    console.warn("vmForm tidak ditemukan di HTML.");
    return;
  }

  form.reset();

  const title = document.getElementById("vmModalTitle");

  if (title) {
    title.textContent =
      mode === "edit" ? "Edit Virtual Machine" : "Add Virtual Machine";
  }

  const codeInput = document.getElementById("vmAssetCode");

  const vm = getVMs().find((item) => item.assetCode === assetCode);

  if (mode === "edit" && vm) {
    setVMField("vmAssetCode", vm.assetCode);
    setVMField("vmName", vm.vmName);
    setVMField("vmHostname", vm.hostname);
    setVMField("vmHypervisor", vm.hypervisor);
    setVMField("vmVcpu", vm.vcpu);
    setVMField("vmRam", vm.ram);
    setVMField("vmStorage", vm.storage);
    setVMField("vmOperatingSystem", vm.operatingSystem);
    setVMField("vmOsVersion", vm.osVersion);
    setVMField("vmPrivateIp", vm.privateIp);
    setVMField("vmPublicIp", vm.publicIp);
    setVMField("vmVlan", vm.vlan);
    setVMField("vmLifecycleStatus", vm.lifecycleStatus);
    setVMField("vmOperationalStatus", vm.operationalStatus);

    if (codeInput) {
      codeInput.readOnly = true;
    }
  } else {
    if (codeInput) {
      codeInput.value = generateVMCode();
      codeInput.readOnly = true;
    }

    setVMField("vmLifecycleStatus", "Active");

    setVMField("vmOperationalStatus", "Running");
  }

  modal.dataset.mode = mode;
  modal.dataset.assetCode = assetCode;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function setVMField(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.value = value ?? "";
  }
}

function closeVMModal() {
  const modal = document.getElementById("vmModal");

  if (!modal) return;

  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
}

/* =========================================================
   VM SAVE
   ========================================================= */

function collectVMForm() {
  return {
    assetCode: document.getElementById("vmAssetCode")?.value.trim(),

    vmName: document.getElementById("vmName")?.value.trim(),

    hostname: document.getElementById("vmHostname")?.value.trim(),

    hypervisor: document.getElementById("vmHypervisor")?.value.trim(),

    vcpu: Number(document.getElementById("vmVcpu")?.value || 0),

    ram: document.getElementById("vmRam")?.value.trim(),

    storage: document.getElementById("vmStorage")?.value.trim(),

    operatingSystem: document.getElementById("vmOperatingSystem")?.value.trim(),

    osVersion: document.getElementById("vmOsVersion")?.value.trim(),

    privateIp: document.getElementById("vmPrivateIp")?.value.trim(),

    publicIp: document.getElementById("vmPublicIp")?.value.trim(),

    vlan: document.getElementById("vmVlan")?.value.trim(),

    lifecycleStatus: document.getElementById("vmLifecycleStatus")?.value,

    operationalStatus: document.getElementById("vmOperationalStatus")?.value,
  };
}

function saveVMFromForm(event) {
  event.preventDefault();

  const modal = document.getElementById("vmModal");

  const mode = modal?.dataset.mode || "add";

  const oldCode = modal?.dataset.assetCode || "";

  const formData = collectVMForm();

  if (!formData.vmName) {
    alert("VM Name wajib diisi.");
    return;
  }

  if (!formData.hostname) {
    alert("Hostname wajib diisi.");
    return;
  }

  if (!formData.hypervisor) {
    alert("Hypervisor wajib diisi.");
    return;
  }

  if (!formData.vcpu || formData.vcpu < 1) {
    alert("vCPU harus lebih dari 0.");
    return;
  }

  if (!formData.ram) {
    alert("RAM wajib diisi.");
    return;
  }

  if (!formData.storage) {
    alert("Storage wajib diisi.");
    return;
  }

  const vms = getVMs();

  if (mode === "edit") {
    const index = vms.findIndex((vm) => vm.assetCode === oldCode);

    if (index === -1) {
      alert("VM tidak ditemukan.");
      return;
    }

    vms[index] = {
      ...vms[index],
      ...formData,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  } else {
    const duplicate = vms.some((vm) => vm.assetCode === formData.assetCode);

    if (duplicate) {
      formData.assetCode = generateVMCode();
    }

    vms.push({
      ...formData,
      createdAt: new Date().toISOString().slice(0, 10),

      updatedAt: new Date().toISOString().slice(0, 10),

      publicIp: formData.publicIp || "",

      vlan: formData.vlan || "",

      hostedOn: formData.hypervisor,

      usesStorage: "",

      connectedTo: "",
    });
  }

  saveVMs(vms);

  closeVMModal();

  renderVMTable();

  showToast(
    mode === "edit" ? "VM berhasil diperbarui." : "VM berhasil ditambahkan.",
  );
}

/* =========================================================
   VM DELETE
   ========================================================= */

function deleteVM(assetCode) {
  const vms = getVMs();

  const vm = vms.find((item) => item.assetCode === assetCode);

  if (!vm) {
    alert("VM tidak ditemukan.");
    return;
  }

  openConfirmModal(
    `Hapus VM ${vm.assetCode}?`,
    `VM "${vm.vmName}" akan dihapus dari demo data.`,
    () => {
      const updated = vms.filter((item) => item.assetCode !== assetCode);

      saveVMs(updated);

      renderVMTable();

      showToast("VM berhasil dihapus.");
    },
  );
}

/* =========================================================
   VM VIEW
   ========================================================= */

function viewVM(assetCode) {
  if (!assetCode) return;

  window.location.href = `vm-detail.html?asset=${encodeURIComponent(assetCode)}`;
}

/* =========================================================
   CONFIRM MODAL
   ========================================================= */

let confirmCallback = null;

function openConfirmModal(title, message, callback) {
  const modal = document.getElementById("confirmModal");

  if (!modal) {
    if (confirm(message)) {
      callback();
    }

    return;
  }

  const titleElement = document.getElementById("confirmModalTitle");

  const messageElement = document.getElementById("confirmModalMessage");

  if (titleElement) {
    titleElement.textContent = title;
  }

  if (messageElement) {
    messageElement.textContent = message;
  }

  confirmCallback = callback;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function closeConfirmModal() {
  const modal = document.getElementById("confirmModal");

  if (!modal) return;

  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }

  confirmCallback = null;
}

function executeConfirm() {
  if (typeof confirmCallback === "function") {
    confirmCallback();
  }

  closeConfirmModal();
}

/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {
  let toast = document.getElementById("appToast");

  if (!toast) {
    toast = document.createElement("div");

    toast.id = "appToast";

    toast.className = "app-toast";

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(window.__netassetToastTimer);

  window.__netassetToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =========================================================
   VM RESET
   ========================================================= */

function resetVMDemoData() {
  openConfirmModal(
    "Reset VM Demo Data",
    "Semua data VM akan dikembalikan ke data demo awal.",
    () => {
      saveVMs(VM_DEMO_DATA);

      renderVMTable();

      showToast("VM demo data berhasil di-reset.");
    },
  );
}

/* =========================================================
   VM EVENTS
   ========================================================= */

function initVMPage() {
  if (!document.getElementById("vmTableBody")) {
    return;
  }

  renderVMTable();

  const search = document.getElementById("vmSearch");

  const lifecycle = document.getElementById("vmLifecycleFilter");

  const operational = document.getElementById("vmOperationalFilter");

  search?.addEventListener("input", renderVMTable);

  lifecycle?.addEventListener("change", renderVMTable);

  operational?.addEventListener("change", renderVMTable);

  document.addEventListener("click", (event) => {
    const view = event.target.closest("[data-vm-view]");

    if (view) {
      viewVM(view.dataset.vmView);

      return;
    }

    const edit = event.target.closest("[data-vm-edit]");

    if (edit) {
      openVMModal("edit", edit.dataset.vmEdit);

      return;
    }

    const remove = event.target.closest("[data-vm-delete]");

    if (remove) {
      deleteVM(remove.dataset.vmDelete);
    }
  });

  document
    .getElementById("addVmBtn")
    ?.addEventListener("click", () => openVMModal("add"));

  document.getElementById("vmForm")?.addEventListener("submit", saveVMFromForm);

  document
    .getElementById("vmModalClose")
    ?.addEventListener("click", closeVMModal);

  document
    .getElementById("vmCancelBtn")
    ?.addEventListener("click", closeVMModal);

  document
    .getElementById("vmResetBtn")
    ?.addEventListener("click", resetVMDemoData);

  document
    .getElementById("confirmCancelBtn")
    ?.addEventListener("click", closeConfirmModal);

  document
    .getElementById("confirmOkBtn")
    ?.addEventListener("click", executeConfirm);
}

/* =========================================================
   VPN RENDER
   ========================================================= */

function getFilteredVPNs() {
  const vpns = getVPNs();

  const search =
    document.getElementById("vpnSearch")?.value?.trim().toLowerCase() || "";

  const type = document.getElementById("vpnTypeFilter")?.value || "all";

  const status = document.getElementById("vpnStatusFilter")?.value || "all";

  return vpns.filter((vpn) => {
    const text = [
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

    return (
      (!search || text.includes(search)) &&
      (type === "all" || vpn.type === type) &&
      (status === "all" || vpn.operationalStatus === status)
    );
  });
}

/* =========================================================
   VPN STATISTICS
   ========================================================= */

function updateVPNStats(vpns) {
  const total = vpns.length;

  const active = vpns.filter((vpn) => vpn.lifecycleStatus === "Active").length;

  const connected = vpns.filter(
    (vpn) => vpn.operationalStatus === "Active",
  ).length;

  const today = new Date();

  const expiringSoon = vpns.filter((vpn) => {
    if (!vpn.expiryDate) return false;

    const expiry = new Date(vpn.expiryDate);

    const diff = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    return diff >= 0 && diff <= 30;
  }).length;

  const values = {
    vpnTotal: total,
    vpnActive: active,
    vpnConnected: connected,
    vpnExpiringSoon: expiringSoon,
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  });
}

/* =========================================================
   VPN TABLE
   ========================================================= */

function renderVPNTable() {
  const tbody = document.getElementById("vpnTableBody");

  if (!tbody) return;

  const all = getVPNs();

  const filtered = getFilteredVPNs();

  updateVPNStats(all);

  tbody.innerHTML = "";

  if (!filtered.length) {
    tbody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="empty-state">
                        <strong>No VPN found</strong>
                        <span>
                            Tidak ada VPN yang sesuai
                            dengan filter.
                        </span>
                    </div>
                </td>
            </tr>
        `;

    updateVPNCount(0, all.length);

    return;
  }

  filtered.forEach((vpn) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>
                <button
                    type="button"
                    class="table-link"
                    data-vpn-view="${escapeHTML(vpn.vpnCode)}"
                >
                    ${escapeHTML(vpn.vpnCode)}
                </button>

                <div class="table-primary">
                    ${escapeHTML(vpn.vpnName)}
                </div>

                ${
                  vpn.description
                    ? `
                            <div class="table-secondary">
                                ${escapeHTML(vpn.description)}
                            </div>
                          `
                    : ""
                }
            </td>


            <td>
                ${escapeHTML(vpn.type)}
            </td>


            <td>
                <span class="mono">
                    ${escapeHTML(vpn.protocol)}
                </span>
            </td>


            <td>
                <span class="mono">
                    ${escapeHTML(vpn.localEndpoint)}
                </span>
            </td>


            <td>
                <span class="mono">
                    ${escapeHTML(vpn.remoteEndpoint)}
                </span>
            </td>


            <td>
                <span class="status-badge ${statusClass(vpn.operationalStatus)}">
                    ${escapeHTML(vpn.operationalStatus)}
                </span>
            </td>


            <td>
                <span class="status-badge ${statusClass(vpn.lifecycleStatus)}">
                    ${escapeHTML(vpn.lifecycleStatus)}
                </span>
            </td>


            <td>
                <div class="table-actions">

                    <button
                        type="button"
                        class="action-btn"
                        data-vpn-view="${escapeHTML(vpn.vpnCode)}"
                    >
                        View
                    </button>

                    <button
                        type="button"
                        class="action-btn"
                        data-vpn-edit="${escapeHTML(vpn.vpnCode)}"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="action-btn action-btn-danger"
                        data-vpn-delete="${escapeHTML(vpn.vpnCode)}"
                    >
                        Delete
                    </button>

                </div>
            </td>
        `;

    tbody.appendChild(row);
  });

  updateVPNCount(filtered.length, all.length);
}

function updateVPNCount(filtered, total) {
  const element = document.getElementById("vpnResultCount");

  if (!element) return;

  element.textContent = `${filtered} of ${total} VPNs shown`;
}

/* =========================================================
   VPN MODAL
   ========================================================= */

function openVPNModal(mode = "add", vpnCode = "") {
  const modal = document.getElementById("vpnModal");

  const form = document.getElementById("vpnForm");

  if (!modal || !form) {
    console.warn("vpnModal atau vpnForm tidak ditemukan.");

    return;
  }

  form.reset();

  const title = document.getElementById("vpnModalTitle");

  if (title) {
    title.textContent = mode === "edit" ? "Edit VPN" : "Add VPN";
  }

  const vpn = getVPNs().find((item) => item.vpnCode === vpnCode);

  if (mode === "edit" && vpn) {
    setVPNField("vpnCode", vpn.vpnCode);

    setVPNField("vpnName", vpn.vpnName);

    setVPNField("vpnDescription", vpn.description);

    setVPNField("vpnType", vpn.type);

    setVPNField("vpnProtocol", vpn.protocol);

    setVPNField("vpnEncryption", vpn.encryption);

    setVPNField("vpnAuthentication", vpn.authentication);

    setVPNField("vpnLocalEndpoint", vpn.localEndpoint);

    setVPNField("vpnRemoteEndpoint", vpn.remoteEndpoint);

    setVPNField("vpnRemoteNetwork", vpn.remoteNetwork);

    setVPNField("vpnLifecycleStatus", vpn.lifecycleStatus);

    setVPNField("vpnOperationalStatus", vpn.operationalStatus);

    setVPNField("vpnStartDate", vpn.startDate);

    setVPNField("vpnExpiryDate", vpn.expiryDate);

    setVPNField("vpnCustomer", vpn.customer);

    setVPNField("vpnLocation", vpn.location);

    setVPNField("vpnRelatedAsset", vpn.relatedAsset);

    const codeInput = document.getElementById("vpnCode");

    if (codeInput) {
      codeInput.readOnly = true;
    }
  } else {
    setVPNField("vpnCode", generateVPNCode());

    setVPNField("vpnLifecycleStatus", "Active");

    setVPNField("vpnOperationalStatus", "Active");

    const codeInput = document.getElementById("vpnCode");

    if (codeInput) {
      codeInput.readOnly = true;
    }
  }

  modal.dataset.mode = mode;

  modal.dataset.vpnCode = vpnCode;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function setVPNField(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.value = value ?? "";
  }
}

function closeVPNModal() {
  const modal = document.getElementById("vpnModal");

  if (!modal) return;

  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
}

/* =========================================================
   VPN FORM
   ========================================================= */

function collectVPNForm() {
  return {
    vpnCode: document.getElementById("vpnCode")?.value.trim(),

    vpnName: document.getElementById("vpnName")?.value.trim(),

    description: document.getElementById("vpnDescription")?.value.trim(),

    type: document.getElementById("vpnType")?.value,

    protocol: document.getElementById("vpnProtocol")?.value,

    encryption: document.getElementById("vpnEncryption")?.value.trim(),

    authentication: document.getElementById("vpnAuthentication")?.value.trim(),

    localEndpoint: document.getElementById("vpnLocalEndpoint")?.value.trim(),

    remoteEndpoint: document.getElementById("vpnRemoteEndpoint")?.value.trim(),

    remoteNetwork: document.getElementById("vpnRemoteNetwork")?.value.trim(),

    operationalStatus: document.getElementById("vpnOperationalStatus")?.value,

    startDate: document.getElementById("vpnStartDate")?.value,

    expiryDate: document.getElementById("vpnExpiryDate")?.value,

    customer: document.getElementById("vpnCustomer")?.value.trim(),

    location: document.getElementById("vpnLocation")?.value.trim(),

    relatedAsset: document.getElementById("vpnRelatedAsset")?.value.trim(),
  };
}

/* =========================================================
   VPN SAVE
   ========================================================= */

function saveVPNFromForm(event) {
  event.preventDefault();

  const modal = document.getElementById("vpnModal");

  const mode = modal?.dataset.mode || "add";

  const oldCode = modal?.dataset.vpnCode || "";

  const formData = collectVPNForm();

  if (!formData.vpnName) {
    alert("VPN Name wajib diisi.");

    return;
  }

  if (!formData.type) {
    alert("VPN Type wajib dipilih.");

    return;
  }

  if (!formData.protocol) {
    alert("Protocol wajib dipilih.");

    return;
  }

  const vpns = getVPNs();

  if (mode === "edit") {
    const index = vpns.findIndex((vpn) => vpn.vpnCode === oldCode);

    if (index === -1) {
      alert("VPN tidak ditemukan.");

      return;
    }

    vpns[index] = {
      ...vpns[index],
      ...formData,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  } else {
    const duplicate = vpns.some((vpn) => vpn.vpnCode === formData.vpnCode);

    if (duplicate) {
      formData.vpnCode = generateVPNCode();
    }

    vpns.push({
      ...formData,

      createdAt: new Date().toISOString().slice(0, 10),

      updatedAt: new Date().toISOString().slice(0, 10),
    });
  }

  saveVPNs(vpns);

  closeVPNModal();

  renderVPNTable();

  showToast(
    mode === "edit" ? "VPN berhasil diperbarui." : "VPN berhasil ditambahkan.",
  );
}

/* =========================================================
   VPN VIEW
   ========================================================= */

function viewVPN(vpnCode) {
  if (!vpnCode) return;

  window.location.href = `vpn-detail.html?vpn=${encodeURIComponent(vpnCode)}`;
}

/* =========================================================
   VPN DELETE
   ========================================================= */

function deleteVPN(vpnCode) {
  const vpns = getVPNs();

  const vpn = vpns.find((item) => item.vpnCode === vpnCode);

  if (!vpn) {
    alert("VPN tidak ditemukan.");

    return;
  }

  openConfirmModal(
    `Hapus VPN ${vpn.vpnCode}?`,

    `VPN "${vpn.vpnName}" akan dihapus dari demo data.`,

    () => {
      const updated = vpns.filter((item) => item.vpnCode !== vpnCode);

      saveVPNs(updated);

      renderVPNTable();

      showToast("VPN berhasil dihapus.");
    },
  );
}

/* =========================================================
   VPN RESET
   ========================================================= */

function resetVPNDemoData() {
  openConfirmModal(
    "Reset VPN Demo Data",

    "Semua data VPN akan dikembalikan ke data demo awal.",

    () => {
      saveVPNs(VPN_DEMO_DATA);

      renderVPNTable();

      showToast("VPN demo data berhasil di-reset.");
    },
  );
}

/* =========================================================
   VPN EVENTS
   ========================================================= */

function initVPNPage() {
  if (!document.getElementById("vpnTableBody")) {
    return;
  }

  /*
   * Render pertama.
   * Ini yang memastikan VPN tidak lagi
   * tampil 0 ketika localStorage kosong.
   */
  renderVPNTable();

  const search = document.getElementById("vpnSearch");

  const type = document.getElementById("vpnTypeFilter");

  const status = document.getElementById("vpnStatusFilter");

  search?.addEventListener("input", renderVPNTable);

  type?.addEventListener("change", renderVPNTable);

  status?.addEventListener("change", renderVPNTable);

  document.addEventListener("click", (event) => {
    const view = event.target.closest("[data-vpn-view]");

    if (view) {
      viewVPN(view.dataset.vpnView);

      return;
    }

    const edit = event.target.closest("[data-vpn-edit]");

    if (edit) {
      openVPNModal("edit", edit.dataset.vpnEdit);

      return;
    }

    const remove = event.target.closest("[data-vpn-delete]");

    if (remove) {
      deleteVPN(remove.dataset.vpnDelete);
    }
  });

  document
    .getElementById("vpnAddBtn")
    ?.addEventListener("click", () => openVPNModal("add"));

  document
    .getElementById("vpnForm")
    ?.addEventListener("submit", saveVPNFromForm);

  // CLOSE BUTTON (×)
  document
    .getElementById("vpnModalClose")
    ?.addEventListener("click", closeVPNModal);

  // CANCEL BUTTON
  document
    .getElementById("vpnCancelBtn")
    ?.addEventListener("click", closeVPNModal);

  document
    .getElementById("vpnResetBtn")
    ?.addEventListener("click", resetVPNDemoData);
}

/* =========================================================
   GLOBAL REFRESH
   ========================================================= */
/* =========================================================
   GLOBAL REFRESH
   ========================================================= */

function refreshVirtualResources() {
  if (document.getElementById("vmTableBody")) {
    renderVMTable();
  }

  if (document.getElementById("vpnTableBody")) {
    renderVPNTable();
  }

  if (document.getElementById("licenseTableBody")) {
    renderLicenseTable();
  }
}

/* =========================================================
   FINAL INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /*
   * Jangan membuat localStorage kosong.
   * Kalau belum ada data, otomatis isi demo.
   */

  getVMs();
  getVPNs();
  getLicenses();

  initVMPage();
  initVPNPage();
  initLicensePage();

  document
    .getElementById("refreshVirtualResources")
    ?.addEventListener("click", refreshVirtualResources);

  document
    .getElementById("refreshBtn")
    ?.addEventListener("click", refreshVirtualResources);
});

/* =========================================================
   LICENSE
   ========================================================= */

const LICENSE_STORAGE_KEY = "netasset_licenses";

const LICENSE_DEMO_DATA = [
  {
    licenseCode: "LIC-0001",
    licenseName: "Microsoft Windows Server License",
    description: "Windows Server licensing for core infrastructure.",
    type: "Subscription",
    vendor: "Microsoft",
    product: "Windows Server 2025",
    licenseId: "MS-WIN-2025-0001",
    seats: 20,
    usedSeats: 14,
    startDate: "2026-01-15",
    expiryDate: "2027-01-15",
    lifecycleStatus: "Active",
    operationalStatus: "Active",
    customer: "PT Nusantara Digital",
    provider: "Microsoft",
    location: "Jakarta DC-01",
    relatedAsset: "SRV-JKT-001",
    createdAt: "2026-01-15",
    updatedAt: "2026-08-10",
  },

  {
    licenseCode: "LIC-0002",
    licenseName: "VMware vSphere License",
    description: "Virtualization platform license for production hosts.",
    type: "Subscription",
    vendor: "VMware",
    product: "vSphere Foundation",
    licenseId: "VMW-VSP-0002",
    seats: 16,
    usedSeats: 12,
    startDate: "2026-02-01",
    expiryDate: "2027-02-01",
    lifecycleStatus: "Active",
    operationalStatus: "Active",
    customer: "PT Nusantara Digital",
    provider: "VMware",
    location: "Jakarta DC-01",
    relatedAsset: "VM-0001",
    createdAt: "2026-02-01",
    updatedAt: "2026-08-09",
  },

  {
    licenseCode: "LIC-0003",
    licenseName: "Red Hat Enterprise Linux",
    description: "Enterprise Linux subscription for application servers.",
    type: "Subscription",
    vendor: "Red Hat",
    product: "RHEL 9",
    licenseId: "RHEL-9-0003",
    seats: 12,
    usedSeats: 8,
    startDate: "2026-03-10",
    expiryDate: "2027-03-10",
    lifecycleStatus: "Active",
    operationalStatus: "Active",
    customer: "PT Global Network Indonesia",
    provider: "Red Hat",
    location: "Jakarta POP-01",
    relatedAsset: "SRV-JKT-002",
    createdAt: "2026-03-10",
    updatedAt: "2026-08-08",
  },

  {
    licenseCode: "LIC-0004",
    licenseName: "Cisco DNA Center License",
    description: "Network management software license.",
    type: "Subscription",
    vendor: "Cisco",
    product: "DNA Center",
    licenseId: "CISCO-DNA-0004",
    seats: 5,
    usedSeats: 2,
    startDate: "2026-08-01",
    expiryDate: "2026-09-10",
    lifecycleStatus: "Provisioned",
    operationalStatus: "Inactive",
    customer: "PT Data Prima",
    provider: "Cisco",
    location: "Jakarta POP-01",
    relatedAsset: "RTR-JKT-001",
    createdAt: "2026-08-01",
    updatedAt: "2026-08-11",
  },

  {
    licenseCode: "LIC-0005",
    licenseName: "Microsoft SQL Server License",
    description: "Legacy SQL Server license scheduled for retirement.",
    type: "Perpetual",
    vendor: "Microsoft",
    product: "SQL Server 2019",
    licenseId: "MS-SQL-2019-0005",
    seats: 10,
    usedSeats: 10,
    startDate: "2023-01-01",
    expiryDate: "2026-07-01",
    lifecycleStatus: "Retired",
    operationalStatus: "Expired",
    customer: "PT Global Network Indonesia",
    provider: "Microsoft",
    location: "Surabaya POP-01",
    relatedAsset: "SRV-SBY-001",
    createdAt: "2023-01-01",
    updatedAt: "2026-07-01",
  },
];

function getLicenses() {
  try {
    const saved = localStorage.getItem(LICENSE_STORAGE_KEY);

    if (!saved) {
      saveLicenses(LICENSE_DEMO_DATA);
      return [...LICENSE_DEMO_DATA];
    }

    const data = JSON.parse(saved);

    if (!Array.isArray(data) || data.length === 0) {
      saveLicenses(LICENSE_DEMO_DATA);
      return [...LICENSE_DEMO_DATA];
    }

    return data;
  } catch (error) {
    console.error(error);
    saveLicenses(LICENSE_DEMO_DATA);
    return [...LICENSE_DEMO_DATA];
  }
}

function saveLicenses(data) {
  localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(data));
}

function generateLicenseCode() {
  const licenses = getLicenses();

  let highest = 0;

  licenses.forEach((license) => {
    const match = String(license.licenseCode || "").match(/^LIC-(\d+)$/);

    if (match) {
      highest = Math.max(highest, Number(match[1]));
    }
  });

  return `LIC-${String(highest + 1).padStart(4, "0")}`;
}

function getLicenseExpiryState(license) {
  if (!license.expiryDate) {
    return "No Expiry";
  }

  if (license.operationalStatus === "Expired") {
    return "Expired";
  }

  const today = new Date();

  const expiry = new Date(`${license.expiryDate}T23:59:59`);

  const diffDays = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) {
    return "Expired";
  }

  if (diffDays <= 30) {
    return "Expiring Soon";
  }

  return "Valid";
}

function getFilteredLicenses() {
  const licenses = getLicenses();

  const search =
    document.getElementById("licenseSearch")?.value?.trim().toLowerCase() || "";

  const type = document.getElementById("licenseTypeFilter")?.value || "";

  const status = document.getElementById("licenseStatusFilter")?.value || "";

  return licenses.filter((license) => {
    const text = [
      license.licenseCode,
      license.licenseName,
      license.type,
      license.vendor,
      license.product,
      license.licenseId,
      license.customer,
      license.provider,
      license.location,
      license.relatedAsset,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!search || text.includes(search)) &&
      (!type || license.type === type) &&
      (!status || license.operationalStatus === status)
    );
  });
}

function updateLicenseStats(licenses) {
  const total = licenses.length;

  const active = licenses.filter(
    (license) => license.operationalStatus === "Active",
  ).length;

  const expiringSoon = licenses.filter(
    (license) => getLicenseExpiryState(license) === "Expiring Soon",
  ).length;

  const expired = licenses.filter(
    (license) => getLicenseExpiryState(license) === "Expired",
  ).length;

  const values = {
    statTotal: total,
    statActive: active,
    statExpiring: expiringSoon,
    statExpired: expired,
  };

  Object.entries(values).forEach(([id, value]) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  });
}

function renderLicenseTable() {
  const tbody = document.getElementById("licenseTableBody");

  if (!tbody) return;

  const all = getLicenses();
  const filtered = getFilteredLicenses();

  updateLicenseStats(all);

  tbody.innerHTML = "";

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-state">
            <strong>No License found</strong>
            <span>
              Tidak ada license yang sesuai
              dengan filter.
            </span>
          </div>
        </td>
      </tr>
    `;

    updateLicenseCount(0, all.length);

    return;
  }

  filtered.forEach((license) => {
    const row = document.createElement("tr");

    const expiryState = getLicenseExpiryState(license);

    const lifecycleClass = statusClass(license.lifecycleStatus);

    const operationalClass = statusClass(license.operationalStatus);

    row.innerHTML = `
      <td>
        <button
          type="button"
          class="table-link"
          data-license-view="${escapeHTML(license.licenseCode)}"
        >
          ${escapeHTML(license.licenseCode)}
        </button>

        <div class="table-primary">
          ${escapeHTML(license.licenseName)}
        </div>

        ${
          license.description
            ? `
              <div class="table-secondary">
                ${escapeHTML(license.description)}
              </div>
            `
            : ""
        }
      </td>

      <td>
        ${escapeHTML(license.type)}
      </td>

      <td>
        <div class="table-primary">
          ${escapeHTML(license.vendor)}
        </div>
      </td>

      <td>
        <div class="table-primary">
          ${escapeHTML(license.product)}
        </div>
      </td>

      <td>
        <span class="mono">
          ${escapeHTML(license.licenseId)}
        </span>
      </td>

      <td>
        <span class="mono">
          ${escapeHTML(license.expiryDate || "—")}
        </span>

        ${
          expiryState !== "Valid" && expiryState !== "No Expiry"
            ? `
              <div class="table-secondary">
                ${escapeHTML(expiryState)}
              </div>
            `
            : ""
        }
      </td>

      <td>
        <span class="status-badge ${escapeHTML(lifecycleClass)}">
          ${escapeHTML(license.lifecycleStatus)}
        </span>
      </td>

      <td>
        <span class="status-badge ${escapeHTML(operationalClass)}">
          ${escapeHTML(license.operationalStatus)}
        </span>
      </td>

      <td>
        <div class="table-actions">
          <button
            type="button"
            class="action-btn"
            data-license-view="${escapeHTML(license.licenseCode)}"
          >
            View
          </button>

          <button
            type="button"
            class="action-btn"
            data-license-edit="${escapeHTML(license.licenseCode)}"
          >
            Edit
          </button>

          <button
            type="button"
            class="action-btn action-btn-danger"
            data-license-delete="${escapeHTML(license.licenseCode)}"
          >
            Delete
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });

  updateLicenseCount(filtered.length, all.length);
}

function updateLicenseCount(filtered, total) {
  const element = document.getElementById("licenseResultCount");

  if (!element) return;

  element.textContent = `${filtered} of ${total} Licenses shown`;
}

/* =========================================================
   LICENSE MODAL
   ========================================================= */

function openLicenseModal(mode = "add", licenseCode = "") {
  const modal = document.getElementById("licenseModal");

  const form = document.getElementById("licenseForm");

  if (!modal || !form) {
    console.warn("licenseModal atau licenseForm tidak ditemukan.");

    return;
  }

  form.reset();

  const title = document.getElementById("licenseModalTitle");

  if (title) {
    title.textContent = mode === "edit" ? "Edit License" : "Add License";
  }

  const license = getLicenses().find(
    (item) => item.licenseCode === licenseCode,
  );

  const codeInput = document.getElementById("licenseCode");

  if (mode === "edit" && license) {
    setLicenseField("licenseCode", license.licenseCode);

    setLicenseField("licenseName", license.licenseName);

    setLicenseField("licenseDescription", license.description);

    setLicenseField("licenseType", license.type);

    setLicenseField("licenseVendor", license.vendor);

    setLicenseField("licenseProduct", license.product);

    setLicenseField("licenseId", license.licenseId);

    setLicenseField("licenseSeats", license.seats);

    setLicenseField("licenseUsedSeats", license.usedSeats);

    setLicenseField("licenseStartDate", license.startDate);

    setLicenseField("licenseExpiryDate", license.expiryDate);

    setLicenseField("licenseLifecycle", license.lifecycleStatus);

    setLicenseField("licenseStatus", license.operationalStatus);

    setLicenseField("licenseCustomer", license.customer);

    setLicenseField("licenseProvider", license.provider);

    setLicenseField("licenseLocation", license.location);

    setLicenseField("licenseRelatedAsset", license.relatedAsset);

    if (codeInput) {
      codeInput.readOnly = true;
    }
  } else {
    setLicenseField("licenseCode", generateLicenseCode());

    setLicenseField("licenseLifecycle", "Active");

    setLicenseField("licenseStatus", "Active");

    if (codeInput) {
      codeInput.readOnly = true;
    }
  }

  modal.dataset.mode = mode;
  modal.dataset.licenseCode = licenseCode;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function setLicenseField(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.value = value ?? "";
  }
}

function closeLicenseModal() {
  const modal = document.getElementById("licenseModal");

  if (!modal) return;

  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
}

/* =========================================================
   LICENSE FORM
   ========================================================= */

function collectLicenseForm() {
  return {
    licenseCode: document.getElementById("licenseCode")?.value.trim(),

    licenseName: document.getElementById("licenseName")?.value.trim(),

    description: document.getElementById("licenseDescription")?.value.trim(),

    type: document.getElementById("licenseType")?.value,

    vendor: document.getElementById("licenseVendor")?.value.trim(),

    product: document.getElementById("licenseProduct")?.value.trim(),

    licenseId: document.getElementById("licenseId")?.value.trim(),

    seats: Number(document.getElementById("licenseSeats")?.value || 0),

    usedSeats: Number(document.getElementById("licenseUsedSeats")?.value || 0),

    startDate: document.getElementById("licenseStartDate")?.value,

    expiryDate: document.getElementById("licenseExpiryDate")?.value,

    lifecycleStatus: document.getElementById("licenseLifecycle")?.value,

    operationalStatus: document.getElementById("licenseStatus")?.value,

    customer: document.getElementById("licenseCustomer")?.value,

    provider: document.getElementById("licenseProvider")?.value,

    location: document.getElementById("licenseLocation")?.value,

    relatedAsset: document.getElementById("licenseRelatedAsset")?.value,
  };
}

/* =========================================================
   LICENSE SAVE
   ========================================================= */

function saveLicenseFromForm(event) {
  event.preventDefault();

  const modal = document.getElementById("licenseModal");

  const mode = modal?.dataset.mode || "add";

  const oldCode = modal?.dataset.licenseCode || "";

  const formData = collectLicenseForm();

  if (!formData.licenseName) {
    alert("License Name wajib diisi.");

    return;
  }

  if (!formData.type) {
    alert("License Type wajib dipilih.");

    return;
  }

  if (!formData.vendor) {
    alert("Vendor wajib diisi.");

    return;
  }

  if (!formData.product) {
    alert("Product wajib diisi.");

    return;
  }

  if (!formData.licenseId) {
    alert("License ID / Key wajib diisi.");

    return;
  }

  if (formData.seats < 0 || formData.usedSeats < 0) {
    alert("Seats tidak boleh bernilai negatif.");

    return;
  }

  if (formData.usedSeats > formData.seats && formData.seats > 0) {
    alert("Used Seats tidak boleh lebih besar dari Seats.");

    return;
  }

  if (
    formData.startDate &&
    formData.expiryDate &&
    formData.expiryDate < formData.startDate
  ) {
    alert("Expiry Date tidak boleh sebelum Start Date.");

    return;
  }

  const licenses = getLicenses();

  if (mode === "edit") {
    const index = licenses.findIndex(
      (license) => license.licenseCode === oldCode,
    );

    if (index === -1) {
      alert("License tidak ditemukan.");

      return;
    }

    licenses[index] = {
      ...licenses[index],
      ...formData,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
  } else {
    const duplicateCode = licenses.some(
      (license) => license.licenseCode === formData.licenseCode,
    );

    if (duplicateCode) {
      formData.licenseCode = generateLicenseCode();
    }

    const duplicateLicenseId = licenses.some(
      (license) => license.licenseId === formData.licenseId,
    );

    if (duplicateLicenseId) {
      alert("License ID / Key sudah digunakan.");

      return;
    }

    licenses.push({
      ...formData,
      createdAt: new Date().toISOString().slice(0, 10),

      updatedAt: new Date().toISOString().slice(0, 10),
    });
  }

  saveLicenses(licenses);

  closeLicenseModal();

  renderLicenseTable();

  showToast(
    mode === "edit"
      ? "License berhasil diperbarui."
      : "License berhasil ditambahkan.",
  );
}

/* =========================================================
   LICENSE VIEW
   ========================================================= */

function viewLicense(licenseCode) {
  if (!licenseCode) return;

  window.location.href = `license-detail.html?license=${encodeURIComponent(
    licenseCode,
  )}`;
}

/* =========================================================
   LICENSE DELETE
   ========================================================= */

function deleteLicense(licenseCode) {
  const licenses = getLicenses();

  const license = licenses.find((item) => item.licenseCode === licenseCode);

  if (!license) {
    alert("License tidak ditemukan.");

    return;
  }

  openConfirmModal(
    `Hapus License ${license.licenseCode}?`,
    `License "${license.licenseName}" akan dihapus dari demo data.`,
    () => {
      const updated = licenses.filter(
        (item) => item.licenseCode !== licenseCode,
      );

      saveLicenses(updated);

      renderLicenseTable();

      showToast("License berhasil dihapus.");
    },
  );
}

/* =========================================================
   LICENSE RESET
   ========================================================= */

function resetLicenseDemoData() {
  openConfirmModal(
    "Reset License Demo Data",
    "Semua data License akan dikembalikan ke data demo awal.",
    () => {
      saveLicenses(LICENSE_DEMO_DATA);

      renderLicenseTable();

      showToast("License demo data berhasil di-reset.");
    },
  );
}

/* =========================================================
   LICENSE EVENTS
   ========================================================= */

function initLicensePage() {
  if (!document.getElementById("licenseTableBody")) {
    return;
  }

  renderLicenseTable();

  const search = document.getElementById("licenseSearch");

  const type = document.getElementById("licenseTypeFilter");

  const status = document.getElementById("licenseStatusFilter");

  search?.addEventListener("input", renderLicenseTable);

  type?.addEventListener("change", renderLicenseTable);

  status?.addEventListener("change", renderLicenseTable);

  document.addEventListener("click", (event) => {
    const view = event.target.closest("[data-license-view]");

    if (view) {
      viewLicense(view.dataset.licenseView);

      return;
    }

    const edit = event.target.closest("[data-license-edit]");

    if (edit) {
      openLicenseModal("edit", edit.dataset.licenseEdit);

      return;
    }

    const remove = event.target.closest("[data-license-delete]");

    if (remove) {
      deleteLicense(remove.dataset.licenseDelete);
    }
  });

  document
    .getElementById("licenseAddBtn")
    ?.addEventListener("click", () => openLicenseModal("add"));

  document
    .getElementById("licenseForm")
    ?.addEventListener("submit", saveLicenseFromForm);

  document
    .getElementById("licenseModalClose")
    ?.addEventListener("click", closeLicenseModal);

  document
    .getElementById("licenseCancelBtn")
    ?.addEventListener("click", closeLicenseModal);

  document
    .getElementById("licenseResetBtn")
    ?.addEventListener("click", resetLicenseDemoData);
}
