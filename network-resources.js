/* ==========================================================================
   network-resources.js — NETASSET Network Resources Shared Controller
   ========================================================================== */

/*
  Scope
  -----
  Shared JavaScript controller for:

    5.1 IP Prefix / Pool
    5.2 IP Address
    5.3 VLAN
    5.4 ASN
    5.5 Interface

  Responsibilities:
    - Shared localStorage
    - Resource navigation
    - Query-string helpers
    - Generic CRUD helpers
    - Search / filtering
    - Status helpers
    - Network validation
    - Duplicate validation
    - Shared DOM helpers
    - Reset helpers

  This file is framework-free so the current static prototype
  can later be migrated to Laravel without changing the UI structure.
*/

(function () {
  "use strict";

  /* ==========================================================================
     STORAGE KEYS
     ========================================================================== */

  const STORAGE_KEYS = {
    prefixPools: "netasset_ip_prefix_pools_v1",
    ipAddresses: "netasset_ip_addresses_v1",
    vlans: "netasset_vlans_v1",
    asns: "netasset_asns_v1",
    interfaces: "netasset_interfaces_v1",
  };

  /* ==========================================================================
     PAGE MAP
     ========================================================================== */

  const PAGES = {
    prefixPools: "ip-prefix-pools.html",
    prefixPoolDetail: "ip-prefix-pool-detail.html",

    ipAddresses: "ip-address.html",
    ipAddressDetail: "ip-address-detail.html",

    vlans: "vlan.html",
    vlanDetail: "vlan-detail.html",

    asns: "asn.html",
    asnDetail: "asn-detail.html",

    interfaces: "interface.html",
    interfaceDetail: "interface-detail.html",
  };

  /* ==========================================================================
     NETWORK RESOURCES CONTROLLER
     ========================================================================== */

  const NetworkResources = {
    /* ----------------------------------------------------------------------
       Public configuration
       ---------------------------------------------------------------------- */

    storageKeys: STORAGE_KEYS,

    pages: PAGES,

    /* ----------------------------------------------------------------------
       STORAGE
       ---------------------------------------------------------------------- */

    get(key, fallback = []) {
      try {
        const raw = localStorage.getItem(key);

        if (raw === null) {
          return structuredCloneSafe(fallback);
        }

        const parsed = JSON.parse(raw);

        return parsed ?? structuredCloneSafe(fallback);
      } catch (error) {
        console.warn("[NETASSET] Failed to read localStorage:", key, error);

        return structuredCloneSafe(fallback);
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));

        return true;
      } catch (error) {
        console.error("[NETASSET] Failed to save localStorage:", key, error);

        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);

        return true;
      } catch (error) {
        console.error("[NETASSET] Failed to remove localStorage:", key, error);

        return false;
      }
    },

    reset(key, demoData = []) {
      this.set(key, structuredCloneSafe(demoData));

      return structuredCloneSafe(demoData);
    },

    /* ----------------------------------------------------------------------
       QUERY STRING
       ---------------------------------------------------------------------- */

    query(name, defaultValue = null) {
      const params = new URLSearchParams(window.location.search);

      return params.get(name) ?? defaultValue;
    },

    buildUrl(page, params = {}) {
      const search = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          search.set(key, value);
        }
      });

      const queryString = search.toString();

      return queryString ? `${page}?${queryString}` : page;
    },

    go(page, params = {}) {
      window.location.href = this.buildUrl(page, params);
    },

    /* ----------------------------------------------------------------------
       NAVIGATION
       ---------------------------------------------------------------------- */

    openPrefixPool(code) {
      this.go(this.pages.prefixPoolDetail, { code });
    },

    openIpAddress(code) {
      this.go(this.pages.ipAddressDetail, { code });
    },

    openVlan(code) {
      this.go(this.pages.vlanDetail, { code });
    },

    openAsn(code) {
      this.go(this.pages.asnDetail, { code });
    },

    openInterface(code) {
      this.go(this.pages.interfaceDetail, { code });
    },

    backTo(resource) {
      const page = this.pages[resource];

      if (page) {
        this.go(page);

        return;
      }

      window.history.back();
    },

    /* ----------------------------------------------------------------------
       RESOURCE COLLECTIONS
       ---------------------------------------------------------------------- */

    getPrefixPools() {
      return this.get(STORAGE_KEYS.prefixPools, []);
    },

    savePrefixPools(data) {
      return this.set(STORAGE_KEYS.prefixPools, data);
    },

    getIpAddresses() {
      return this.get(STORAGE_KEYS.ipAddresses, []);
    },

    saveIpAddresses(data) {
      return this.set(STORAGE_KEYS.ipAddresses, data);
    },

    getVlans() {
      return this.get(STORAGE_KEYS.vlans, []);
    },

    saveVlans(data) {
      return this.set(STORAGE_KEYS.vlans, data);
    },

    getAsns() {
      return this.get(STORAGE_KEYS.asns, []);
    },

    saveAsns(data) {
      return this.set(STORAGE_KEYS.asns, data);
    },

    getInterfaces() {
      return this.get(STORAGE_KEYS.interfaces, []);
    },

    saveInterfaces(data) {
      return this.set(STORAGE_KEYS.interfaces, data);
    },

    /* ----------------------------------------------------------------------
       GENERIC COLLECTION HELPERS
       ---------------------------------------------------------------------- */

    getCollection(resource) {
      const methodName = `get${capitalize(resource)}`;

      if (typeof this[methodName] !== "function") {
        return [];
      }

      return this[methodName]();
    },

    saveCollection(resource, data) {
      const methodName = `save${capitalize(resource)}`;

      if (typeof this[methodName] !== "function") {
        return false;
      }

      return this[methodName](data);
    },

    findByCode(items, code) {
      if (!Array.isArray(items)) {
        return null;
      }

      const normalizedCode = String(code ?? "")
        .trim()
        .toLowerCase();

      if (!normalizedCode) {
        return null;
      }

      return (
        items.find(
          (item) =>
            String(item?.code ?? item?.assetCode ?? "")
              .trim()
              .toLowerCase() === normalizedCode,
        ) || null
      );
    },

    /* ----------------------------------------------------------------------
       GENERIC SEARCH + FILTER
       ---------------------------------------------------------------------- */

    filter(items, { search = "", searchFields = [], filters = {} } = {}) {
      if (!Array.isArray(items)) {
        return [];
      }

      const normalizedSearch = String(search).trim().toLowerCase();

      return items.filter((item) => {
        /* SEARCH */

        if (normalizedSearch && searchFields.length) {
          const searchable = searchFields
            .map((field) => getNestedValue(item, field))
            .map((value) => String(value ?? ""))
            .join(" ")
            .toLowerCase();

          if (!searchable.includes(normalizedSearch)) {
            return false;
          }
        }

        /* FILTERS */

        return Object.entries(filters).every(([field, expected]) => {
          if (
            expected === undefined ||
            expected === null ||
            expected === "" ||
            expected === "all"
          ) {
            return true;
          }

          const actual = getNestedValue(item, field);

          return (
            String(actual ?? "")
              .trim()
              .toLowerCase() === String(expected).trim().toLowerCase()
          );
        });
      });
    },

    /* ----------------------------------------------------------------------
       SORT
       ---------------------------------------------------------------------- */

    sort(items, field, direction = "asc") {
      if (!Array.isArray(items)) {
        return [];
      }

      const multiplier = direction === "desc" ? -1 : 1;

      return [...items].sort((a, b) => {
        const valueA = String(getNestedValue(a, field) ?? "").toLowerCase();

        const valueB = String(getNestedValue(b, field) ?? "").toLowerCase();

        return (
          valueA.localeCompare(valueB, undefined, {
            numeric: true,
            sensitivity: "base",
          }) * multiplier
        );
      });
    },

    /* ----------------------------------------------------------------------
       STATUS HELPERS
       ---------------------------------------------------------------------- */

    statusLabel(status) {
      const labels = {
        active: "Active",

        reserved: "Reserved",

        deprecated: "Deprecated",

        available: "Available",

        assigned: "Assigned",

        used: "Used",

        up: "UP",

        down: "DOWN",

        disabled: "Disabled",

        maintenance: "Maintenance",
      };

      const normalized = String(status ?? "")
        .trim()
        .toLowerCase();

      return labels[normalized] || titleCase(status);
    },

    statusClass(status) {
      const value = String(status ?? "")
        .trim()
        .toLowerCase();

      const classes = {
        active: "status-active",

        reserved: "status-reserved",

        deprecated: "status-deprecated",

        available: "status-available",

        assigned: "status-assigned",

        used: "status-used",

        up: "status-up",

        down: "status-down",

        disabled: "status-disabled",

        maintenance: "status-maintenance",
      };

      return classes[value] || "";
    },

    /* ----------------------------------------------------------------------
       REQUIRED FIELD VALIDATION
       ---------------------------------------------------------------------- */

    validateRequired(data, fields) {
      const errors = {};

      fields.forEach((field) => {
        const value = getNestedValue(data, field);

        if (
          value === undefined ||
          value === null ||
          String(value).trim() === ""
        ) {
          errors[field] = `${titleCase(field)} is required.`;
        }
      });

      return {
        valid: Object.keys(errors).length === 0,

        errors,
      };
    },

    /* ----------------------------------------------------------------------
       DUPLICATE VALIDATION
       ---------------------------------------------------------------------- */

    isDuplicate(items, field, value, editingCode = "") {
      if (!Array.isArray(items)) {
        return false;
      }

      const normalizedValue = String(value ?? "")
        .trim()
        .toLowerCase();

      if (!normalizedValue) {
        return false;
      }

      return items.some((item) => {
        const itemCode = String(item?.code ?? item?.assetCode ?? "")
          .trim()
          .toLowerCase();

        const currentValue = String(getNestedValue(item, field) ?? "")
          .trim()
          .toLowerCase();

        if (
          editingCode &&
          itemCode === String(editingCode).trim().toLowerCase()
        ) {
          return false;
        }

        return currentValue === normalizedValue;
      });
    },

    /* ----------------------------------------------------------------------
       NETWORK VALIDATION
       ---------------------------------------------------------------------- */

    isValidIPv4(value) {
      const input = String(value ?? "").trim();

      const parts = input.split(".");

      if (parts.length !== 4) {
        return false;
      }

      return parts.every((part) => {
        if (!/^\d+$/.test(part)) {
          return false;
        }

        if (part.length > 1 && part.startsWith("0")) {
          return false;
        }

        const number = Number(part);

        return number >= 0 && number <= 255;
      });
    },

    isValidCIDR(value) {
      const input = String(value ?? "").trim();

      const parts = input.split("/");

      if (parts.length !== 2) {
        return false;
      }

      const ip = parts[0];

      const prefix = parts[1];

      if (!this.isValidIPv4(ip)) {
        return false;
      }

      if (!/^\d+$/.test(prefix)) {
        return false;
      }

      const prefixNumber = Number(prefix);

      return prefixNumber >= 0 && prefixNumber <= 32;
    },

    getCIDRPrefix(value) {
      const parts = String(value ?? "")
        .trim()
        .split("/");

      if (parts.length !== 2) {
        return null;
      }

      const prefix = Number(parts[1]);

      return Number.isInteger(prefix) ? prefix : null;
    },

    getCIDRAddress(value) {
      const parts = String(value ?? "")
        .trim()
        .split("/");

      if (parts.length !== 2) {
        return "";
      }

      return parts[0];
    },

    isValidVlanId(value) {
      const number = Number(value);

      return Number.isInteger(number) && number >= 1 && number <= 4094;
    },

    isValidAsn(value) {
      const normalized = String(value ?? "")
        .trim()
        .toUpperCase()
        .replace(/^AS/, "");

      if (!/^\d+$/.test(normalized)) {
        return false;
      }

      const number = Number(normalized);

      return number >= 1 && number <= 4294967295;
    },

    normalizeAsn(value) {
      const normalized = String(value ?? "")
        .trim()
        .toUpperCase()
        .replace(/^AS/, "");

      if (!/^\d+$/.test(normalized)) {
        return "";
      }

      return `AS${normalized}`;
    },

    /* ----------------------------------------------------------------------
       PREFIX / POOL HELPERS
       ---------------------------------------------------------------------- */

    findPrefixPoolByCode(code) {
      return this.findByCode(this.getPrefixPools(), code);
    },

    prefixContainsIp(prefix, ip) {
      if (!this.isValidCIDR(prefix) || !this.isValidIPv4(ip)) {
        return false;
      }

      const [networkIp, prefixLength] = prefix.split("/");

      const network = ipv4ToNumber(networkIp);

      const address = ipv4ToNumber(ip);

      const mask =
        prefixLength === "0"
          ? 0
          : (0xffffffff << (32 - Number(prefixLength))) >>> 0;

      return (network & mask) === (address & mask);
    },

    isIpInsidePool(ip, pool) {
      return this.prefixContainsIp(pool, ip);
    },

    /* ----------------------------------------------------------------------
       IP ADDRESS HELPERS
       ---------------------------------------------------------------------- */

    findIpAddress(code) {
      return this.findByCode(this.getIpAddresses(), code);
    },

    isIpAddressAvailable(ipOrCode) {
      const items = this.getIpAddresses();

      const item = items.find(
        (entry) =>
          String(entry?.code ?? "").toLowerCase() ===
            String(ipOrCode ?? "").toLowerCase() ||
          String(entry?.address ?? "").toLowerCase() ===
            String(ipOrCode ?? "").toLowerCase(),
      );

      if (!item) {
        return false;
      }

      return String(item.status ?? "").toLowerCase() === "available";
    },

    /* ----------------------------------------------------------------------
       VLAN HELPERS
       ---------------------------------------------------------------------- */

    findVlan(code) {
      return this.findByCode(this.getVlans(), code);
    },

    /* ----------------------------------------------------------------------
       ASN HELPERS
       ---------------------------------------------------------------------- */

    findAsn(code) {
      return this.findByCode(this.getAsns(), code);
    },

    /* ----------------------------------------------------------------------
       INTERFACE HELPERS
       ---------------------------------------------------------------------- */

    findInterface(code) {
      return this.findByCode(this.getInterfaces(), code);
    },

    /* ----------------------------------------------------------------------
       SHARED DOM HELPERS
       ---------------------------------------------------------------------- */

    text(selector, value) {
      const element = document.querySelector(selector);

      if (element) {
        element.textContent = value ?? "";
      }

      return element;
    },

    value(selector, value) {
      const element = document.querySelector(selector);

      if (element && value !== undefined) {
        element.value = value ?? "";
      }

      return element ? element.value : undefined;
    },

    show(selector) {
      const element = document.querySelector(selector);

      if (element) {
        element.hidden = false;
      }
    },

    hide(selector) {
      const element = document.querySelector(selector);

      if (element) {
        element.hidden = true;
      }
    },

    /* ----------------------------------------------------------------------
       TOAST
       ---------------------------------------------------------------------- */

    toast(message = "Saved") {
      const toast = document.querySelector("#toast");

      if (!toast) {
        console.info(`[NETASSET] ${message}`);

        return;
      }

      const text = toast.querySelector(".toast-text");

      if (text) {
        text.textContent = message;
      }

      toast.classList.add("show");

      window.clearTimeout(this._toastTimer);

      this._toastTimer = window.setTimeout(() => {
        toast.classList.remove("show");
      }, 2400);
    },

    /* ----------------------------------------------------------------------
       TABLE HELPERS
       ---------------------------------------------------------------------- */

    emptyRow(colspan, message = "No data found.") {
      return `
        <tr>
          <td colspan="${Number(colspan) || 1}">
            <div class="empty-state">
              ${escapeHtml(message)}
            </div>
          </td>
        </tr>
      `;
    },

    /* ----------------------------------------------------------------------
       RESOURCE COUNTERS
       ---------------------------------------------------------------------- */

    countByStatus(items, status) {
      if (!Array.isArray(items)) {
        return 0;
      }

      return items.filter(
        (item) =>
          String(item?.status ?? "")
            .trim()
            .toLowerCase() ===
          String(status ?? "")
            .trim()
            .toLowerCase(),
      ).length;
    },

    /* ----------------------------------------------------------------------
       RESET INDIVIDUAL RESOURCES
       ---------------------------------------------------------------------- */

    resetPrefixPools(demoData = []) {
      return this.reset(STORAGE_KEYS.prefixPools, demoData);
    },

    resetIpAddresses(demoData = []) {
      return this.reset(STORAGE_KEYS.ipAddresses, demoData);
    },

    resetVlans(demoData = []) {
      return this.reset(STORAGE_KEYS.vlans, demoData);
    },

    resetAsns(demoData = []) {
      return this.reset(STORAGE_KEYS.asns, demoData);
    },

    resetInterfaces(demoData = []) {
      return this.reset(STORAGE_KEYS.interfaces, demoData);
    },

    /* ----------------------------------------------------------------------
       RESET EVERYTHING
       ---------------------------------------------------------------------- */

    resetAllNetworkResources() {
      Object.values(STORAGE_KEYS).forEach((key) => {
        this.remove(key);
      });

      window.location.reload();
    },
  };

  /* ==========================================================================
     PRIVATE UTILITIES
     ========================================================================== */

  function getNestedValue(object, path) {
    if (object === undefined || object === null) {
      return undefined;
    }

    return String(path)
      .split(".")
      .reduce((value, key) => {
        if (value === undefined || value === null) {
          return undefined;
        }

        return value[key];
      }, object);
  }

  function capitalize(value) {
    return (
      String(value ?? "")
        .charAt(0)
        .toUpperCase() + String(value ?? "").slice(1)
    );
  }

  function titleCase(value) {
    if (value === undefined || value === null || value === "") {
      return "";
    }

    return String(value)
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  function structuredCloneSafe(value) {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function ipv4ToNumber(ip) {
    return String(ip)
      .split(".")
      .reduce((result, octet) => (result * 256 + Number(octet)) >>> 0, 0);
  }

  /* ==========================================================================
     GLOBAL EXPORT
     ========================================================================== */

  window.NETASSET = window.NETASSET || {};

  window.NETASSET.NetworkResources = NetworkResources;

  /*
    Backward-compatible global alias.

    Both are valid:

      NETASSET.NetworkResources.getIpAddresses()

    or:

      NetworkResources.getIpAddresses()
  */

  window.NetworkResources = NetworkResources;
})();
