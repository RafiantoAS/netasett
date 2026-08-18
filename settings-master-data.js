/* =========================================================
   NETASSET — SETTINGS / MASTER DATA
   settings-master-data.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
       STORAGE
    ====================================================== */

  const STORAGE_KEY = "netasset_settings_master_data";

  /* =====================================================
       DEFAULT MASTER DATA
    ====================================================== */

  const defaultMasterData = {
    "asset-types": [
      {
        id: 1,
        code: "ROUTER",
        name: "Router",
        category: "Physical",
        status: "Active",
      },
      {
        id: 2,
        code: "SWITCH",
        name: "Switch",
        category: "Physical",
        status: "Active",
      },
      {
        id: 3,
        code: "SERVER",
        name: "Server",
        category: "Physical",
        status: "Active",
      },
      {
        id: 4,
        code: "OLT",
        name: "OLT",
        category: "Physical",
        status: "Active",
      },
      {
        id: 5,
        code: "EQUIPMENT",
        name: "Equipment",
        category: "Physical",
        status: "Active",
      },
    ],

    "asset-type-fields": [
      {
        id: 1,
        assetType: "Router",
        field: "Vendor",
        type: "Text",
        required: true,
      },
      {
        id: 2,
        assetType: "Router",
        field: "Model",
        type: "Text",
        required: true,
      },
      {
        id: 3,
        assetType: "Router",
        field: "Firmware Version",
        type: "Text",
        required: false,
      },
      {
        id: 4,
        assetType: "Router",
        field: "Management IP",
        type: "IP Address",
        required: false,
      },
      {
        id: 5,
        assetType: "Switch",
        field: "Vendor",
        type: "Text",
        required: true,
      },
      {
        id: 6,
        assetType: "Switch",
        field: "Port Count",
        type: "Number",
        required: false,
      },
      {
        id: 7,
        assetType: "Switch",
        field: "Management IP",
        type: "IP Address",
        required: false,
      },
      {
        id: 8,
        assetType: "Server",
        field: "Vendor",
        type: "Text",
        required: true,
      },
      {
        id: 9,
        assetType: "Server",
        field: "CPU",
        type: "Text",
        required: false,
      },
      {
        id: 10,
        assetType: "Server",
        field: "RAM",
        type: "Number",
        required: false,
      },
      {
        id: 11,
        assetType: "OLT",
        field: "Vendor",
        type: "Text",
        required: true,
      },
      {
        id: 12,
        assetType: "OLT",
        field: "Model",
        type: "Text",
        required: true,
      },
      {
        id: 13,
        assetType: "OLT",
        field: "PON Port Count",
        type: "Number",
        required: false,
      },
      {
        id: 14,
        assetType: "Equipment",
        field: "Vendor",
        type: "Text",
        required: false,
      },
      {
        id: 15,
        assetType: "Equipment",
        field: "Model",
        type: "Text",
        required: false,
      },
    ],

    "asset-status": [
      {
        id: 1,
        code: "PLANNED",
        name: "Planned",
        description: "Asset is planned for deployment.",
        status: "Active",
      },
      {
        id: 2,
        code: "PROVISIONED",
        name: "Provisioned",
        description: "Asset has been provisioned.",
        status: "Active",
      },
      {
        id: 3,
        code: "ACTIVE",
        name: "Active",
        description: "Asset is currently active.",
        status: "Active",
      },
      {
        id: 4,
        code: "MAINTENANCE",
        name: "Maintenance",
        description: "Asset is currently under maintenance.",
        status: "Active",
      },
      {
        id: 5,
        code: "RETIRED",
        name: "Retired",
        description: "Asset is no longer operational.",
        status: "Active",
      },
    ],

    "operational-status": [
      {
        id: 1,
        code: "OPERATIONAL",
        name: "Operational",
        description: "Operating normally.",
        status: "Active",
      },
      {
        id: 2,
        code: "DEGRADED",
        name: "Degraded",
        description: "Operating with reduced performance.",
        status: "Active",
      },
      {
        id: 3,
        code: "DOWN",
        name: "Down",
        description: "Currently unavailable.",
        status: "Active",
      },
      {
        id: 4,
        code: "MAINTENANCE",
        name: "Maintenance",
        description: "Temporarily unavailable for maintenance.",
        status: "Active",
      },
      {
        id: 5,
        code: "UNKNOWN",
        name: "Unknown",
        description: "Operational state is unknown.",
        status: "Active",
      },
    ],

    "location-types": [
      {
        id: 1,
        code: "DC",
        name: "Data Center",
        description: "Primary or secondary data center.",
        status: "Active",
      },
      {
        id: 2,
        code: "POP",
        name: "POP",
        description: "Point of Presence.",
        status: "Active",
      },
      {
        id: 3,
        code: "BRANCH",
        name: "Branch",
        description: "Branch or regional office.",
        status: "Active",
      },
      {
        id: 4,
        code: "OFFICE",
        name: "Office",
        description: "Corporate or operational office.",
        status: "Active",
      },
      {
        id: 5,
        code: "WAREHOUSE",
        name: "Warehouse",
        description: "Equipment storage location.",
        status: "Active",
      },
      {
        id: 6,
        code: "CUSTOMER",
        name: "Customer Site",
        description: "Customer premises.",
        status: "Active",
      },
    ],

    "relationship-types": [
      {
        id: 1,
        code: "CONNECTED_TO",
        name: "Connected To",
        description: "Network connection between assets.",
        status: "Active",
      },
      {
        id: 2,
        code: "DEPENDS_ON",
        name: "Depends On",
        description: "Asset depends on another asset.",
        status: "Active",
      },
      {
        id: 3,
        code: "HOSTED_ON",
        name: "Hosted On",
        description: "Resource is hosted on another asset.",
        status: "Active",
      },
      {
        id: 4,
        code: "PARENT_OF",
        name: "Parent Of",
        description: "Parent-child asset relationship.",
        status: "Active",
      },
      {
        id: 5,
        code: "MEMBER_OF",
        name: "Member Of",
        description: "Asset belongs to a logical group.",
        status: "Active",
      },
    ],

    "ip-types": [
      {
        id: 1,
        code: "IPV4",
        name: "IPv4",
        description: "Internet Protocol version 4.",
        status: "Active",
      },
      {
        id: 2,
        code: "IPV6",
        name: "IPv6",
        description: "Internet Protocol version 6.",
        status: "Active",
      },
    ],

    "vlan-types": [
      {
        id: 1,
        code: "DATA",
        name: "Data",
        description: "Standard data VLAN.",
        status: "Active",
      },
      {
        id: 2,
        code: "VOICE",
        name: "Voice",
        description: "Voice or telephony VLAN.",
        status: "Active",
      },
      {
        id: 3,
        code: "MGMT",
        name: "Management",
        description: "Network management VLAN.",
        status: "Active",
      },
    ],

    "interface-types": [
      {
        id: 1,
        code: "ETHERNET",
        name: "Ethernet",
        description: "Standard Ethernet interface.",
        status: "Active",
      },
      {
        id: 2,
        code: "SFP",
        name: "SFP",
        description: "Small Form-factor Pluggable interface.",
        status: "Active",
      },
      {
        id: 3,
        code: "SFP_PLUS",
        name: "SFP+",
        description: "Enhanced SFP interface.",
        status: "Active",
      },
      {
        id: 4,
        code: "QSFP",
        name: "QSFP",
        description: "Quad Small Form-factor Pluggable interface.",
        status: "Active",
      },
      {
        id: 5,
        code: "MANAGEMENT",
        name: "Management",
        description: "Dedicated management interface.",
        status: "Active",
      },
      {
        id: 6,
        code: "LOOPBACK",
        name: "Loopback",
        description: "Logical loopback interface.",
        status: "Active",
      },
    ],
  };

  /* =====================================================
       SETTINGS DEFAULTS
    ====================================================== */

  const defaultSettings = {
    systemName: "NETASSET",

    organizationName: "ISP Network",

    systemDescription: "ISP Asset Management System",

    environment: "development",

    timezone: "Asia/Jakarta",

    dateFormat: "DD MMM YYYY",

    timeFormat: "24",

    firstDay: "monday",

    theme: "light",

    expandedSidebar: true,

    compactTables: false,

    certificateWarning: "30",

    licenseWarning: "30",

    vlanMinimum: 1,

    vlanMaximum: 4094,

    auditRetention: "365",
  };

  /* =====================================================
       APPLICATION STATE
    ====================================================== */

  let state = loadState();

  let activeSection = "general";

  let activeMasterData = null;

  let editingId = null;

  /* =====================================================
       DOM REFERENCES
    ====================================================== */

  const settingsNavItems = document.querySelectorAll("[data-settings-section]");

  const settingsPanels = document.querySelectorAll("[data-settings-panel]");

  const masterDataButtons = document.querySelectorAll("[data-master-data]");

  const settingsRefresh = document.getElementById("settingsRefresh");

  const settingsToast = document.getElementById("settingsToast");

  const masterDataDialog = document.getElementById("masterDataDialog");

  const masterDataDialogTitle = document.getElementById(
    "masterDataDialogTitle",
  );

  const masterDataDialogDescription = document.getElementById(
    "masterDataDialogDescription",
  );

  const masterDataDialogBody = document.getElementById("masterDataDialogBody");

  const closeMasterDataDialog = document.getElementById(
    "closeMasterDataDialog",
  );

  const cancelMasterDataDialog = document.getElementById(
    "cancelMasterDataDialog",
  );

  const saveMasterData = document.getElementById("saveMasterData");

  /* =====================================================
       LOAD STATE
    ====================================================== */

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        return {
          settings: clone(defaultSettings),
          masterData: clone(defaultMasterData),
        };
      }

      const parsed = JSON.parse(stored);

      return {
        settings: {
          ...clone(defaultSettings),
          ...(parsed.settings || {}),
        },

        masterData: {
          ...clone(defaultMasterData),
          ...(parsed.masterData || {}),
        },
      };
    } catch (error) {
      console.warn("NETASSET settings could not be loaded.", error);

      return {
        settings: clone(defaultSettings),
        masterData: clone(defaultMasterData),
      };
    }
  }

  /* =====================================================
       SAVE STATE
    ====================================================== */

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("NETASSET settings could not be saved.", error);
    }
  }

  /* =====================================================
       CLONE HELPER
    ====================================================== */

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  /* =====================================================
       SETTINGS NAVIGATION
    ====================================================== */

  settingsNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      const section = item.dataset.settingsSection;

      activateSection(section);
    });
  });

  function activateSection(section) {
    activeSection = section;

    settingsNavItems.forEach((item) => {
      const isActive = item.dataset.settingsSection === section;

      item.classList.toggle("active", isActive);
    });

    settingsPanels.forEach((panel) => {
      const isActive = panel.dataset.settingsPanel === section;

      panel.hidden = !isActive;

      panel.classList.toggle("active", isActive);
    });
  }

  /* =====================================================
       JUMP TO SETTINGS SECTION
    ====================================================== */

  document.querySelectorAll("[data-jump-settings]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const section = button.dataset.jumpSettings;

      activateSection(section);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  });

  /* =====================================================
       MASTER DATA CONFIGURATION
    ====================================================== */

  const masterDataConfig = {
    "asset-types": {
      title: "Asset Types",

      description: "Manage physical and logical asset classifications.",

      searchPlaceholder: "Search asset type...",

      columns: ["Code", "Name", "Category", "Status"],

      fields: [
        {
          name: "code",
          label: "Code",
          type: "text",
          required: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "category",
          label: "Category",
          type: "select",
          options: ["Physical", "Logical", "Virtual"],
          required: true,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Inactive"],
          required: true,
        },
      ],
    },

    "asset-type-fields": {
      title: "Asset Type Fields",

      description: "Configure dynamic fields associated with asset types.",

      searchPlaceholder: "Search field...",

      columns: ["Asset Type", "Field", "Type", "Required"],

      fields: [
        {
          name: "assetType",
          label: "Asset Type",
          type: "select",
          options: ["Router", "Switch", "Server", "OLT", "Equipment"],
          required: true,
        },
        {
          name: "field",
          label: "Field Name",
          type: "text",
          required: true,
        },
        {
          name: "type",
          label: "Field Type",
          type: "select",
          options: [
            "Text",
            "Number",
            "IP Address",
            "Date",
            "Boolean",
            "Select",
          ],
          required: true,
        },
        {
          name: "required",
          label: "Required",
          type: "checkbox",
          required: false,
        },
      ],
    },

    "asset-status": {
      title: "Asset Status",

      description: "Manage lifecycle values used by asset records.",

      searchPlaceholder: "Search status...",

      columns: ["Code", "Name", "Description", "Status"],

      fields: [
        {
          name: "code",
          label: "Code",
          type: "text",
          required: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          required: false,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Inactive"],
          required: true,
        },
      ],
    },

    "operational-status": {
      title: "Operational Status",

      description: "Manage operational condition values for assets.",

      searchPlaceholder: "Search operational status...",

      columns: ["Code", "Name", "Description", "Status"],

      fields: [
        {
          name: "code",
          label: "Code",
          type: "text",
          required: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          required: false,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Inactive"],
          required: true,
        },
      ],
    },

    "location-types": {
      title: "Location Types",

      description: "Manage classifications used by network locations.",

      searchPlaceholder: "Search location type...",

      columns: ["Code", "Name", "Description", "Status"],

      fields: [
        {
          name: "code",
          label: "Code",
          type: "text",
          required: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          required: false,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Inactive"],
          required: true,
        },
      ],
    },

    "relationship-types": {
      title: "Relationship Types",

      description: "Manage asset and topology relationship types.",

      searchPlaceholder: "Search relationship...",

      columns: ["Code", "Name", "Description", "Status"],

      fields: [
        {
          name: "code",
          label: "Code",
          type: "text",
          required: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          required: false,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Inactive"],
          required: true,
        },
      ],
    },

    "ip-types": {
      title: "IP Types",

      description: "Manage IP address classifications.",

      searchPlaceholder: "Search IP type...",

      columns: ["Code", "Name", "Description", "Status"],

      fields: [
        {
          name: "code",
          label: "Code",
          type: "text",
          required: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          required: false,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Inactive"],
          required: true,
        },
      ],
    },

    "vlan-types": {
      title: "VLAN Types",

      description: "Manage VLAN classification values.",

      searchPlaceholder: "Search VLAN type...",

      columns: ["Code", "Name", "Description", "Status"],

      fields: [
        {
          name: "code",
          label: "Code",
          type: "text",
          required: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          required: false,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Inactive"],
          required: true,
        },
      ],
    },

    "interface-types": {
      title: "Interface Types",

      description: "Manage network interface classifications.",

      searchPlaceholder: "Search interface type...",

      columns: ["Code", "Name", "Description", "Status"],

      fields: [
        {
          name: "code",
          label: "Code",
          type: "text",
          required: true,
        },
        {
          name: "name",
          label: "Name",
          type: "text",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "text",
          required: false,
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: ["Active", "Inactive"],
          required: true,
        },
      ],
    },
  };

  /* =====================================================
       MASTER DATA BUTTONS
    ====================================================== */

  masterDataButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.masterData;

      openMasterData(type);
    });
  });

  /* =====================================================
       OPEN MASTER DATA
    ====================================================== */

  function openMasterData(type) {
    const config = masterDataConfig[type];

    if (!config) {
      return;
    }

    activeMasterData = type;

    editingId = null;

    masterDataDialogTitle.textContent = config.title;

    masterDataDialogDescription.textContent = config.description;

    renderMasterDataWorkspace();

    if (typeof masterDataDialog.showModal === "function") {
      masterDataDialog.showModal();
    } else {
      masterDataDialog.setAttribute("open", "");
    }
  }

  /* =====================================================
       RENDER MASTER DATA WORKSPACE
    ====================================================== */

  function renderMasterDataWorkspace(searchTerm = "") {
    const config = masterDataConfig[activeMasterData];

    const records = state.masterData[activeMasterData] || [];

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredRecords = records.filter((record) => {
      return Object.values(record).some((value) =>
        String(value).toLowerCase().includes(normalizedSearch),
      );
    });

    masterDataDialogBody.innerHTML = `

            <div class="md-workspace">

                <div class="md-toolbar">

                    <div class="md-search">

                        <input
                            type="search"
                            id="masterDataSearch"
                            placeholder="${escapeHtml(
                              config.searchPlaceholder,
                            )}"
                            value="${escapeHtml(searchTerm)}"
                            autocomplete="off"
                        />

                    </div>


                    <button
                        type="button"
                        class="button button-primary"
                        id="addMasterData"
                    >
                        + Add
                    </button>

                </div>


                <div class="md-count">

                    <span>
                        ${filteredRecords.length}
                        record${filteredRecords.length === 1 ? "" : "s"}
                    </span>

                    <span>
                        ${records.length} total
                    </span>

                </div>


                <div class="md-table-wrap">

                    <table class="md-table">

                        <thead>

                            <tr>

                                ${config.columns
                                  .map(
                                    (column) => `
                                            <th>
                                                ${escapeHtml(column)}
                                            </th>
                                        `,
                                  )
                                  .join("")}

                                <th class="md-actions-heading">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${
                              filteredRecords.length
                                ? filteredRecords
                                    .map((record) =>
                                      renderMasterDataRow(record, config),
                                    )
                                    .join("")
                                : `
                                        <tr>

                                            <td
                                                colspan="${
                                                  config.columns.length + 1
                                                }"
                                                class="md-empty"
                                            >

                                                <div class="md-empty-title">
                                                    No records found
                                                </div>

                                                <div class="md-empty-text">
                                                    Try another search or add
                                                    a new configuration value.
                                                </div>

                                            </td>

                                        </tr>
                                    `
                            }

                        </tbody>

                    </table>

                </div>

            </div>
        `;

    const searchInput = document.getElementById("masterDataSearch");

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        renderMasterDataWorkspace(searchInput.value);

        const newSearch = document.getElementById("masterDataSearch");

        if (newSearch) {
          newSearch.focus();

          newSearch.setSelectionRange(
            newSearch.value.length,
            newSearch.value.length,
          );
        }
      });
    }

    const addButton = document.getElementById("addMasterData");

    if (addButton) {
      addButton.addEventListener("click", () => {
        openMasterDataForm();
      });
    }

    masterDataDialogBody
      .querySelectorAll("[data-edit-master-data]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const id = Number(button.dataset.editMasterData);

          openMasterDataForm(id);
        });
      });

    masterDataDialogBody
      .querySelectorAll("[data-delete-master-data]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const id = Number(button.dataset.deleteMasterData);

          deleteMasterDataRecord(id);
        });
      });
  }

  /* =====================================================
       RENDER MASTER DATA ROW
    ====================================================== */

  function renderMasterDataRow(record, config) {
    const cells = config.columns
      .map((column) => {
        const key = getRecordKey(record, column);

        const value = record[key];

        if (key === "status") {
          return `
                                <td>
                                    <span class="md-status ${
                                      String(value).toLowerCase() === "active"
                                        ? "is-active"
                                        : "is-inactive"
                                    }">
                                        ${escapeHtml(value)}
                                    </span>
                                </td>
                            `;
        }

        if (key === "required") {
          return `
                                <td>
                                    <span class="md-required ${
                                      value ? "is-required" : "is-optional"
                                    }">
                                        ${value ? "Required" : "Optional"}
                                    </span>
                                </td>
                            `;
        }

        return `
                            <td>
                                ${escapeHtml(value ?? "—")}
                            </td>
                        `;
      })
      .join("");

    return `
            <tr>

                ${cells}

                <td class="md-actions">

                    <button
                        type="button"
                        class="md-action-button"
                        data-edit-master-data="${record.id}"
                        title="Edit"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="md-action-button md-action-danger"
                        data-delete-master-data="${record.id}"
                        title="Delete"
                    >
                        Delete
                    </button>

                </td>

            </tr>
        `;
  }

  /* =====================================================
       GET RECORD KEY
    ====================================================== */

  function getRecordKey(record, column) {
    const mapping = {
      Code: "code",

      Name: "name",

      Category: "category",

      Status: "status",

      Description: "description",

      "Asset Type": "assetType",

      Field: "field",

      Type: "type",

      Required: "required",
    };

    if (mapping[column]) {
      return mapping[column];
    }

    const key = Object.keys(record).find(
      (item) => item.toLowerCase() === column.toLowerCase(),
    );

    return key || column;
  }

  /* =====================================================
       OPEN MASTER DATA FORM
    ====================================================== */

  function openMasterDataForm(id = null) {
    const config = masterDataConfig[activeMasterData];

    const records = state.masterData[activeMasterData] || [];

    const record =
      id !== null
        ? records.find((item) => Number(item.id) === Number(id))
        : null;

    editingId = id;

    masterDataDialogBody.innerHTML = `

            <div class="md-form-wrapper">

                <div class="md-form-header">

                    <div>

                        <span class="md-form-kicker">
                            ${record ? "EDIT RECORD" : "NEW RECORD"}
                        </span>

                        <h3>
                            ${
                              record
                                ? `Edit ${escapeHtml(config.title)}`
                                : `Add ${escapeHtml(config.title)}`
                            }
                        </h3>

                    </div>

                </div>


                <form
                    id="masterDataForm"
                    class="md-form"
                >

                    <div class="md-form-grid">

                        ${config.fields
                          .map((field) =>
                            renderFormField(
                              field,
                              record ? record[field.name] : undefined,
                            ),
                          )
                          .join("")}

                    </div>


                    <div class="md-form-actions">

                        <button
                            type="button"
                            class="button button-secondary"
                            id="cancelMasterDataForm"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="button button-primary"
                        >
                            ${record ? "Update Record" : "Create Record"}
                        </button>

                    </div>

                </form>

            </div>
        `;

    const form = document.getElementById("masterDataForm");

    if (form) {
      form.addEventListener("submit", handleMasterDataSubmit);
    }

    const cancelButton = document.getElementById("cancelMasterDataForm");

    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        renderMasterDataWorkspace();
      });
    }
  }

  /* =====================================================
       RENDER FORM FIELD
    ====================================================== */

  function renderFormField(field, value) {
    const id = `md-field-${field.name}`;

    if (field.type === "checkbox") {
      return `
                <label class="md-checkbox-field">

                    <input
                        type="checkbox"
                        id="${id}"
                        name="${escapeHtml(field.name)}"
                        ${value ? "checked" : ""}
                    />

                    <span>

                        <strong>
                            ${escapeHtml(field.label)}
                        </strong>

                        <small>
                            ${field.required ? "Required" : "Optional"}
                        </small>

                    </span>

                </label>
            `;
    }

    if (field.type === "select") {
      return `
                <div class="md-form-field">

                    <label for="${id}">
                        ${escapeHtml(field.label)}
                    </label>

                    <select
                        id="${id}"
                        name="${escapeHtml(field.name)}"
                        ${field.required ? "required" : ""}
                    >

                        <option value="">
                            Select...
                        </option>

                        ${field.options
                          .map(
                            (option) =>
                              `
                                    <option
                                        value="${escapeHtml(option)}"
                                        ${
                                          String(value ?? "") === String(option)
                                            ? "selected"
                                            : ""
                                        }
                                    >
                                        ${escapeHtml(option)}
                                    </option>
                                    `,
                          )
                          .join("")}

                    </select>

                </div>
            `;
    }

    return `
            <div class="md-form-field">

                <label for="${id}">
                    ${escapeHtml(field.label)}
                </label>

                <input
                    type="${escapeHtml(field.type)}"
                    id="${id}"
                    name="${escapeHtml(field.name)}"
                    value="${escapeHtml(value ?? "")}"
                    ${field.required ? "required" : ""}
                />

            </div>
        `;
  }

  /* =====================================================
       HANDLE MASTER DATA SUBMIT
    ====================================================== */

  function handleMasterDataSubmit(event) {
    event.preventDefault();

    const config = masterDataConfig[activeMasterData];

    const form = event.currentTarget;

    const formData = new FormData(form);

    const newRecord = {};

    config.fields.forEach((field) => {
      if (field.type === "checkbox") {
        const input = form.querySelector(`[name="${field.name}"]`);

        newRecord[field.name] = Boolean(input?.checked);

        return;
      }

      newRecord[field.name] = String(formData.get(field.name) || "").trim();
    });

    const requiredFields = config.fields.filter((field) => field.required);

    const invalidField = requiredFields.find((field) => !newRecord[field.name]);

    if (invalidField) {
      showToast(`${invalidField.label} is required.`, "error");

      const invalidInput = form.querySelector(`[name="${invalidField.name}"]`);

      invalidInput?.focus();

      return;
    }

    const records = state.masterData[activeMasterData];

    if (editingId !== null) {
      const index = records.findIndex(
        (record) => Number(record.id) === Number(editingId),
      );

      if (index !== -1) {
        records[index] = {
          ...records[index],
          ...newRecord,
        };

        showToast(`${config.title} updated successfully.`);
      }
    } else {
      const nextId = getNextId(records);

      records.push({
        id: nextId,
        ...newRecord,
      });

      showToast(`${config.title} created successfully.`);
    }

    saveState();

    editingId = null;

    renderMasterDataWorkspace();
  }

  /* =====================================================
       DELETE MASTER DATA
    ====================================================== */

  function deleteMasterDataRecord(id) {
    const config = masterDataConfig[activeMasterData];

    const records = state.masterData[activeMasterData];

    const record = records.find((item) => Number(item.id) === Number(id));

    if (!record) {
      return;
    }

    const recordName =
      record.name || record.field || record.code || "this record";

    const confirmed = window.confirm(
      `Delete "${recordName}" from ${config.title}?`,
    );

    if (!confirmed) {
      return;
    }

    state.masterData[activeMasterData] = records.filter(
      (item) => Number(item.id) !== Number(id),
    );

    saveState();

    showToast(`${config.title} record deleted.`);

    renderMasterDataWorkspace();
  }

  /* =====================================================
       NEXT ID
    ====================================================== */

  function getNextId(records) {
    if (!records.length) {
      return 1;
    }

    return Math.max(...records.map((record) => Number(record.id) || 0)) + 1;
  }

  /* =====================================================
       MASTER DATA DIALOG CLOSE
    ====================================================== */

  function closeDialog() {
    if (masterDataDialog.open) {
      masterDataDialog.close();
    }

    activeMasterData = null;

    editingId = null;
  }

  closeMasterDataDialog?.addEventListener("click", closeDialog);

  cancelMasterDataDialog?.addEventListener("click", closeDialog);

  masterDataDialog?.addEventListener("click", (event) => {
    if (event.target === masterDataDialog) {
      closeDialog();
    }
  });

  /* =====================================================
       MASTER DATA SAVE BUTTON
    ====================================================== */

  saveMasterData?.addEventListener("click", () => {
    if (!activeMasterData) {
      return;
    }

    showToast("Changes are saved automatically in this prototype.");
  });

  /* =====================================================
       SAVE SETTINGS
    ====================================================== */

  document
    .querySelectorAll('[data-settings-action="save"]')
    .forEach((button) => {
      button.addEventListener("click", () => {
        collectSettings();

        saveState();

        showToast("Settings saved successfully.");
      });
    });

  /* =====================================================
       COLLECT SETTINGS FROM FORM
    ====================================================== */

  function collectSettings() {
    const getValue = (id) => document.getElementById(id)?.value;

    const getChecked = (id) => Boolean(document.getElementById(id)?.checked);

    state.settings.systemName =
      getValue("systemName") ?? state.settings.systemName;

    state.settings.organizationName =
      getValue("organizationName") ?? state.settings.organizationName;

    state.settings.systemDescription =
      getValue("systemDescription") ?? state.settings.systemDescription;

    state.settings.environment =
      getValue("environment") ?? state.settings.environment;

    state.settings.timezone = getValue("timezone") ?? state.settings.timezone;

    state.settings.dateFormat =
      getValue("dateFormat") ?? state.settings.dateFormat;

    state.settings.timeFormat =
      getValue("timeFormat") ?? state.settings.timeFormat;

    state.settings.firstDay = getValue("firstDay") ?? state.settings.firstDay;

    state.settings.theme =
      document.querySelector('input[name="theme"]:checked')?.value ??
      state.settings.theme;

    state.settings.expandedSidebar = getChecked("expandedSidebar");

    state.settings.compactTables = getChecked("compactTables");

    state.settings.certificateWarning =
      getValue("certificateWarning") ?? state.settings.certificateWarning;

    state.settings.licenseWarning =
      getValue("licenseWarning") ?? state.settings.licenseWarning;

    state.settings.vlanMinimum =
      Number(getValue("vlanMinimum")) || state.settings.vlanMinimum;

    state.settings.vlanMaximum =
      Number(getValue("vlanMaximum")) || state.settings.vlanMaximum;

    state.settings.auditRetention =
      getValue("auditRetention") ?? state.settings.auditRetention;
  }

  /* =====================================================
       RESET CURRENT SETTINGS
    ====================================================== */

  document
    .querySelectorAll('[data-settings-action="reset"]')
    .forEach((button) => {
      button.addEventListener("click", () => {
        const confirmed = window.confirm(
          "Reset this settings section to its default values?",
        );

        if (!confirmed) {
          return;
        }

        state.settings = {
          ...state.settings,
          ...clone(defaultSettings),
        };

        saveState();

        applySettingsToForm();

        showToast("Settings restored to defaults.");
      });
    });

  /* =====================================================
       RESET ALL
    ====================================================== */

  document
    .querySelectorAll('[data-settings-action="reset-all"]')
    .forEach((button) => {
      button.addEventListener("click", () => {
        const confirmed = window.confirm(
          "Reset all NETASSET prototype settings and master data to their default values?",
        );

        if (!confirmed) {
          return;
        }

        state = {
          settings: clone(defaultSettings),

          masterData: clone(defaultMasterData),
        };

        saveState();

        applySettingsToForm();

        showToast("All prototype configuration has been reset.");
      });
    });

  /* =====================================================
       APPLY SETTINGS TO FORM
    ====================================================== */

  function applySettingsToForm() {
    const settings = state.settings;

    setValue("systemName", settings.systemName);

    setValue("organizationName", settings.organizationName);

    setValue("systemDescription", settings.systemDescription);

    setValue("environment", settings.environment);

    setValue("timezone", settings.timezone);

    setValue("dateFormat", settings.dateFormat);

    setValue("timeFormat", settings.timeFormat);

    setValue("firstDay", settings.firstDay);

    setValue("certificateWarning", settings.certificateWarning);

    setValue("licenseWarning", settings.licenseWarning);

    setValue("vlanMinimum", settings.vlanMinimum);

    setValue("vlanMaximum", settings.vlanMaximum);

    setValue("auditRetention", settings.auditRetention);

    setChecked("expandedSidebar", settings.expandedSidebar);

    setChecked("compactTables", settings.compactTables);

    const theme = document.querySelector(
      `input[name="theme"][value="${settings.theme}"]`,
    );

    if (theme) {
      theme.checked = true;
    }
  }

  /* =====================================================
       SET VALUE
    ====================================================== */

  function setValue(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.value = value ?? "";
    }
  }

  /* =====================================================
       SET CHECKED
    ====================================================== */

  function setChecked(id, value) {
    const element = document.getElementById(id);

    if (element) {
      element.checked = Boolean(value);
    }
  }

  /* =====================================================
       REFRESH
    ====================================================== */

  settingsRefresh?.addEventListener("click", () => {
    state = loadState();

    applySettingsToForm();

    if (activeMasterData) {
      renderMasterDataWorkspace();
    }

    showToast("Settings refreshed.");
  });

  /* =====================================================
       TOAST
    ====================================================== */

  let toastTimer = null;

  function showToast(message, type = "success") {
    if (!settingsToast) {
      return;
    }

    clearTimeout(toastTimer);

    settingsToast.textContent = message;

    settingsToast.hidden = false;

    settingsToast.dataset.type = type;

    toastTimer = setTimeout(() => {
      settingsToast.hidden = true;
    }, 2600);
  }

  /* =====================================================
       HTML ESCAPE
    ====================================================== */

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =====================================================
       INITIALIZE
    ====================================================== */

  applySettingsToForm();

  activateSection("general");

  /* =====================================================
       DEBUG ACCESS
       Useful during frontend prototype development.
    ====================================================== */

  window.NETASSETSettings = {
    getState() {
      return clone(state);
    },

    reset() {
      state = {
        settings: clone(defaultSettings),

        masterData: clone(defaultMasterData),
      };

      saveState();

      applySettingsToForm();
    },

    openMasterData(type) {
      openMasterData(type);
    },
  };
});
