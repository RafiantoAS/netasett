/* =========================================================
   NETASSET — DEPARTMENTS
   Department page logic
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     CONFIG
  ======================================================= */

  const STORAGE_KEY = "netasset_departments";
  const USERS_STORAGE_KEY = "netasset_users";

  const ITEMS_PER_PAGE = 8;

  let departments = [];
  let filteredDepartments = [];

  let currentPage = 1;

  let currentDetailsDepartmentId = null;

  /* =======================================================
     DOM ELEMENTS
  ======================================================= */

  const departmentTableBody = document.getElementById("departmentTableBody");

  const departmentEmptyState = document.getElementById("departmentEmptyState");

  const departmentSearch = document.getElementById("departmentSearch");

  const departmentStatusFilter = document.getElementById(
    "departmentStatusFilter",
  );

  const totalDepartmentCount = document.getElementById("totalDepartmentCount");

  const activeDepartmentCount = document.getElementById(
    "activeDepartmentCount",
  );

  const inactiveDepartmentCount = document.getElementById(
    "inactiveDepartmentCount",
  );

  const departmentResultSummary = document.getElementById(
    "departmentResultSummary",
  );

  const departmentPaginationPages = document.getElementById(
    "departmentPaginationPages",
  );

  const previousDepartmentPageButton = document.getElementById(
    "previousDepartmentPageButton",
  );

  const nextDepartmentPageButton = document.getElementById(
    "nextDepartmentPageButton",
  );

  const addDepartmentButton = document.getElementById("addDepartmentButton");

  /* =======================================================
     ADD / EDIT MODAL
  ======================================================= */

  const departmentModal = document.getElementById("departmentModal");

  const departmentModalTitle = document.getElementById("departmentModalTitle");

  const departmentModalDescription = document.getElementById(
    "departmentModalDescription",
  );

  const closeDepartmentModal = document.getElementById("closeDepartmentModal");

  const cancelDepartmentForm = document.getElementById("cancelDepartmentForm");

  const departmentForm = document.getElementById("departmentForm");

  const departmentFormMode = document.getElementById("departmentFormMode");

  const editingDepartmentId = document.getElementById("editingDepartmentId");

  const departmentName = document.getElementById("departmentName");

  const departmentCode = document.getElementById("departmentCode");

  const departmentDescription = document.getElementById(
    "departmentDescription",
  );

  const departmentStatus = document.getElementById("departmentStatus");

  const saveDepartmentButton = document.getElementById("saveDepartmentButton");

  /* =======================================================
     DETAILS MODAL
  ======================================================= */

  const departmentDetailsModal = document.getElementById(
    "departmentDetailsModal",
  );

  const closeDepartmentDetails = document.getElementById(
    "closeDepartmentDetails",
  );

  const closeDepartmentDetailsButton = document.getElementById(
    "closeDepartmentDetailsButton",
  );

  const editDepartmentFromDetails = document.getElementById(
    "editDepartmentFromDetails",
  );

  const detailsDepartmentName = document.getElementById(
    "detailsDepartmentName",
  );

  const detailsDepartmentCode = document.getElementById(
    "detailsDepartmentCode",
  );

  const detailsDepartmentDescription = document.getElementById(
    "detailsDepartmentDescription",
  );

  const detailsDepartmentUsers = document.getElementById(
    "detailsDepartmentUsers",
  );

  const detailsDepartmentStatus = document.getElementById(
    "detailsDepartmentStatus",
  );

  /* =======================================================
     TOAST
  ======================================================= */

  const departmentToast = document.getElementById("departmentToast");

  /* =======================================================
     DEFAULT DEPARTMENT DATA
     
     Prototype records.
  ======================================================= */

  const defaultDepartments = [
    {
      id: "DEP-0001",
      name: "Network Operations",
      code: "NETOPS",
      description: "Network operation and infrastructure management team.",
      status: "active",
    },

    {
      id: "DEP-0002",
      name: "Information Technology",
      code: "IT",
      description: "Information technology systems and application support.",
      status: "active",
    },

    {
      id: "DEP-0003",
      name: "Engineering",
      code: "ENG",
      description: "Engineering and technical infrastructure development.",
      status: "active",
    },

    {
      id: "DEP-0004",
      name: "Finance",
      code: "FIN",
      description: "Financial management and accounting operations.",
      status: "active",
    },

    {
      id: "DEP-0005",
      name: "Administration",
      code: "ADMIN",
      description: "General administration and organizational support.",
      status: "active",
    },

    {
      id: "DEP-0006",
      name: "Human Resources",
      code: "HR",
      description: "Human resources and employee administration.",
      status: "active",
    },

    {
      id: "DEP-0007",
      name: "Procurement",
      code: "PROC",
      description: "Procurement and vendor purchasing operations.",
      status: "active",
    },

    {
      id: "DEP-0008",
      name: "Legacy Operations",
      code: "LEGACY",
      description:
        "Legacy organizational unit retained for historical records.",
      status: "inactive",
    },

    {
      id: "DEP-0009",
      name: "Customer Service",
      code: "CS",
      description: "Customer support and service operations.",
      status: "active",
    },

    {
      id: "DEP-0010",
      name: "Security",
      code: "SEC",
      description: "Information and infrastructure security operations.",
      status: "active",
    },
  ];

  /* =======================================================
     INITIALIZE
  ======================================================= */

  initializeDepartments();

  /* =======================================================
     LOAD DEPARTMENTS
  ======================================================= */

  function initializeDepartments() {
    const storedDepartments = localStorage.getItem(STORAGE_KEY);

    if (storedDepartments) {
      try {
        departments = JSON.parse(storedDepartments);

        if (!Array.isArray(departments)) {
          departments = [...defaultDepartments];
        }
      } catch (error) {
        console.warn(
          "NETASSET: Failed to read departments from LocalStorage.",
          error,
        );

        departments = [...defaultDepartments];
      }
    } else {
      departments = [...defaultDepartments];

      saveDepartments();
    }

    updateSummary();

    applyFilters();
  }

  /* =======================================================
     SAVE DEPARTMENTS
  ======================================================= */

  function saveDepartments() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
  }

  /* =======================================================
     APPLY FILTERS
  ======================================================= */

  function applyFilters() {
    const searchValue = departmentSearch.value.trim().toLowerCase();

    const statusValue = departmentStatusFilter.value;

    filteredDepartments = departments.filter((department) => {
      const matchesSearch =
        !searchValue ||
        department.name.toLowerCase().includes(searchValue) ||
        department.code.toLowerCase().includes(searchValue) ||
        department.description.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusValue === "all" || department.status === statusValue;

      return matchesSearch && matchesStatus;
    });

    const totalPages = getTotalPages();

    if (currentPage > totalPages) {
      currentPage = Math.max(totalPages, 1);
    }

    renderDepartments();

    renderPagination();

    updateResultSummary();
  }

  /* =======================================================
     RENDER DEPARTMENTS
  ======================================================= */

  function renderDepartments() {
    departmentTableBody.innerHTML = "";

    if (filteredDepartments.length === 0) {
      departmentEmptyState.hidden = false;

      departmentTableBody.style.display = "none";

      return;
    }

    departmentEmptyState.hidden = true;

    departmentTableBody.style.display = "";

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    const pageDepartments = filteredDepartments.slice(startIndex, endIndex);

    pageDepartments.forEach((department) => {
      const row = document.createElement("tr");

      const userCount = getDepartmentUserCount(department);

      row.innerHTML = `
          <td>

            <div class="department-identity">

              <div class="department-avatar">
                ${getDepartmentInitials(department.name)}
              </div>

              <div class="department-identity-copy">

                <span class="department-name">
                  ${escapeHtml(department.name)}
                </span>

                <span class="department-description-short">
                  ${escapeHtml(department.description)}
                </span>

              </div>

            </div>

          </td>

          <td>
            <span class="department-code">
              ${escapeHtml(department.code)}
            </span>
          </td>

          <td>
            <span class="department-description">
              ${escapeHtml(department.description)}
            </span>
          </td>

          <td>
            <span class="department-users-count">
              ${userCount}
              ${userCount === 1 ? "user" : "users"}
            </span>
          </td>

          <td>
            ${renderStatusBadge(department.status)}
          </td>

          <td class="department-actions-cell">

            <div class="department-row-actions">

              <button
                type="button"
                class="department-row-action"
                data-action="view"
                data-id="${department.id}"
                title="View department"
                aria-label="View ${escapeHtml(department.name)}"
              >
                👁
              </button>

              <button
                type="button"
                class="department-row-action"
                data-action="edit"
                data-id="${department.id}"
                title="Edit department"
                aria-label="Edit ${escapeHtml(department.name)}"
              >
                ✎
              </button>

              <button
                type="button"
                class="department-row-action department-row-action-danger"
                data-action="delete"
                data-id="${department.id}"
                title="Delete department"
                aria-label="Delete ${escapeHtml(department.name)}"
              >
                ×
              </button>

            </div>

          </td>
        `;

      departmentTableBody.appendChild(row);
    });
  }

  /* =======================================================
     SUMMARY
  ======================================================= */

  function updateSummary() {
    const total = departments.length;

    const active = departments.filter(
      (department) => department.status === "active",
    ).length;

    const inactive = departments.filter(
      (department) => department.status === "inactive",
    ).length;

    totalDepartmentCount.textContent = total;

    activeDepartmentCount.textContent = active;

    inactiveDepartmentCount.textContent = inactive;
  }

  /* =======================================================
     RESULT SUMMARY
  ======================================================= */

  function updateResultSummary() {
    if (filteredDepartments.length === 0) {
      departmentResultSummary.textContent = "Showing 0 of 0 departments";

      return;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;

    const end = Math.min(
      currentPage * ITEMS_PER_PAGE,
      filteredDepartments.length,
    );

    departmentResultSummary.textContent = `Showing ${start}–${end} of ${filteredDepartments.length} departments`;
  }

  /* =======================================================
     PAGINATION
  ======================================================= */

  function getTotalPages() {
    return Math.ceil(filteredDepartments.length / ITEMS_PER_PAGE);
  }

  function renderPagination() {
    departmentPaginationPages.innerHTML = "";

    const totalPages = getTotalPages();

    previousDepartmentPageButton.disabled = currentPage <= 1;

    nextDepartmentPageButton.disabled = currentPage >= totalPages;

    if (totalPages <= 1) {
      return;
    }

    for (let page = 1; page <= totalPages; page++) {
      const button = document.createElement("button");

      button.type = "button";

      button.className = "pagination-page";

      button.textContent = page;

      if (page === currentPage) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        currentPage = page;

        renderDepartments();

        renderPagination();

        updateResultSummary();
      });

      departmentPaginationPages.appendChild(button);
    }
  }

  /* =======================================================
     PREVIOUS PAGE
  ======================================================= */

  previousDepartmentPageButton.addEventListener("click", () => {
    if (currentPage <= 1) {
      return;
    }

    currentPage--;

    renderDepartments();

    renderPagination();

    updateResultSummary();
  });

  /* =======================================================
     NEXT PAGE
  ======================================================= */

  nextDepartmentPageButton.addEventListener("click", () => {
    const totalPages = getTotalPages();

    if (currentPage >= totalPages) {
      return;
    }

    currentPage++;

    renderDepartments();

    renderPagination();

    updateResultSummary();
  });

  /* =======================================================
     SEARCH
  ======================================================= */

  departmentSearch.addEventListener("input", () => {
    currentPage = 1;

    applyFilters();
  });

  /* =======================================================
     STATUS FILTER
  ======================================================= */

  departmentStatusFilter.addEventListener("change", () => {
    currentPage = 1;

    applyFilters();

    updateSummaryChipState(departmentStatusFilter.value);
  });

  /* =======================================================
     SUMMARY FILTER CHIPS
  ======================================================= */

  document.querySelectorAll(".department-summary-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const filterType = chip.dataset.filterType;

      departmentStatusFilter.value = filterType;

      currentPage = 1;

      applyFilters();

      updateSummaryChipState(filterType);
    });
  });

  function updateSummaryChipState(selectedType) {
    document.querySelectorAll(".department-summary-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.filterType === selectedType);
    });
  }

  /* =======================================================
     TABLE ACTIONS
  ======================================================= */

  departmentTableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    const id = button.dataset.id;

    if (action === "view") {
      openDepartmentDetails(id);
    } else if (action === "edit") {
      openEditDepartment(id);
    } else if (action === "delete") {
      deleteDepartment(id);
    }
  });

  /* =======================================================
     OPEN ADD DEPARTMENT
  ======================================================= */

  addDepartmentButton.addEventListener("click", () => {
    openAddDepartment();
  });

  function openAddDepartment() {
    resetDepartmentForm();

    departmentFormMode.value = "add";

    editingDepartmentId.value = "";

    departmentModalTitle.textContent = "Add Department";

    departmentModalDescription.textContent =
      "Create a new organizational department.";

    saveDepartmentButton.textContent = "Save Department";

    departmentCode.readOnly = false;

    if (typeof departmentModal.showModal === "function") {
      departmentModal.showModal();
    } else {
      departmentModal.setAttribute("open", "");
    }

    setTimeout(() => {
      departmentName.focus();
    }, 50);
  }

  /* =======================================================
     OPEN EDIT DEPARTMENT
  ======================================================= */

  function openEditDepartment(id) {
    const department = departments.find((item) => item.id === id);

    if (!department) {
      showToast("Department data could not be found.", "error");

      return;
    }

    departmentFormMode.value = "edit";

    editingDepartmentId.value = department.id;

    departmentName.value = department.name;

    departmentCode.value = department.code;

    departmentDescription.value = department.description;

    departmentStatus.value = department.status;

    /*
      Department Code acts as the
      stable identifier during edit.
    */

    departmentCode.readOnly = true;

    departmentModalTitle.textContent = "Edit Department";

    departmentModalDescription.textContent =
      "Update the selected organizational department.";

    saveDepartmentButton.textContent = "Save Changes";

    if (typeof departmentModal.showModal === "function") {
      departmentModal.showModal();
    } else {
      departmentModal.setAttribute("open", "");
    }
  }

  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  departmentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = getDepartmentFormData();

    if (!validateDepartmentForm(formData)) {
      return;
    }

    const mode = departmentFormMode.value;

    if (mode === "add") {
      createDepartment(formData);
    } else if (mode === "edit") {
      updateDepartment(formData);
    }
  });

  /* =======================================================
     GET FORM DATA
  ======================================================= */

  function getDepartmentFormData() {
    return {
      name: departmentName.value.trim(),

      code: departmentCode.value.trim().toUpperCase(),

      description: departmentDescription.value.trim(),

      status: departmentStatus.value,
    };
  }

  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  function validateDepartmentForm(formData) {
    if (!formData.name) {
      showToast("Department name is required.", "error");

      departmentName.focus();

      return false;
    }

    if (!formData.code) {
      showToast("Department code is required.", "error");

      departmentCode.focus();

      return false;
    }

    if (!/^[A-Z0-9_-]+$/.test(formData.code)) {
      showToast(
        "Department code may only contain letters, numbers, hyphens, and underscores.",
        "error",
      );

      departmentCode.focus();

      return false;
    }

    /*
      Name uniqueness
    */

    const currentId = editingDepartmentId.value;

    const duplicateName = departments.some(
      (department) =>
        department.name.toLowerCase() === formData.name.toLowerCase() &&
        department.id !== currentId,
    );

    if (duplicateName) {
      showToast("Department name already exists.", "error");

      departmentName.focus();

      return false;
    }

    /*
      Code uniqueness
    */

    const duplicateCode = departments.some(
      (department) =>
        department.code.toLowerCase() === formData.code.toLowerCase() &&
        department.id !== currentId,
    );

    if (duplicateCode) {
      showToast("Department code already exists.", "error");

      departmentCode.focus();

      return false;
    }

    return true;
  }

  /* =======================================================
     CREATE DEPARTMENT
  ======================================================= */

  function createDepartment(formData) {
    const newDepartment = {
      id: generateDepartmentId(),

      name: formData.name,

      code: formData.code,

      description: formData.description,

      status: formData.status,
    };

    departments.unshift(newDepartment);

    saveDepartments();

    updateSummary();

    currentPage = 1;

    applyFilters();

    closeDepartmentForm();

    showToast(`${newDepartment.name} has been added successfully.`, "success");
  }

  /* =======================================================
     UPDATE DEPARTMENT
  ======================================================= */

  function updateDepartment(formData) {
    const index = departments.findIndex(
      (department) => department.id === editingDepartmentId.value,
    );

    if (index === -1) {
      showToast("Department could not be found.", "error");

      return;
    }

    const originalDepartment = departments[index];

    departments[index] = {
      ...originalDepartment,

      name: formData.name,

      description: formData.description,

      status: formData.status,
    };

    saveDepartments();

    updateSummary();

    applyFilters();

    closeDepartmentForm();

    showToast(
      `${departments[index].name} has been updated successfully.`,
      "success",
    );
  }

  /* =======================================================
     DELETE DEPARTMENT
  ======================================================= */

  function deleteDepartment(id) {
    const department = departments.find((item) => item.id === id);

    if (!department) {
      return;
    }

    /*
      Check whether this department
      is currently assigned to users.
    */

    const userCount = getDepartmentUserCount(department);

    if (userCount > 0) {
      window.alert(
        `This department cannot be deleted.\n\n` +
          `${department.name} is currently assigned to ` +
          `${userCount} ${userCount === 1 ? "user" : "users"}.\n\n` +
          `Set the department to Inactive instead if it is no longer used.`,
      );

      return;
    }

    const confirmed = window.confirm(
      `Delete department "${department.name}"?\n\n` +
        `This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    departments = departments.filter((item) => item.id !== id);

    saveDepartments();

    updateSummary();

    applyFilters();

    showToast(`${department.name} has been deleted.`, "success");
  }

  /* =======================================================
     RESET FORM
  ======================================================= */

  function resetDepartmentForm() {
    departmentForm.reset();

    departmentFormMode.value = "add";

    editingDepartmentId.value = "";

    departmentStatus.value = "active";

    departmentCode.readOnly = false;
  }

  /* =======================================================
     CLOSE FORM
  ======================================================= */

  closeDepartmentModal.addEventListener("click", closeDepartmentForm);

  cancelDepartmentForm.addEventListener("click", closeDepartmentForm);

  function closeDepartmentForm() {
    if (typeof departmentModal.close === "function") {
      departmentModal.close();
    } else {
      departmentModal.removeAttribute("open");
    }

    resetDepartmentForm();
  }

  /* =======================================================
     FORM MODAL BACKDROP
  ======================================================= */

  departmentModal.addEventListener("click", (event) => {
    if (event.target === departmentModal) {
      closeDepartmentForm();
    }
  });

  /* =======================================================
     OPEN DETAILS
  ======================================================= */

  function openDepartmentDetails(id) {
    const department = departments.find((item) => item.id === id);

    if (!department) {
      showToast("Department data could not be found.", "error");

      return;
    }

    currentDetailsDepartmentId = department.id;

    detailsDepartmentName.textContent = department.name;

    detailsDepartmentCode.textContent = department.code;

    detailsDepartmentDescription.textContent =
      department.description || "No description provided.";

    const userCount = getDepartmentUserCount(department);

    detailsDepartmentUsers.textContent = `${userCount} ${
      userCount === 1 ? "user" : "users"
    }`;

    renderDetailsStatus(department.status);

    if (typeof departmentDetailsModal.showModal === "function") {
      departmentDetailsModal.showModal();
    } else {
      departmentDetailsModal.setAttribute("open", "");
    }
  }

  /* =======================================================
     DETAILS STATUS
  ======================================================= */

  function renderDetailsStatus(status) {
    detailsDepartmentStatus.className = "department-status-badge";

    detailsDepartmentStatus.classList.add(
      status === "active"
        ? "department-status-active"
        : "department-status-inactive",
    );

    detailsDepartmentStatus.innerHTML = `
      <i class="department-status-dot"></i>
      ${status === "active" ? "Active" : "Inactive"}
    `;
  }

  /* =======================================================
     CLOSE DETAILS
  ======================================================= */

  closeDepartmentDetails.addEventListener("click", closeDetailsModal);

  closeDepartmentDetailsButton.addEventListener("click", closeDetailsModal);

  function closeDetailsModal() {
    if (typeof departmentDetailsModal.close === "function") {
      departmentDetailsModal.close();
    } else {
      departmentDetailsModal.removeAttribute("open");
    }

    currentDetailsDepartmentId = null;
  }

  /* =======================================================
     DETAILS → EDIT
  ======================================================= */

  editDepartmentFromDetails.addEventListener("click", () => {
    if (!currentDetailsDepartmentId) {
      return;
    }

    const id = currentDetailsDepartmentId;

    closeDetailsModal();

    openEditDepartment(id);
  });

  /* =======================================================
     DETAILS BACKDROP
  ======================================================= */

  departmentDetailsModal.addEventListener("click", (event) => {
    if (event.target === departmentDetailsModal) {
      closeDetailsModal();
    }
  });

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (departmentModal.open) {
      closeDepartmentForm();
    } else if (departmentDetailsModal.open) {
      closeDetailsModal();
    }
  });

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  function renderStatusBadge(status) {
    const label = status === "active" ? "Active" : "Inactive";

    const statusClass =
      status === "active"
        ? "department-status-active"
        : "department-status-inactive";

    return `
      <span class="department-status-badge ${statusClass}">
        <i class="department-status-dot"></i>
        ${label}
      </span>
    `;
  }

  /* =======================================================
     DEPARTMENT USER COUNT
  ======================================================= */

  function getDepartmentUserCount(department) {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);

    if (!storedUsers) {
      return 0;
    }

    try {
      const users = JSON.parse(storedUsers);

      if (!Array.isArray(users)) {
        return 0;
      }

      /*
        Current prototype users store
        the department as a label.

        Later, when Laravel is implemented,
        this will become department_id.
      */

      return users.filter(
        (user) =>
          String(user.department || "").toLowerCase() ===
          department.name.toLowerCase(),
      ).length;
    } catch (error) {
      console.warn("NETASSET: Unable to count department users.", error);

      return 0;
    }
  }

  /* =======================================================
     DEPARTMENT INITIALS
  ======================================================= */

  function getDepartmentInitials(name) {
    if (!name) {
      return "DP";
    }

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  /* =======================================================
     GENERATE DEPARTMENT ID
  ======================================================= */

  function generateDepartmentId() {
    let highestNumber = 0;

    departments.forEach((department) => {
      const match = department.id.match(/^DEP-(\d+)$/);

      if (match) {
        const number = Number(match[1]);

        if (number > highestNumber) {
          highestNumber = number;
        }
      }
    });

    return "DEP-" + String(highestNumber + 1).padStart(4, "0");
  }

  /* =======================================================
     HTML ESCAPE
  ======================================================= */

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =======================================================
     TOAST
  ======================================================= */

  let toastTimer = null;

  function showToast(message, type = "success") {
    clearTimeout(toastTimer);

    departmentToast.hidden = false;

    departmentToast.textContent = message;

    departmentToast.className = "department-toast";

    if (type === "error") {
      departmentToast.classList.add("department-toast-error");
    } else if (type === "info") {
      departmentToast.classList.add("department-toast-info");
    }

    toastTimer = setTimeout(() => {
      departmentToast.hidden = true;
    }, 3000);
  }

  /* =======================================================
     DEBUG / DEVELOPMENT HELPER
     
     Browser console:

       netassetDepartments.getDepartments()

       netassetDepartments.reset()

       netassetDepartments.clear()
  ======================================================= */

  window.netassetDepartments = {
    getDepartments() {
      return [...departments];
    },

    reset() {
      departments = [...defaultDepartments];

      saveDepartments();

      currentPage = 1;

      updateSummary();

      applyFilters();

      showToast("Department data has been reset.", "info");
    },

    clear() {
      departments = [];

      saveDepartments();

      currentPage = 1;

      updateSummary();

      applyFilters();

      showToast("All department data has been cleared.", "info");
    },
  };
});
