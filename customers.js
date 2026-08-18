/* =========================================================
   NETASSET — Customers Page
   customers.js
========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CONFIGURATION
  ========================================================= */

  const STORAGE_KEY = "netasset_customers";
  const PAGE_SIZE = 5;

  /* =========================================================
     CUSTOMER DATA
  ========================================================= */

  const seedCustomers = [
    {
      customer_id: "CUST-0001",
      customer_name: "PT Maju Jaya Telekomunikasi",
      customer_type: "corporate",
      contact: "Budi Santoso",
      email: "budi@majujaya.co.id",
      phone: "0812-3456-7890",
      address: "Jl. Gatot Subroto, Jakarta Selatan",
      status: "active",
      updated_at: "2026-08-13",
    },

    {
      customer_id: "CUST-0002",
      customer_name: "Warnet Merdeka Net",
      customer_type: "retail",
      contact: "Sri Wulandari",
      email: "sri@warnetmerdeka.id",
      phone: "0821-1122-3344",
      address: "Jl. Merdeka Raya, Jakarta Barat",
      status: "active",
      updated_at: "2026-08-13",
    },

    {
      customer_id: "CUST-0003",
      customer_name: "Hotel Grand Cempaka",
      customer_type: "corporate",
      contact: "Andi Prasetyo",
      email: "andi@grandcempaka.com",
      phone: "0813-9988-7766",
      address: "Jl. Cempaka Raya, Jakarta Pusat",
      status: "active",
      updated_at: "2026-08-13",
    },

    {
      customer_id: "CUST-0004",
      customer_name: "CV Nusantara Digital",
      customer_type: "sme",
      contact: "Dewi Kusuma",
      email: "dewi@nusantaradigital.id",
      phone: "0856-2233-4455",
      address: "Jl. Asia Afrika, Bandung",
      status: "inactive",
      updated_at: "2026-08-13",
    },

    {
      customer_id: "CUST-0005",
      customer_name: "Apartemen Kalibata Residence",
      customer_type: "corporate",
      contact: "Rudi Hartono",
      email: "rudi@kalibataresidence.id",
      phone: "0878-6655-4433",
      address: "Jl. Raya Kalibata, Jakarta Selatan",
      status: "active",
      updated_at: "2026-08-13",
    },

    {
      customer_id: "CUST-0006",
      customer_name: "PT Sinar Data Indonesia",
      customer_type: "corporate",
      contact: "Fajar Nugroho",
      email: "fajar@sinardata.id",
      phone: "0811-2211-3344",
      address: "Jl. TB Simatupang, Jakarta Selatan",
      status: "active",
      updated_at: "2026-08-12",
    },

    {
      customer_id: "CUST-0007",
      customer_name: "Kopi Sudirman",
      customer_type: "retail",
      contact: "Maya Lestari",
      email: "maya@kopisudirman.id",
      phone: "0895-3344-5566",
      address: "Jl. Jend. Sudirman, Jakarta Pusat",
      status: "active",
      updated_at: "2026-08-12",
    },

    {
      customer_id: "CUST-0008",
      customer_name: "PT Arunika Infrastruktur",
      customer_type: "corporate",
      contact: "Dimas Wijaya",
      email: "dimas@arunika.id",
      phone: "0812-7788-9900",
      address: "Jl. Rasuna Said, Jakarta Selatan",
      status: "active",
      updated_at: "2026-08-11",
    },

    {
      customer_id: "CUST-0009",
      customer_name: "Klinik Sehat Bersama",
      customer_type: "sme",
      contact: "Nina Amelia",
      email: "nina@sehatbersama.id",
      phone: "0822-5566-7788",
      address: "Jl. Kebon Jeruk, Jakarta Barat",
      status: "active",
      updated_at: "2026-08-11",
    },

    {
      customer_id: "CUST-0010",
      customer_name: "Pemerintah Kota Nusantara",
      customer_type: "government",
      contact: "Agus Setiawan",
      email: "agus@pemkot.go.id",
      phone: "021-44556677",
      address: "Kompleks Pemerintahan, Jakarta",
      status: "active",
      updated_at: "2026-08-10",
    },

    {
      customer_id: "CUST-0011",
      customer_name: "PT Digital Koneksi Utama",
      customer_type: "corporate",
      contact: "Rizky Maulana",
      email: "rizky@dku.id",
      phone: "0817-7788-1122",
      address: "Jl. Gatot Subroto, Jakarta",
      status: "active",
      updated_at: "2026-08-10",
    },

    {
      customer_id: "CUST-0012",
      customer_name: "Toko Elektronik Sentosa",
      customer_type: "retail",
      contact: "Sari Handayani",
      email: "sari@sentosa.id",
      phone: "0838-9911-2233",
      address: "Jl. Mangga Dua Raya, Jakarta",
      status: "active",
      updated_at: "2026-08-09",
    },

    {
      customer_id: "CUST-0013",
      customer_name: "CV Bintang Teknologi",
      customer_type: "sme",
      contact: "Hendra Gunawan",
      email: "hendra@bintangtek.id",
      phone: "0857-1122-3344",
      address: "Jl. Pajajaran, Bogor",
      status: "inactive",
      updated_at: "2026-08-09",
    },

    {
      customer_id: "CUST-0014",
      customer_name: "Universitas Cakrawala",
      customer_type: "government",
      contact: "Lina Kartika",
      email: "lina@cakrawala.ac.id",
      phone: "021-77889900",
      address: "Jl. Pendidikan Raya, Depok",
      status: "active",
      updated_at: "2026-08-08",
    },

    {
      customer_id: "CUST-0015",
      customer_name: "PT Metro Fiber Network",
      customer_type: "corporate",
      contact: "Yusuf Ramadhan",
      email: "yusuf@metrofiber.id",
      phone: "0819-4455-6677",
      address: "Jl. Panjang, Jakarta Barat",
      status: "active",
      updated_at: "2026-08-08",
    },

    {
      customer_id: "CUST-0016",
      customer_name: "Bengkel Auto Prima",
      customer_type: "sme",
      contact: "Bayu Pranata",
      email: "bayu@autoprima.id",
      phone: "0881-2233-4455",
      address: "Jl. Raya Bekasi, Jakarta Timur",
      status: "active",
      updated_at: "2026-08-07",
    },

    {
      customer_id: "CUST-0017",
      customer_name: "Koperasi Sejahtera",
      customer_type: "government",
      contact: "Wahyu Hidayat",
      email: "wahyu@koperasi.id",
      phone: "0812-3344-5566",
      address: "Jl. Pemuda, Jakarta Timur",
      status: "active",
      updated_at: "2026-08-07",
    },

    {
      customer_id: "CUST-0018",
      customer_name: "PT Garuda Cloud Services",
      customer_type: "corporate",
      contact: "Kevin Hartono",
      email: "kevin@garudacloud.id",
      phone: "0813-5566-7788",
      address: "Jl. Kuningan Mulia, Jakarta Selatan",
      status: "active",
      updated_at: "2026-08-06",
    },
  ];

  /* =========================================================
     PAGE STATE
  ========================================================= */

  const state = {
    customers: [],
    search: "",
    status: "all",
    type: "all",
    page: 1,
    editingId: null,
    detailsId: null,
  };

  /* =========================================================
     DOM HELPER
  ========================================================= */

  const $ = (selector) => document.querySelector(selector);

  const els = {
    /* List */
    search: $("#customerSearch"),
    statusFilter: $("#customerStatusFilter"),
    tableBody: $("#customerTableBody"),
    empty: $("#customerEmptyState"),
    resultSummary: $("#customerResultSummary"),
    paginationPages: $("#paginationPages"),
    previous: $("#previousPageButton"),
    next: $("#nextPageButton"),

    /* Summary */
    total: $("#totalCustomerCount"),
    corporate: $("#corporateCount"),
    sme: $("#smeCount"),
    retail: $("#retailCount"),
    government: $("#governmentCount"),
    summary: $("#customerSummary"),

    /* Page actions */
    addButton: $("#addCustomerButton"),
    menuButton: $("#customerMenuButton"),

    /* Add/Edit modal */
    modal: $("#customerModal"),
    modalTitle: $("#customerModalTitle"),
    modalDescription: $("#customerModalDescription"),
    closeModal: $("#closeCustomerModal"),
    cancelForm: $("#cancelCustomerForm"),
    form: $("#customerForm"),
    formMode: $("#customerFormMode"),
    editingId: $("#editingCustomerId"),
    saveButton: $("#saveCustomerButton"),

    /* Form fields */
    id: $("#customerId"),
    name: $("#customerName"),
    type: $("#customerType"),
    contact: $("#customerContact"),
    email: $("#customerEmail"),
    phone: $("#customerPhone"),
    address: $("#customerAddress"),
    customerStatus: $("#customerStatus"),

    /* Details modal */
    detailsModal: $("#customerDetailsModal"),
    closeDetails: $("#closeCustomerDetails"),
    closeDetailsButton: $("#closeCustomerDetailsButton"),
    editFromDetails: $("#editCustomerFromDetails"),

    detailsCustomerId: $("#detailsCustomerId"),
    detailsCustomerName: $("#detailsCustomerName"),
    detailsCustomerType: $("#detailsCustomerType"),
    detailsContact: $("#detailsContact"),
    detailsEmail: $("#detailsEmail"),
    detailsPhone: $("#detailsPhone"),
    detailsAddress: $("#detailsAddress"),
    detailsStatus: $("#detailsStatus"),

    /* Toast */
    toast: $("#customerToast"),
  };

  /* =========================================================
     STORAGE
  ========================================================= */

  function cloneSeedData() {
    return seedCustomers.map((customer) => ({
      ...customer,
    }));
  }

  function loadCustomers() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          state.customers = parsed;
          return;
        }
      }
    } catch (error) {
      console.warn("NETASSET: unable to load customer data.", error);
    }

    state.customers = cloneSeedData();

    saveCustomers();
  }

  function saveCustomers() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.customers));
    } catch (error) {
      console.warn("NETASSET: unable to save customer data.", error);
    }
  }

  /* =========================================================
     UTILITIES
  ========================================================= */

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function initials(name) {
    const words = String(name || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (!words.length) {
      return "CU";
    }

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  function labelForType(type) {
    const labels = {
      corporate: "Corporate",
      sme: "SME",
      retail: "Retail",
      government: "Government",
    };

    return labels[type] || type || "—";
  }

  function labelForStatus(status) {
    return status === "active" ? "Active" : "Inactive";
  }

  function formatDate(dateString) {
    if (!dateString) {
      return "—";
    }

    const date = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  /* =========================================================
     FILTER
  ========================================================= */

  function getFilteredCustomers() {
    const query = state.search.trim().toLowerCase();

    return state.customers.filter((customer) => {
      const matchesSearch =
        !query ||
        [
          customer.customer_id,
          customer.customer_name,
          customer.contact,
          customer.email,
          customer.phone,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
        );

      const matchesStatus =
        state.status === "all" || customer.status === state.status;

      const matchesType =
        state.type === "all" || customer.customer_type === state.type;

      return matchesSearch && matchesStatus && matchesType;
    });
  }

  /* =========================================================
     SUMMARY
  ========================================================= */

  function updateSummary() {
    const customers = state.customers;

    els.total.textContent = customers.length;

    els.corporate.textContent = customers.filter(
      (customer) => customer.customer_type === "corporate",
    ).length;

    els.sme.textContent = customers.filter(
      (customer) => customer.customer_type === "sme",
    ).length;

    els.retail.textContent = customers.filter(
      (customer) => customer.customer_type === "retail",
    ).length;

    els.government.textContent = customers.filter(
      (customer) => customer.customer_type === "government",
    ).length;
  }

  /* =========================================================
     TABLE RENDER
  ========================================================= */

  function renderTable() {
    const filtered = getFilteredCustomers();

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    if (state.page > totalPages) {
      state.page = totalPages;
    }

    const start = (state.page - 1) * PAGE_SIZE;

    const pageCustomers = filtered.slice(start, start + PAGE_SIZE);

    els.tableBody.innerHTML = pageCustomers
      .map((customer) => {
        const type = escapeHTML(customer.customer_type);

        const status = customer.status === "active" ? "active" : "inactive";

        return `
            <tr data-customer-id="${escapeHTML(customer.customer_id)}">

              <td class="customer-name-cell">

                <div class="customer-identity">

                  <div class="customer-avatar">
                    ${escapeHTML(initials(customer.customer_name))}
                  </div>

                  <div class="customer-identity-copy">

                    <strong class="customer-name">
                      ${escapeHTML(customer.customer_name)}
                    </strong>

                    <span class="customer-id">
                      ${escapeHTML(customer.customer_id)}
                    </span>

                  </div>

                </div>

              </td>


              <td>

                <span
                  class="customer-type-badge customer-type-${type}"
                >
                  ${escapeHTML(labelForType(customer.customer_type))}
                </span>

              </td>


              <td>

                <div class="customer-contact">

                  <strong class="customer-contact-name">
                    ${escapeHTML(customer.contact)}
                  </strong>

                  <span class="customer-contact-detail">
                    ${escapeHTML(customer.email)}
                  </span>

                  <span class="customer-contact-phone">
                    ${escapeHTML(customer.phone)}
                  </span>

                </div>

              </td>


              <td>

                <span
                  class="customer-status-badge customer-status-${status}"
                >
                  <i class="customer-status-dot"></i>

                  ${escapeHTML(labelForStatus(customer.status))}
                </span>

              </td>


              <td class="customer-actions-cell">

                <div class="customer-row-actions">

                  <button
                    type="button"
                    class="customer-row-action"
                    data-action="view"
                    data-id="${escapeHTML(customer.customer_id)}"
                    title="View customer"
                    aria-label="View customer"
                  >
                    ⌾
                  </button>


                  <button
                    type="button"
                    class="customer-row-action"
                    data-action="edit"
                    data-id="${escapeHTML(customer.customer_id)}"
                    title="Edit customer"
                    aria-label="Edit customer"
                  >
                    ✎
                  </button>


                  <button
                    type="button"
                    class="customer-row-action customer-row-action-danger"
                    data-action="delete"
                    data-id="${escapeHTML(customer.customer_id)}"
                    title="Delete customer"
                    aria-label="Delete customer"
                  >
                    ×
                  </button>

                </div>

              </td>

            </tr>
          `;
      })
      .join("");

    const hasResults = pageCustomers.length > 0;

    els.empty.hidden = hasResults;

    els.tableBody.hidden = !hasResults;

    if (filtered.length === 0) {
      els.resultSummary.textContent = "Menampilkan 0 dari 0 customer";
    } else {
      const first = start + 1;

      const last = Math.min(start + PAGE_SIZE, filtered.length);

      els.resultSummary.textContent = `Menampilkan ${first}–${last} dari ${filtered.length} customer`;
    }

    renderPagination(filtered.length, totalPages);
  }

  /* =========================================================
     PAGINATION
  ========================================================= */

  function renderPagination(totalItems, totalPages) {
    els.previous.disabled = state.page <= 1;

    els.next.disabled = state.page >= totalPages;

    els.paginationPages.innerHTML = "";

    if (totalItems === 0) {
      return;
    }

    for (let page = 1; page <= totalPages; page += 1) {
      const button = document.createElement("button");

      button.type = "button";

      button.className = `pagination-page ${
        page === state.page ? "active" : ""
      }`;

      button.textContent = page;

      button.dataset.page = page;

      button.setAttribute("aria-label", `Page ${page}`);

      els.paginationPages.appendChild(button);
    }
  }

  /* =========================================================
     REFRESH
  ========================================================= */

  function refresh() {
    updateSummary();
    renderTable();
  }

  /* =========================================================
     RESET FILTER
  ========================================================= */

  function resetFilters() {
    state.search = "";
    state.status = "all";
    state.type = "all";
    state.page = 1;

    els.search.value = "";
    els.statusFilter.value = "all";

    document.querySelectorAll(".summary-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.filterType === "all");
    });

    refresh();
  }

  /* =========================================================
     ADD / EDIT MODAL
  ========================================================= */

  function openModal(mode = "add", customer = null) {
    state.editingId = customer?.customer_id || null;

    els.form.reset();

    els.formMode.value = mode;

    els.editingId.value = state.editingId || "";

    if (mode === "edit" && customer) {
      els.modalTitle.textContent = "Edit Customer";

      els.modalDescription.textContent =
        "Update the selected customer record in NETASSET.";

      els.id.value = customer.customer_id;

      els.name.value = customer.customer_name;

      els.type.value = customer.customer_type;

      els.contact.value = customer.contact;

      els.email.value = customer.email;

      els.phone.value = customer.phone;

      els.address.value = customer.address;

      els.customerStatus.value = customer.status;

      els.id.readOnly = true;

      els.saveButton.textContent = "Save Changes";
    } else {
      els.modalTitle.textContent = "Add Customer";

      els.modalDescription.textContent =
        "Create a new customer record for NETASSET.";

      els.customerStatus.value = "active";

      els.id.readOnly = false;

      els.saveButton.textContent = "Save Customer";
    }

    if (typeof els.modal.showModal === "function") {
      els.modal.showModal();
    } else {
      els.modal.setAttribute("open", "");
    }

    requestAnimationFrame(() => {
      els.name.focus();
    });
  }

  function closeModal() {
    if (els.modal.open && typeof els.modal.close === "function") {
      els.modal.close();
    } else {
      els.modal.removeAttribute("open");
    }

    state.editingId = null;

    els.form.reset();

    els.id.readOnly = false;
  }

  /* =========================================================
     FORM DATA
  ========================================================= */

  function getFormData() {
    return {
      customer_id: els.id.value.trim(),

      customer_name: els.name.value.trim(),

      customer_type: els.type.value,

      contact: els.contact.value.trim(),

      email: els.email.value.trim(),

      phone: els.phone.value.trim(),

      address: els.address.value.trim(),

      status: els.customerStatus.value,

      updated_at: new Date().toISOString().slice(0, 10),
    };
  }

  /* =========================================================
     VALIDATION
  ========================================================= */

  function validateCustomer(customer) {
    const required = [
      ["Customer ID", customer.customer_id],

      ["Customer Name", customer.customer_name],

      ["Customer Type", customer.customer_type],

      ["Contact", customer.contact],

      ["Email", customer.email],

      ["Phone", customer.phone],

      ["Address", customer.address],

      ["Status", customer.status],
    ];

    const missing = required.find(([, value]) => !value);

    if (missing) {
      showToast(`${missing[0]} wajib diisi.`, "error");

      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      showToast("Format email tidak valid.", "error");

      els.email.focus();

      return false;
    }

    const duplicate = state.customers.some(
      (item) =>
        item.customer_id.toLowerCase() === customer.customer_id.toLowerCase() &&
        item.customer_id !== state.editingId,
    );

    if (duplicate) {
      showToast("Customer ID sudah digunakan.", "error");

      els.id.focus();

      return false;
    }

    return true;
  }

  /* =========================================================
     SAVE CUSTOMER
  ========================================================= */

  function saveCustomer(event) {
    event.preventDefault();

    const customer = getFormData();

    if (!validateCustomer(customer)) {
      return;
    }

    if (state.editingId) {
      const index = state.customers.findIndex(
        (item) => item.customer_id === state.editingId,
      );

      if (index !== -1) {
        state.customers[index] = {
          ...state.customers[index],
          ...customer,

          customer_id: state.editingId,
        };
      }

      showToast("Customer berhasil diperbarui.", "success");
    } else {
      state.customers.unshift(customer);

      state.page = 1;

      showToast("Customer berhasil ditambahkan.", "success");
    }

    saveCustomers();

    closeModal();

    refresh();
  }

  /* =========================================================
     CUSTOMER DETAILS
     ========================================================= */

  function openCustomerDetails(customer) {
    if (!customer) {
      return;
    }

    state.detailsId = customer.customer_id;

    /*
      Populate details
    */

    els.detailsCustomerId.textContent = customer.customer_id || "—";

    els.detailsCustomerName.textContent = customer.customer_name || "—";

    els.detailsCustomerType.textContent = labelForType(customer.customer_type);

    els.detailsContact.textContent = customer.contact || "—";

    els.detailsEmail.textContent = customer.email || "—";

    els.detailsPhone.textContent = customer.phone || "—";

    els.detailsAddress.textContent = customer.address || "—";

    /*
      Status
    */

    const status = customer.status === "active" ? "active" : "inactive";

    els.detailsStatus.className = `customer-status-badge customer-status-${status}`;

    els.detailsStatus.innerHTML = `
      <i class="customer-status-dot"></i>
      ${escapeHTML(labelForStatus(customer.status))}
    `;

    /*
      Open dialog
    */

    if (typeof els.detailsModal.showModal === "function") {
      els.detailsModal.showModal();
    } else {
      els.detailsModal.setAttribute("open", "");
    }
  }

  function closeCustomerDetails() {
    if (els.detailsModal.open && typeof els.detailsModal.close === "function") {
      els.detailsModal.close();
    } else {
      els.detailsModal.removeAttribute("open");
    }

    state.detailsId = null;
  }

  function viewCustomer(id) {
    const customer = state.customers.find((item) => item.customer_id === id);

    if (!customer) {
      return;
    }

    /*
      IMPORTANT:
      View sekarang TIDAK membuka edit form.
      View membuka Customer Details Modal.
    */

    openCustomerDetails(customer);
  }

  /* =========================================================
     EDIT CUSTOMER
  ========================================================= */

  function editCustomer(id) {
    const customer = state.customers.find((item) => item.customer_id === id);

    if (!customer) {
      return;
    }

    openModal("edit", customer);
  }

  /* =========================================================
     EDIT FROM DETAILS
  ========================================================= */

  function editCustomerFromDetails() {
    const customer = state.customers.find(
      (item) => item.customer_id === state.detailsId,
    );

    if (!customer) {
      return;
    }

    closeCustomerDetails();

    requestAnimationFrame(() => {
      openModal("edit", customer);
    });
  }

  /* =========================================================
     DELETE CUSTOMER
  ========================================================= */

  function deleteCustomer(id) {
    const customer = state.customers.find((item) => item.customer_id === id);

    if (!customer) {
      return;
    }

    const confirmed = window.confirm(
      `Hapus customer "${customer.customer_name}" (${customer.customer_id})?`,
    );

    if (!confirmed) {
      return;
    }

    state.customers = state.customers.filter((item) => item.customer_id !== id);

    saveCustomers();

    refresh();

    showToast("Customer berhasil dihapus.", "success");
  }

  /* =========================================================
     TOAST
  ========================================================= */

  function showToast(message, type = "success") {
    els.toast.textContent = message;

    els.toast.className = `customer-toast customer-toast-${type}`;

    els.toast.hidden = false;

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
      els.toast.hidden = true;
    }, 2600);
  }

  /* =========================================================
     TABLE ACTIONS
  ========================================================= */

  function handleTableAction(event) {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const { action, id } = button.dataset;

    if (action === "view") {
      viewCustomer(id);
    }

    if (action === "edit") {
      editCustomer(id);
    }

    if (action === "delete") {
      deleteCustomer(id);
    }
  }

  /* =========================================================
     SUMMARY FILTER
  ========================================================= */

  function handleSummaryFilter(event) {
    const chip = event.target.closest(".summary-chip");

    if (!chip) {
      return;
    }

    state.type = chip.dataset.filterType || "all";

    state.page = 1;

    document.querySelectorAll(".summary-chip").forEach((item) => {
      item.classList.toggle("active", item === chip);
    });

    refresh();
  }

  /* =========================================================
     SEARCH
  ========================================================= */

  function handleSearch() {
    state.search = els.search.value;

    state.page = 1;

    renderTable();
  }

  /* =========================================================
     STATUS FILTER
  ========================================================= */

  function handleStatusFilter() {
    state.status = els.statusFilter.value;

    state.page = 1;

    renderTable();
  }

  /* =========================================================
     PAGINATION
  ========================================================= */

  function handlePagination(event) {
    const pageButton = event.target.closest("[data-page]");

    if (pageButton) {
      state.page = Number(pageButton.dataset.page);

      renderTable();

      return;
    }

    if (event.target.closest("#previousPageButton")) {
      if (state.page > 1) {
        state.page -= 1;

        renderTable();
      }
    }

    if (event.target.closest("#nextPageButton")) {
      const totalPages = Math.max(
        1,
        Math.ceil(getFilteredCustomers().length / PAGE_SIZE),
      );

      if (state.page < totalPages) {
        state.page += 1;

        renderTable();
      }
    }
  }

  /* =========================================================
     TOPBAR MENU
  ========================================================= */

  function handleCustomerMenu() {
    showToast("Customer actions menu belum dikonfigurasi.", "info");
  }

  /* =========================================================
     MODAL BACKDROP HELPERS
  ========================================================= */

  function handleFormModalClick(event) {
    if (event.target === els.modal) {
      closeModal();
    }
  }

  function handleDetailsModalClick(event) {
    if (event.target === els.detailsModal) {
      closeCustomerDetails();
    }
  }

  /* =========================================================
     KEYBOARD
  ========================================================= */

  function handleEscape(event) {
    if (event.key !== "Escape") {
      return;
    }

    if (els.modal.open) {
      closeModal();

      return;
    }

    if (els.detailsModal.open) {
      closeCustomerDetails();
    }
  }

  /* =========================================================
     RESET FORM STATE
  ========================================================= */

  function resetFormControls() {
    els.saveButton.hidden = false;

    els.cancelForm.textContent = "Cancel";

    els.id.readOnly = false;
  }

  /* =========================================================
     EVENT BINDING
  ========================================================= */

  function bindEvents() {
    /* Search */
    els.search.addEventListener("input", handleSearch);

    /* Status */
    els.statusFilter.addEventListener("change", handleStatusFilter);

    /* Summary */
    els.summary.addEventListener("click", handleSummaryFilter);

    /* Table */
    els.tableBody.addEventListener("click", handleTableAction);

    /* Pagination */
    els.previous.addEventListener("click", handlePagination);

    els.next.addEventListener("click", handlePagination);

    els.paginationPages.addEventListener("click", handlePagination);

    /* Add */
    els.addButton.addEventListener("click", () => {
      resetFormControls();

      openModal("add");
    });

    /* Form modal close */
    els.closeModal.addEventListener("click", closeModal);

    els.cancelForm.addEventListener("click", closeModal);

    /* Form submit */
    els.form.addEventListener("submit", saveCustomer);

    /* Form modal close event */
    els.modal.addEventListener("close", resetFormControls);

    /* Form backdrop */
    els.modal.addEventListener("click", handleFormModalClick);

    /* Details modal close */
    els.closeDetails.addEventListener("click", closeCustomerDetails);

    els.closeDetailsButton.addEventListener("click", closeCustomerDetails);

    /* Edit from details */
    els.editFromDetails.addEventListener("click", editCustomerFromDetails);

    /* Details backdrop */
    els.detailsModal.addEventListener("click", handleDetailsModalClick);

    /* Topbar menu */
    els.menuButton.addEventListener("click", handleCustomerMenu);

    /* Escape */
    document.addEventListener("keydown", handleEscape);
  }

  /* =========================================================
     INITIALIZATION
  ========================================================= */

  function init() {
    loadCustomers();

    bindEvents();

    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
