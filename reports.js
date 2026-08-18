/* =========================================================
   NETASSET — REPORTS
   reports.js

   Responsibilities:
   - Report catalog
   - Report workspace
   - Report selection
   - Search
   - Location filter
   - Status filter
   - Statistics
   - Table rendering
   - Refresh
   - Print
   - CSV export
   - Back to catalog
   - localStorage integration

   Architecture:
   HTML
      ↓
   reports.css
      ↓
   reports.js

   Prototype data is kept compatible with the NETASSET
   asset / location / network resource concepts.
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIGURATION
  ========================================================== */

  const STORAGE_KEY = "netasset.reports";

  const LAST_REPORT_KEY = "netasset.reports.lastReport";

  /* =========================================================
     REPORT DEFINITIONS
  ========================================================== */

  const REPORTS = {
    "asset-inventory": {
      id: "asset-inventory",
      category: "Asset",
      title: "Asset Inventory",
      description:
        "Complete inventory of NETASSET physical and logical assets.",
    },

    "asset-lifecycle": {
      id: "asset-lifecycle",
      category: "Asset",
      title: "Asset Lifecycle",
      description:
        "Review asset distribution across lifecycle and operational statuses.",
    },

    "assets-by-location": {
      id: "assets-by-location",
      category: "Asset",
      title: "Assets by Location",
      description:
        "Review asset distribution across registered network locations.",
    },

    "ip-utilization": {
      id: "ip-utilization",
      category: "Network",
      title: "IP Address Utilization",
      description: "Review IP allocation and utilization across IP pools.",
    },

    "vlan-inventory": {
      id: "vlan-inventory",
      category: "Network",
      title: "VLAN Inventory",
      description:
        "Review VLAN allocation, purpose, VRF and operational status.",
    },

    "asn-inventory": {
      id: "asn-inventory",
      category: "Network",
      title: "ASN Inventory",
      description: "Review registered autonomous system numbers and ownership.",
    },

    "location-inventory": {
      id: "location-inventory",
      category: "Location",
      title: "Location Inventory",
      description: "Review all network locations and their hierarchy.",
    },

    "location-asset-summary": {
      id: "location-asset-summary",
      category: "Location",
      title: "Location Asset Summary",
      description: "Review asset distribution and composition by location.",
    },

    "virtual-resource-inventory": {
      id: "virtual-resource-inventory",
      category: "Virtual",
      title: "Virtual Resource Inventory",
      description:
        "Review VM, VPN, certificate, license and storage resources.",
    },

    "expiration-monitoring": {
      id: "expiration-monitoring",
      category: "Virtual",
      title: "Certificate & License Expiration",
      description: "Monitor certificates and licenses approaching expiration.",
    },

    "provider-resource-summary": {
      id: "provider-resource-summary",
      category: "Business",
      title: "Provider Resource Summary",
      description:
        "Review assets and network resources associated with providers.",
    },

    "customer-resource-summary": {
      id: "customer-resource-summary",
      category: "Business",
      title: "Customer Resource Summary",
      description: "Review resources assigned to customers.",
    },

    "asset-assignment": {
      id: "asset-assignment",
      category: "Infrastructure",
      title: "Asset Assignment",
      description: "Review current and historical asset assignments.",
    },

    "network-topology-summary": {
      id: "network-topology-summary",
      category: "Infrastructure",
      title: "Network Topology Summary",
      description: "Review asset relationships and network connections.",
    },
  };

  /* =========================================================
     STATE
  ========================================================== */

  let reportData = [];

  let activeReportId = null;

  let filteredData = [];

  let searchTerm = "";

  let locationFilter = "all";

  let statusFilter = "all";

  /* =========================================================
     DOM REFERENCES
  ========================================================== */

  const elements = {
    /* HEADER */

    refreshButton: document.getElementById("refreshReports"),

    /* OVERVIEW */

    totalAssets: document.getElementById("reportTotalAssets"),

    networkResources: document.getElementById("reportNetworkResources"),

    locations: document.getElementById("reportLocations"),

    virtualResources: document.getElementById("reportVirtualResources"),

    catalogCount: document.getElementById("reportCatalogCount"),

    /* WORKSPACE */

    workspace: document.getElementById("reportWorkspace"),

    workspaceEyebrow: document.getElementById("workspaceEyebrow"),

    workspaceTitle: document.getElementById("workspaceTitle"),

    workspaceDescription: document.getElementById("workspaceDescription"),

    backButton: document.getElementById("backToReports"),

    printButton: document.getElementById("printReport"),

    exportButton: document.getElementById("exportReport"),

    /* FILTERS */

    searchInput: document.getElementById("reportSearch"),

    locationFilter: document.getElementById("reportLocationFilter"),

    statusFilter: document.getElementById("reportStatusFilter"),

    /* WORKSPACE STATS */

    workspaceTotal: document.getElementById("workspaceTotal"),

    workspaceActive: document.getElementById("workspaceActive"),

    workspaceAvailable: document.getElementById("workspaceAvailable"),

    workspaceUpdated: document.getElementById("workspaceUpdated"),

    /* TABLE */

    tableHead: document.getElementById("reportTableHead"),

    tableBody: document.getElementById("reportTableBody"),

    resultCount: document.getElementById("reportResultCount"),
  };

  /* =========================================================
     INITIALIZATION
  ========================================================== */

  function init() {
    if (!document.body.classList.contains("reports-page")) {
      return;
    }

    loadData();

    bindEvents();

    renderOverview();

    renderCatalogCount();

    restoreLastReport();
  }

  /* =========================================================
     DATA STORAGE
  ========================================================== */

  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed) && parsed.length > 0) {
          reportData = parsed.map(normalizeRecord);

          return;
        }
      }
    } catch (error) {
      console.warn(
        "NETASSET Reports: failed to load localStorage data.",
        error,
      );
    }

    reportData = createDemoData();

    saveData();
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reportData));
    } catch (error) {
      console.warn(
        "NETASSET Reports: failed to save localStorage data.",
        error,
      );
    }
  }

  /* =========================================================
     NORMALIZE RECORD
  ========================================================== */

  function normalizeRecord(record) {
    return {
      id: record.id || createId(),

      resource: record.resource || "Unknown Resource",

      code: record.code || "",

      type: record.type || "Unknown",

      location: record.location || "Unassigned",

      status: record.status || "Active",

      category: record.category || "asset",

      updated: record.updated || getCurrentDate(),

      provider: record.provider || "",

      customer: record.customer || "",

      parent: record.parent || "",

      address: record.address || "",

      ip: record.ip || "",

      pool: record.pool || "",

      vlan: record.vlan || "",

      asn: record.asn || "",

      assignedTo: record.assignedTo || "",
    };
  }

  /* =========================================================
     DEMO DATA
  ========================================================== */

  function createDemoData() {
    return [
      /* =====================================================
         ASSETS
      ===================================================== */

      {
        id: "asset-001",
        resource: "Core Router",
        code: "RTR-JKT-001",
        type: "Router",
        location: "POP Jakarta",
        status: "Active",
        category: "asset",
        updated: "2026-08-12",
      },

      {
        id: "asset-002",
        resource: "Core Switch",
        code: "SW-JKT-001",
        type: "Switch",
        location: "POP Jakarta",
        status: "Active",
        category: "asset",
        updated: "2026-08-11",
      },

      {
        id: "asset-003",
        resource: "Application Server",
        code: "SRV-JKT-001",
        type: "Server",
        location: "DCI Cibitung",
        status: "Active",
        category: "asset",
        updated: "2026-08-10",
      },

      {
        id: "asset-004",
        resource: "Edge Router",
        code: "RTR-BDG-001",
        type: "Router",
        location: "POP Bandung",
        status: "Provisioned",
        category: "asset",
        updated: "2026-08-09",
      },

      {
        id: "asset-005",
        resource: "Distribution Switch",
        code: "SW-SBY-001",
        type: "Switch",
        location: "POP Surabaya",
        status: "Active",
        category: "asset",
        updated: "2026-08-08",
      },

      {
        id: "asset-006",
        resource: "Legacy Router",
        code: "RTR-JKT-099",
        type: "Router",
        location: "POP Jakarta",
        status: "Retired",
        category: "asset",
        updated: "2026-08-01",
      },

      /* =====================================================
         IP ADDRESSES
      ===================================================== */

      {
        id: "ip-001",
        resource: "10.10.0.1",
        code: "IP-0001",
        type: "IPv4",
        location: "POP Jakarta",
        status: "Active",
        category: "ip",
        updated: "2026-08-12",
        pool: "10.10.0.0/24",
      },

      {
        id: "ip-002",
        resource: "10.10.0.2",
        code: "IP-0002",
        type: "IPv4",
        location: "POP Jakarta",
        status: "Active",
        category: "ip",
        updated: "2026-08-12",
        pool: "10.10.0.0/24",
      },

      {
        id: "ip-003",
        resource: "10.10.0.3",
        code: "IP-0003",
        type: "IPv4",
        location: "POP Jakarta",
        status: "Available",
        category: "ip",
        updated: "2026-08-11",
        pool: "10.10.0.0/24",
      },

      {
        id: "ip-004",
        resource: "10.20.0.1",
        code: "IP-0010",
        type: "IPv4",
        location: "DCI Cibitung",
        status: "Active",
        category: "ip",
        updated: "2026-08-10",
        pool: "10.20.0.0/24",
      },

      {
        id: "ip-005",
        resource: "10.30.0.1",
        code: "IP-0020",
        type: "IPv4",
        location: "POP Bandung",
        status: "Available",
        category: "ip",
        updated: "2026-08-09",
        pool: "10.30.0.0/24",
      },

      /* =====================================================
         VLAN
      ===================================================== */

      {
        id: "vlan-001",
        resource: "VLAN 100",
        code: "VLAN-100",
        type: "VLAN",
        location: "POP Jakarta",
        status: "Active",
        category: "vlan",
        updated: "2026-08-12",
      },

      {
        id: "vlan-002",
        resource: "VLAN 200",
        code: "VLAN-200",
        type: "VLAN",
        location: "DCI Cibitung",
        status: "Active",
        category: "vlan",
        updated: "2026-08-10",
      },

      {
        id: "vlan-003",
        resource: "VLAN 300",
        code: "VLAN-300",
        type: "VLAN",
        location: "POP Bandung",
        status: "Inactive",
        category: "vlan",
        updated: "2026-08-07",
      },

      /* =====================================================
         ASN
      ===================================================== */

      {
        id: "asn-001",
        resource: "AS64512",
        code: "ASN-64512",
        type: "ASN",
        location: "POP Jakarta",
        status: "Active",
        category: "asn",
        updated: "2026-08-10",
      },

      {
        id: "asn-002",
        resource: "AS64513",
        code: "ASN-64513",
        type: "ASN",
        location: "DCI Cibitung",
        status: "Active",
        category: "asn",
        updated: "2026-08-09",
      },

      /* =====================================================
         LOCATIONS
      ===================================================== */

      {
        id: "loc-001",
        resource: "POP Jakarta",
        code: "LOC-JKT-001",
        type: "POP",
        location: "POP Jakarta",
        status: "Active",
        category: "location",
        updated: "2026-08-12",
        address: "Jl. Gatot Subroto, Jakarta Selatan",
      },

      {
        id: "loc-002",
        resource: "DCI Cibitung",
        code: "LOC-BKS-001",
        type: "Data Center",
        location: "DCI Cibitung",
        status: "Active",
        category: "location",
        updated: "2026-08-11",
        address: "Cibitung, Bekasi",
      },

      {
        id: "loc-003",
        resource: "POP Bandung",
        code: "LOC-BDG-001",
        type: "POP",
        location: "POP Bandung",
        status: "Active",
        category: "location",
        updated: "2026-08-09",
        address: "Bandung, Jawa Barat",
      },

      {
        id: "loc-004",
        resource: "POP Surabaya",
        code: "LOC-SBY-001",
        type: "POP",
        location: "POP Surabaya",
        status: "Active",
        category: "location",
        updated: "2026-08-08",
        address: "Surabaya, Jawa Timur",
      },

      /* =====================================================
         VIRTUAL RESOURCES
      ===================================================== */

      {
        id: "vm-001",
        resource: "Customer Portal VM",
        code: "VM-JKT-001",
        type: "VM",
        location: "DCI Cibitung",
        status: "Active",
        category: "virtual",
        updated: "2026-08-12",
      },

      {
        id: "vm-002",
        resource: "Monitoring VM",
        code: "VM-JKT-002",
        type: "VM",
        location: "DCI Cibitung",
        status: "Active",
        category: "virtual",
        updated: "2026-08-11",
      },

      {
        id: "vpn-001",
        resource: "Customer VPN Gateway",
        code: "VPN-JKT-001",
        type: "VPN",
        location: "POP Jakarta",
        status: "Active",
        category: "virtual",
        updated: "2026-08-10",
      },

      {
        id: "cert-001",
        resource: "Wildcard Core Certificate",
        code: "CERT-0001",
        type: "Certificate",
        location: "POP Jakarta",
        status: "Active",
        category: "certificate",
        updated: "2026-08-12",
      },

      {
        id: "cert-002",
        resource: "Customer Portal Certificate",
        code: "CERT-0002",
        type: "Certificate",
        location: "DCI Cibitung",
        status: "Active",
        category: "certificate",
        updated: "2026-08-11",
      },

      {
        id: "license-001",
        resource: "Router OS License",
        code: "LIC-0001",
        type: "License",
        location: "POP Jakarta",
        status: "Active",
        category: "license",
        updated: "2026-08-09",
      },

      /* =====================================================
         PROVIDERS
      ===================================================== */

      {
        id: "provider-001",
        resource: "Provider Alpha",
        code: "PRV-001",
        type: "Transit",
        location: "POP Jakarta",
        status: "Active",
        category: "provider",
        updated: "2026-08-10",
      },

      {
        id: "provider-002",
        resource: "Provider Beta",
        code: "PRV-002",
        type: "Upstream",
        location: "DCI Cibitung",
        status: "Active",
        category: "provider",
        updated: "2026-08-08",
      },

      /* =====================================================
         CUSTOMERS
      ===================================================== */

      {
        id: "customer-001",
        resource: "Customer Alpha",
        code: "CUS-001",
        type: "Enterprise",
        location: "POP Jakarta",
        status: "Active",
        category: "customer",
        updated: "2026-08-12",
      },

      {
        id: "customer-002",
        resource: "Customer Beta",
        code: "CUS-002",
        type: "Enterprise",
        location: "POP Bandung",
        status: "Active",
        category: "customer",
        updated: "2026-08-09",
      },

      /* =====================================================
         ASSIGNMENTS
      ===================================================== */

      {
        id: "assignment-001",
        resource: "Core Router",
        code: "RTR-JKT-001",
        type: "Asset Assignment",
        location: "POP Jakarta",
        status: "Active",
        category: "assignment",
        updated: "2026-08-12",
        assignedTo: "Network Operations",
      },

      {
        id: "assignment-002",
        resource: "Application Server",
        code: "SRV-JKT-001",
        type: "Asset Assignment",
        location: "DCI Cibitung",
        status: "Active",
        category: "assignment",
        updated: "2026-08-10",
        assignedTo: "Platform Team",
      },

      /* =====================================================
         TOPOLOGY
      ===================================================== */

      {
        id: "topology-001",
        resource: "Core Router → Core Switch",
        code: "LINK-001",
        type: "Topology Link",
        location: "POP Jakarta",
        status: "Active",
        category: "topology",
        updated: "2026-08-12",
      },

      {
        id: "topology-002",
        resource: "Core Switch → Application Server",
        code: "LINK-002",
        type: "Topology Link",
        location: "DCI Cibitung",
        status: "Active",
        category: "topology",
        updated: "2026-08-10",
      },
    ];
  }

  /* =========================================================
     EVENT BINDINGS
  ========================================================== */

  function bindEvents() {
    /* Refresh */

    elements.refreshButton?.addEventListener("click", handleRefresh);

    /* Open report */

    document.addEventListener("click", handleDocumentClick);

    /* Back */

    elements.backButton?.addEventListener("click", closeWorkspace);

    /* Search */

    elements.searchInput?.addEventListener("input", handleSearch);

    /* Location filter */

    elements.locationFilter?.addEventListener("change", handleLocationFilter);

    /* Status filter */

    elements.statusFilter?.addEventListener("change", handleStatusFilter);

    /* Export */

    elements.exportButton?.addEventListener("click", exportCurrentReport);

    /* Print */

    elements.printButton?.addEventListener("click", printCurrentReport);

    /* Escape */

    document.addEventListener("keydown", handleKeyboard);
  }

  /* =========================================================
     DOCUMENT CLICK
  ========================================================== */

  function handleDocumentClick(event) {
    const button = event.target.closest('[data-report-action="open"]');

    if (!button) {
      return;
    }

    const reportId = button.dataset.report;

    if (!reportId) {
      return;
    }

    openReport(reportId);
  }

  /* =========================================================
     SEARCH
  ========================================================== */

  function handleSearch(event) {
    searchTerm = event.target.value.trim().toLowerCase();

    renderWorkspace();
  }

  /* =========================================================
     LOCATION FILTER
  ========================================================== */

  function handleLocationFilter(event) {
    locationFilter = event.target.value;

    renderWorkspace();
  }

  /* =========================================================
     STATUS FILTER
  ========================================================== */

  function handleStatusFilter(event) {
    statusFilter = event.target.value;

    renderWorkspace();
  }

  /* =========================================================
     OPEN REPORT
  ========================================================== */

  function openReport(reportId) {
    const report = REPORTS[reportId];

    if (!report) {
      showToast("Report tidak ditemukan.", "error");

      return;
    }

    activeReportId = reportId;

    localStorage.setItem(LAST_REPORT_KEY, reportId);

    /* Reset filters */

    searchTerm = "";

    locationFilter = "all";

    statusFilter = "all";

    if (elements.searchInput) {
      elements.searchInput.value = "";
    }

    if (elements.locationFilter) {
      elements.locationFilter.value = "all";
    }

    if (elements.statusFilter) {
      elements.statusFilter.value = "all";
    }

    /* Update workspace header */

    if (elements.workspaceEyebrow) {
      elements.workspaceEyebrow.textContent = `${report.category} REPORT`;
    }

    if (elements.workspaceTitle) {
      elements.workspaceTitle.textContent = report.title;
    }

    if (elements.workspaceDescription) {
      elements.workspaceDescription.textContent = report.description;
    }

    /* Show workspace */

    if (elements.workspace) {
      elements.workspace.hidden = false;

      elements.workspace.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    renderWorkspace();
  }

  /* =========================================================
     CLOSE WORKSPACE
  ========================================================== */

  function closeWorkspace() {
    activeReportId = null;

    if (elements.workspace) {
      elements.workspace.hidden = true;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================================
     RESTORE LAST REPORT
  ========================================================== */

  function restoreLastReport() {
    const lastReport = localStorage.getItem(LAST_REPORT_KEY);

    if (!lastReport) {
      return;
    }

    if (!REPORTS[lastReport]) {
      return;
    }

    /*
      We intentionally do not automatically open the report.

      The catalog remains the default landing state.
      The saved report is only used for continuity.
    */
  }

  /* =========================================================
     RENDER OVERVIEW
  ========================================================== */

  function renderOverview() {
    const totalAssets = reportData.filter(
      (item) => item.category === "asset",
    ).length;

    const networkResources = reportData.filter((item) =>
      ["ip", "vlan", "asn"].includes(item.category),
    ).length;

    const locations = reportData.filter(
      (item) => item.category === "location",
    ).length;

    const virtualResources = reportData.filter((item) =>
      ["virtual", "certificate", "license"].includes(item.category),
    ).length;

    if (elements.totalAssets) {
      elements.totalAssets.textContent = totalAssets;
    }

    if (elements.networkResources) {
      elements.networkResources.textContent = networkResources;
    }

    if (elements.locations) {
      elements.locations.textContent = locations;
    }

    if (elements.virtualResources) {
      elements.virtualResources.textContent = virtualResources;
    }
  }

  /* =========================================================
     REPORT CATALOG COUNT
  ========================================================== */

  function renderCatalogCount() {
    const count = Object.keys(REPORTS).length;

    if (elements.catalogCount) {
      elements.catalogCount.textContent = `${count} reports`;
    }
  }

  /* =========================================================
     GET DATA FOR REPORT
  ========================================================== */

  function getReportData(reportId) {
    switch (reportId) {
      case "asset-inventory":
        return reportData.filter((item) => item.category === "asset");

      case "asset-lifecycle":
        return reportData.filter((item) => item.category === "asset");

      case "assets-by-location":
        return reportData.filter((item) => item.category === "asset");

      case "ip-utilization":
        return reportData.filter((item) => item.category === "ip");

      case "vlan-inventory":
        return reportData.filter((item) => item.category === "vlan");

      case "asn-inventory":
        return reportData.filter((item) => item.category === "asn");

      case "location-inventory":
        return reportData.filter((item) => item.category === "location");

      case "location-asset-summary":
        return reportData.filter((item) => item.category === "asset");

      case "virtual-resource-inventory":
        return reportData.filter((item) =>
          ["virtual", "certificate", "license"].includes(item.category),
        );

      case "expiration-monitoring":
        return reportData.filter((item) =>
          ["certificate", "license"].includes(item.category),
        );

      case "provider-resource-summary":
        return reportData.filter((item) => item.category === "provider");

      case "customer-resource-summary":
        return reportData.filter((item) => item.category === "customer");

      case "asset-assignment":
        return reportData.filter((item) => item.category === "assignment");

      case "network-topology-summary":
        return reportData.filter((item) => item.category === "topology");

      default:
        return [];
    }
  }

  /* =========================================================
     FILTER DATA
  ========================================================== */

  function getFilteredReportData() {
    if (!activeReportId) {
      return [];
    }

    let data = getReportData(activeReportId);

    /* Search */

    if (searchTerm) {
      data = data.filter((item) => {
        const searchable = [
          item.resource,
          item.code,
          item.type,
          item.location,
          item.status,
          item.provider,
          item.customer,
          item.assignedTo,
          item.ip,
          item.pool,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(searchTerm);
      });
    }

    /* Location */

    if (locationFilter !== "all") {
      data = data.filter((item) => item.location === locationFilter);
    }

    /* Status */

    if (statusFilter !== "all") {
      data = data.filter((item) => item.status === statusFilter);
    }

    return data;
  }

  /* =========================================================
     RENDER WORKSPACE
  ========================================================== */

  function renderWorkspace() {
    if (!activeReportId) {
      return;
    }

    filteredData = getFilteredReportData();

    renderWorkspaceStats(filteredData);

    renderTable(filteredData);

    renderResultCount(filteredData);
  }

  /* =========================================================
     WORKSPACE STATISTICS
  ========================================================== */

  function renderWorkspaceStats(data) {
    const total = data.length;

    const active = data.filter((item) => item.status === "Active").length;

    const available = data.filter((item) => item.status === "Available").length;

    const latest = getLatestUpdatedDate(data);

    if (elements.workspaceTotal) {
      elements.workspaceTotal.textContent = total;
    }

    if (elements.workspaceActive) {
      elements.workspaceActive.textContent = active;
    }

    if (elements.workspaceAvailable) {
      elements.workspaceAvailable.textContent = available;
    }

    if (elements.workspaceUpdated) {
      elements.workspaceUpdated.textContent = latest || "—";
    }
  }

  /* =========================================================
     RESULT TABLE
  ========================================================== */

  function renderTable(data) {
    if (!elements.tableHead || !elements.tableBody) {
      return;
    }

    renderTableHeader();

    if (data.length === 0) {
      elements.tableBody.innerHTML = `

        <tr>

          <td colspan="5">

            <div class="report-empty-state">

              <div class="report-empty-icon">
                ◌
              </div>

              <h3>
                No results found
              </h3>

              <p>
                Tidak ada data yang sesuai dengan filter saat ini.
              </p>

            </div>

          </td>

        </tr>

      `;

      return;
    }

    elements.tableBody.innerHTML = data
      .map((item) => createTableRow(item))
      .join("");
  }

  /* =========================================================
     TABLE HEADER
  ========================================================== */

  function renderTableHeader() {
    elements.tableHead.innerHTML = `

      <tr>

        <th>
          Resource
        </th>

        <th>
          Type
        </th>

        <th>
          Location
        </th>

        <th>
          Status
        </th>

        <th>
          Updated
        </th>

      </tr>

    `;
  }

  /* =========================================================
     TABLE ROW
  ========================================================== */

  function createTableRow(item) {
    const resource = escapeHtml(item.resource);

    const code = escapeHtml(item.code);

    const type = escapeHtml(item.type);

    const location = escapeHtml(item.location);

    const status = escapeHtml(item.status);

    const updated = escapeHtml(formatDate(item.updated));

    return `

      <tr>

        <td>

          <div class="report-resource-cell">

            <strong>
              ${resource}
            </strong>

            ${
              code
                ? `
                  <span
                    class="report-resource-code"
                    style="
                      display:block;
                      margin-top:3px;
                      color:#079f9d;
                      font-family:'IBM Plex Mono',monospace;
                      font-size:11px;
                    "
                  >
                    ${code}
                  </span>
                `
                : ""
            }

          </div>

        </td>


        <td>
          ${type}
        </td>


        <td>
          ${location}
        </td>


        <td>

          <span
            class="report-status-badge"
            style="${getStatusBadgeStyle(item.status)}"
          >
            ${status}
          </span>

        </td>


        <td
          style="
            font-family:'IBM Plex Mono',monospace;
            font-size:11px;
            color:#557492;
          "
        >
          ${updated}
        </td>

      </tr>

    `;
  }

  /* =========================================================
     STATUS BADGE STYLE
  ========================================================== */

  function getStatusBadgeStyle(status) {
    const base = `
      display:inline-flex;
      align-items:center;
      min-height:26px;
      padding:0 9px;
      border-radius:6px;
      font-family:'Inter',sans-serif;
      font-size:10px;
      font-weight:600;
      line-height:1;
      white-space:nowrap;
    `;

    switch (status) {
      case "Active":
        return `
          ${base}
          background:#e9f8f6;
          border:1px solid #bfe8e3;
          color:#087f79;
        `;

      case "Available":
        return `
          ${base}
          background:#eef7ff;
          border:1px solid #c8dff1;
          color:#35698e;
        `;

      case "Provisioned":
        return `
          ${base}
          background:#f2f0ff;
          border:1px solid #d9d2f5;
          color:#6556a3;
        `;

      case "Inactive":
        return `
          ${base}
          background:#f5f7f9;
          border:1px solid #d9e0e7;
          color:#687d92;
        `;

      case "Retired":
        return `
          ${base}
          background:#fff1f1;
          border:1px solid #f0cccc;
          color:#a84f4f;
        `;

      default:
        return `
          ${base}
          background:#f6f9fc;
          border:1px solid #d3e0ec;
          color:#52749a;
        `;
    }
  }

  /* =========================================================
     RESULT COUNT
  ========================================================== */

  function renderResultCount(data) {
    if (!elements.resultCount) {
      return;
    }

    const count = data.length;

    elements.resultCount.textContent = `${count} result${count === 1 ? "" : "s"}`;
  }

  /* =========================================================
     REFRESH
  ========================================================== */

  function handleRefresh() {
    if (elements.refreshButton) {
      elements.refreshButton.disabled = true;

      elements.refreshButton.style.transform = "rotate(360deg)";
    }

    /*
      In the current prototype there is no backend.

      Reloading from localStorage simulates
      refreshing the report source.
    */

    setTimeout(() => {
      loadData();

      renderOverview();

      renderCatalogCount();

      if (activeReportId) {
        renderWorkspace();
      }

      if (elements.refreshButton) {
        elements.refreshButton.disabled = false;

        elements.refreshButton.style.transform = "";
      }

      showToast("Reports refreshed.", "success");
    }, 250);
  }

  /* =========================================================
     EXPORT CSV
  ========================================================== */

  function exportCurrentReport() {
    if (!activeReportId) {
      showToast("Pilih report terlebih dahulu.", "error");

      return;
    }

    const report = REPORTS[activeReportId];

    const data = filteredData;

    if (!data.length) {
      showToast("Tidak ada data untuk diexport.", "error");

      return;
    }

    const headers = [
      "Resource",
      "Code",
      "Type",
      "Location",
      "Status",
      "Updated",
    ];

    const rows = data.map((item) => [
      item.resource,
      item.code,
      item.type,
      item.location,
      item.status,
      item.updated,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => csvEscape(value)).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const filename = `${slugify(report.title)}-${getCurrentDate()}.csv`;

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

    showToast("CSV report berhasil diexport.", "success");
  }

  /* =========================================================
     PRINT
  ========================================================== */

  function printCurrentReport() {
    if (!activeReportId) {
      showToast("Pilih report terlebih dahulu.", "error");

      return;
    }

    const report = REPORTS[activeReportId];

    const rows = filteredData
      .map(
        (item) => `

            <tr>

              <td>
                ${escapeHtml(item.resource)}
              </td>

              <td>
                ${escapeHtml(item.code)}
              </td>

              <td>
                ${escapeHtml(item.type)}
              </td>

              <td>
                ${escapeHtml(item.location)}
              </td>

              <td>
                ${escapeHtml(item.status)}
              </td>

              <td>
                ${escapeHtml(formatDate(item.updated))}
              </td>

            </tr>

          `,
      )
      .join("");

    const printWindow = window.open("", "_blank", "width=1200,height=800");

    if (!printWindow) {
      showToast("Popup diblokir browser.", "error");

      return;
    }

    printWindow.document.write(`

      <!doctype html>

      <html lang="en">

        <head>

          <meta charset="UTF-8">

          <title>
            ${escapeHtml(report.title)} · NETASSET
          </title>

          <style>

            * {
              box-sizing:border-box;
            }

            body {
              margin:0;
              padding:40px;

              color:#071b3a;

              font-family:
                Arial,
                sans-serif;

              background:#ffffff;
            }

            .header {
              margin-bottom:30px;

              border-bottom:
                2px solid #071b3a;

              padding-bottom:20px;
            }

            .brand {
              color:#079f9d;

              font-size:11px;
              font-weight:700;

              letter-spacing:1px;
            }

            h1 {
              margin:7px 0 5px;

              font-size:26px;
            }

            p {
              margin:0;

              color:#6682a4;

              font-size:12px;
            }

            table {
              width:100%;

              border-collapse:
                collapse;

              margin-top:20px;
            }

            th {
              padding:12px;

              text-align:left;

              background:#f4f7fa;

              border-bottom:
                1px solid #d5e0ed;

              color:#58769a;

              font-size:10px;

              text-transform:
                uppercase;
            }

            td {
              padding:12px;

              border-bottom:
                1px solid #dbe4ee;

              font-size:12px;
            }

            .footer {
              margin-top:25px;

              color:#718aa7;

              font-size:10px;
            }

            @media print {

              body {
                padding:20px;
              }

            }

          </style>

        </head>

        <body>

          <div class="header">

            <div class="brand">
              NETASSET · REPORT CENTER
            </div>

            <h1>
              ${escapeHtml(report.title)}
            </h1>

            <p>
              ${escapeHtml(report.description)}
            </p>

          </div>


          <table>

            <thead>

              <tr>

                <th>
                  Resource
                </th>

                <th>
                  Code
                </th>

                <th>
                  Type
                </th>

                <th>
                  Location
                </th>

                <th>
                  Status
                </th>

                <th>
                  Updated
                </th>

              </tr>

            </thead>

            <tbody>

              ${rows}

            </tbody>

          </table>


          <div class="footer">

            Generated by NETASSET
            ·
            ${getCurrentDate()}

          </div>

        </body>

      </html>

    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 300);
  }

  /* =========================================================
     KEYBOARD
  ========================================================== */

  function handleKeyboard(event) {
    if (event.key === "Escape" && activeReportId) {
      closeWorkspace();
    }
  }

  /* =========================================================
     TOAST
  ========================================================== */

  function showToast(message, type = "info") {
    let toast = document.getElementById("netassetReportToast");

    if (!toast) {
      toast = document.createElement("div");

      toast.id = "netassetReportToast";

      toast.style.position = "fixed";

      toast.style.right = "24px";

      toast.style.bottom = "24px";

      toast.style.zIndex = "10000";

      toast.style.minWidth = "260px";

      toast.style.maxWidth = "380px";

      toast.style.padding = "13px 16px";

      toast.style.borderRadius = "9px";

      toast.style.fontFamily = "Inter, sans-serif";

      toast.style.fontSize = "12px";

      toast.style.fontWeight = "500";

      toast.style.boxShadow = "0 12px 30px rgba(7,27,58,.16)";

      toast.style.transition = "opacity .18s ease, transform .18s ease";

      document.body.appendChild(toast);
    }

    if (type === "success") {
      toast.style.background = "#e9f8f6";

      toast.style.border = "1px solid #bfe8e3";

      toast.style.color = "#087f79";
    } else if (type === "error") {
      toast.style.background = "#fff1f1";

      toast.style.border = "1px solid #f0cccc";

      toast.style.color = "#a84f4f";
    } else {
      toast.style.background = "#ffffff";

      toast.style.border = "1px solid #d5e0ed";

      toast.style.color = "#426486";
    }

    toast.textContent = message;

    toast.style.opacity = "0";

    toast.style.transform = "translateY(8px)";

    requestAnimationFrame(() => {
      toast.style.opacity = "1";

      toast.style.transform = "translateY(0)";
    });

    clearTimeout(toast._timeout);

    toast._timeout = setTimeout(() => {
      toast.style.opacity = "0";

      toast.style.transform = "translateY(8px)";
    }, 2500);
  }

  /* =========================================================
     UTILITIES
  ========================================================== */

  function createId() {
    return (
      "report-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8)
    );
  }

  function getCurrentDate() {
    const date = new Date();

    return date.toISOString().slice(0, 10);
  }

  function getLatestUpdatedDate(data) {
    if (!data.length) {
      return "";
    }

    const dates = data
      .map((item) => item.updated)
      .filter(Boolean)
      .sort()
      .reverse();

    if (!dates.length) {
      return "";
    }

    return formatDate(dates[0]);
  }

  function formatDate(value) {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function csvEscape(value) {
    if (value === null || value === undefined) {
      return "";
    }

    const stringValue = String(value);

    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================================================
     DEBUG OBJECT
  ========================================================== */

  window.NETASSETReports = {
    getData() {
      return reportData;
    },

    getReports() {
      return REPORTS;
    },

    getActiveReport() {
      return activeReportId;
    },

    refresh() {
      handleRefresh();
    },

    openReport(reportId) {
      openReport(reportId);
    },

    closeReport() {
      closeWorkspace();
    },
  };

  /* =========================================================
     START
  ========================================================== */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
