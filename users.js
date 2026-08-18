/* =========================================================
   NETASSET — USERS
   Users page logic
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     CONFIG
  ======================================================= */

  const STORAGE_KEY = "netasset_users";

  const ITEMS_PER_PAGE = 8;

  let users = [];

  let filteredUsers = [];

  let currentPage = 1;

  let currentDetailsUserId = null;

  /* =======================================================
     DOM ELEMENTS
  ======================================================= */

  const userTableBody = document.getElementById("userTableBody");

  const userEmptyState = document.getElementById("userEmptyState");

  const userSearch = document.getElementById("userSearch");

  const userStatusFilter = document.getElementById("userStatusFilter");

  const totalUserCount = document.getElementById("totalUserCount");

  const activeUserCount = document.getElementById("activeUserCount");

  const inactiveUserCount = document.getElementById("inactiveUserCount");

  const userResultSummary = document.getElementById("userResultSummary");

  const userPaginationPages = document.getElementById("userPaginationPages");

  const previousUserPageButton = document.getElementById(
    "previousUserPageButton",
  );

  const nextUserPageButton = document.getElementById("nextUserPageButton");

  const addUserButton = document.getElementById("addUserButton");

  /* =======================================================
     ADD / EDIT MODAL
  ======================================================= */

  const userModal = document.getElementById("userModal");

  const userModalTitle = document.getElementById("userModalTitle");

  const userModalDescription = document.getElementById("userModalDescription");

  const closeUserModal = document.getElementById("closeUserModal");

  const cancelUserForm = document.getElementById("cancelUserForm");

  const userForm = document.getElementById("userForm");

  const userFormMode = document.getElementById("userFormMode");

  const editingUserId = document.getElementById("editingUserId");

  const employeeId = document.getElementById("employeeId");

  const userName = document.getElementById("userName");

  const userEmail = document.getElementById("userEmail");

  const userDepartment = document.getElementById("userDepartment");

  const userRole = document.getElementById("userRole");

  const userStatus = document.getElementById("userStatus");

  const saveUserButton = document.getElementById("saveUserButton");

  /* =======================================================
     DETAILS MODAL
  ======================================================= */

  const userDetailsModal = document.getElementById("userDetailsModal");

  const closeUserDetails = document.getElementById("closeUserDetails");

  const closeUserDetailsButton = document.getElementById(
    "closeUserDetailsButton",
  );

  const editUserFromDetails = document.getElementById("editUserFromDetails");

  const detailsEmployeeId = document.getElementById("detailsEmployeeId");

  const detailsUserName = document.getElementById("detailsUserName");

  const detailsUserEmail = document.getElementById("detailsUserEmail");

  const detailsUserDepartment = document.getElementById(
    "detailsUserDepartment",
  );

  const detailsUserRole = document.getElementById("detailsUserRole");

  const detailsUserStatus = document.getElementById("detailsUserStatus");

  /* =======================================================
     TOAST
  ======================================================= */

  const userToast = document.getElementById("userToast");

  /* =======================================================
     DEFAULT DATA
     
     These are prototype records only.
  ======================================================= */

  const defaultUsers = [
    {
      id: "USR-0001",
      employeeId: "EMP-0001",
      name: "Budi Santoso",
      email: "budi.santoso@netasset.id",
      department: "Network Operations",
      role: "Administrator",
      status: "active",
    },

    {
      id: "USR-0002",
      employeeId: "EMP-0002",
      name: "Andi Pratama",
      email: "andi.pratama@netasset.id",
      department: "Network Operations",
      role: "Network Engineer",
      status: "active",
    },

    {
      id: "USR-0003",
      employeeId: "EMP-0003",
      name: "Siti Rahma",
      email: "siti.rahma@netasset.id",
      department: "IT",
      role: "Asset Manager",
      status: "active",
    },

    {
      id: "USR-0004",
      employeeId: "EMP-0004",
      name: "Dimas Wijaya",
      email: "dimas.wijaya@netasset.id",
      department: "Engineering",
      role: "Network Engineer",
      status: "active",
    },

    {
      id: "USR-0005",
      employeeId: "EMP-0005",
      name: "Rizky Maulana",
      email: "rizky.maulana@netasset.id",
      department: "IT",
      role: "Technician",
      status: "active",
    },

    {
      id: "USR-0006",
      employeeId: "EMP-0006",
      name: "Fajar Nugroho",
      email: "fajar.nugroho@netasset.id",
      department: "Engineering",
      role: "Technician",
      status: "inactive",
    },

    {
      id: "USR-0007",
      employeeId: "EMP-0007",
      name: "Nadia Putri",
      email: "nadia.putri@netasset.id",
      department: "Administration",
      role: "Viewer",
      status: "active",
    },

    {
      id: "USR-0008",
      employeeId: "EMP-0008",
      name: "Arif Setiawan",
      email: "arif.setiawan@netasset.id",
      department: "Finance",
      role: "Viewer",
      status: "inactive",
    },

    {
      id: "USR-0009",
      employeeId: "EMP-0009",
      name: "Kevin Hartono",
      email: "kevin.hartono@netasset.id",
      department: "IT",
      role: "Administrator",
      status: "active",
    },

    {
      id: "USR-0010",
      employeeId: "EMP-0010",
      name: "Yoga Ramadhan",
      email: "yoga.ramadhan@netasset.id",
      department: "Network Operations",
      role: "Network Engineer",
      status: "active",
    },
  ];

  /* =======================================================
     INITIALIZE
  ======================================================= */

  initializeUsers();

  /* =======================================================
     LOAD USERS
  ======================================================= */

  function initializeUsers() {
    const storedUsers = localStorage.getItem(STORAGE_KEY);

    if (storedUsers) {
      try {
        users = JSON.parse(storedUsers);

        if (!Array.isArray(users)) {
          users = [...defaultUsers];
        }
      } catch (error) {
        console.warn(
          "NETASSET: Failed to read users from LocalStorage.",
          error,
        );

        users = [...defaultUsers];
      }
    } else {
      users = [...defaultUsers];

      saveUsers();
    }

    updateSummary();

    applyFilters();
  }

  /* =======================================================
     SAVE USERS
  ======================================================= */

  function saveUsers() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  /* =======================================================
     FILTER USERS
  ======================================================= */

  function applyFilters() {
    const searchValue = userSearch.value.trim().toLowerCase();

    const statusValue = userStatusFilter.value;

    filteredUsers = users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.employeeId.toLowerCase().includes(searchValue) ||
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.department.toLowerCase().includes(searchValue) ||
        user.role.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusValue === "all" || user.status === statusValue;

      return matchesSearch && matchesStatus;
    });

    /* -----------------------------------------------
       Reset page when filter changes
    ------------------------------------------------ */

    const totalPages = getTotalPages();

    if (currentPage > totalPages) {
      currentPage = Math.max(totalPages, 1);
    }

    renderUsers();

    renderPagination();

    updateResultSummary();
  }

  /* =======================================================
     RENDER USERS
  ======================================================= */

  function renderUsers() {
    userTableBody.innerHTML = "";

    if (filteredUsers.length === 0) {
      userEmptyState.hidden = false;

      userTableBody.style.display = "none";

      return;
    }

    userEmptyState.hidden = true;

    userTableBody.style.display = "";

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    const pageUsers = filteredUsers.slice(startIndex, endIndex);

    pageUsers.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>
          <div class="user-identity">

            <div class="user-avatar">
              ${getInitials(user.name)}
            </div>

            <div class="user-identity-copy">

              <span class="user-name">
                ${escapeHtml(user.name)}
              </span>

              <span class="user-email">
                ${escapeHtml(user.email)}
              </span>

            </div>

          </div>
        </td>

        <td>
          <span class="user-employee-id">
            ${escapeHtml(user.employeeId)}
          </span>
        </td>

        <td>
          <span class="user-department">
            ${escapeHtml(user.department)}
          </span>
        </td>

        <td>
          ${renderRoleBadge(user.role)}
        </td>

        <td>
          ${renderStatusBadge(user.status)}
        </td>

        <td class="user-actions-cell">

          <div class="user-row-actions">

            <button
              type="button"
              class="user-row-action"
              data-action="view"
              data-id="${user.id}"
              title="View user"
              aria-label="View ${escapeHtml(user.name)}"
            >
              👁
            </button>

            <button
              type="button"
              class="user-row-action"
              data-action="edit"
              data-id="${user.id}"
              title="Edit user"
              aria-label="Edit ${escapeHtml(user.name)}"
            >
              ✎
            </button>

            <button
              type="button"
              class="user-row-action user-row-action-danger"
              data-action="delete"
              data-id="${user.id}"
              title="Delete user"
              aria-label="Delete ${escapeHtml(user.name)}"
            >
              ×
            </button>

          </div>

        </td>
      `;

      userTableBody.appendChild(row);
    });
  }

  /* =======================================================
     SUMMARY
  ======================================================= */

  function updateSummary() {
    const total = users.length;

    const active = users.filter((user) => user.status === "active").length;

    const inactive = users.filter((user) => user.status === "inactive").length;

    totalUserCount.textContent = total;

    activeUserCount.textContent = active;

    inactiveUserCount.textContent = inactive;
  }

  /* =======================================================
     RESULT SUMMARY
  ======================================================= */

  function updateResultSummary() {
    if (filteredUsers.length === 0) {
      userResultSummary.textContent = "Showing 0 of 0 users";

      return;
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1;

    const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length);

    userResultSummary.textContent = `Showing ${start}–${end} of ${filteredUsers.length} users`;
  }

  /* =======================================================
     PAGINATION
  ======================================================= */

  function getTotalPages() {
    return Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  }

  function renderPagination() {
    userPaginationPages.innerHTML = "";

    const totalPages = getTotalPages();

    previousUserPageButton.disabled = currentPage <= 1;

    nextUserPageButton.disabled = currentPage >= totalPages;

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

        renderUsers();

        renderPagination();

        updateResultSummary();
      });

      userPaginationPages.appendChild(button);
    }
  }

  /* =======================================================
     PREVIOUS PAGE
  ======================================================= */

  previousUserPageButton.addEventListener("click", () => {
    if (currentPage <= 1) {
      return;
    }

    currentPage--;

    renderUsers();

    renderPagination();

    updateResultSummary();
  });

  /* =======================================================
     NEXT PAGE
  ======================================================= */

  nextUserPageButton.addEventListener("click", () => {
    const totalPages = getTotalPages();

    if (currentPage >= totalPages) {
      return;
    }

    currentPage++;

    renderUsers();

    renderPagination();

    updateResultSummary();
  });

  /* =======================================================
     SEARCH
  ======================================================= */

  userSearch.addEventListener("input", () => {
    currentPage = 1;

    applyFilters();
  });

  /* =======================================================
     STATUS FILTER
  ======================================================= */

  userStatusFilter.addEventListener("change", () => {
    currentPage = 1;

    applyFilters();

    updateSummaryChipState(userStatusFilter.value);
  });

  /* =======================================================
     SUMMARY FILTER CHIPS
  ======================================================= */

  document.querySelectorAll(".user-summary-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const filterType = chip.dataset.filterType;

      userStatusFilter.value = filterType;

      currentPage = 1;

      applyFilters();

      updateSummaryChipState(filterType);
    });
  });

  function updateSummaryChipState(selectedType) {
    document.querySelectorAll(".user-summary-chip").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.filterType === selectedType);
    });
  }

  /* =======================================================
     TABLE ACTIONS
  ======================================================= */

  userTableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const action = button.dataset.action;

    const id = button.dataset.id;

    if (action === "view") {
      openUserDetails(id);
    } else if (action === "edit") {
      openEditUser(id);
    } else if (action === "delete") {
      deleteUser(id);
    }
  });

  /* =======================================================
     OPEN ADD USER
  ======================================================= */

  addUserButton.addEventListener("click", () => {
    openAddUser();
  });

  function openAddUser() {
    resetUserForm();

    userFormMode.value = "add";

    editingUserId.value = "";

    userModalTitle.textContent = "Add User";

    userModalDescription.textContent = "Create a new NETASSET user record.";

    saveUserButton.textContent = "Save User";

    employeeId.readOnly = false;

    if (typeof userModal.showModal === "function") {
      userModal.showModal();
    } else {
      userModal.setAttribute("open", "");
    }

    setTimeout(() => {
      employeeId.focus();
    }, 50);
  }

  /* =======================================================
     OPEN EDIT USER
  ======================================================= */

  function openEditUser(id) {
    const user = users.find((item) => item.id === id);

    if (!user) {
      showToast("User data could not be found.", "error");

      return;
    }

    userFormMode.value = "edit";

    editingUserId.value = user.id;

    employeeId.value = user.employeeId;

    userName.value = user.name;

    userEmail.value = user.email;

    userDepartment.value = getDepartmentValue(user.department);

    userRole.value = getRoleValue(user.role);

    userStatus.value = user.status;

    employeeId.readOnly = true;

    userModalTitle.textContent = "Edit User";

    userModalDescription.textContent =
      "Update the selected NETASSET user record.";

    saveUserButton.textContent = "Save Changes";

    if (typeof userModal.showModal === "function") {
      userModal.showModal();
    } else {
      userModal.setAttribute("open", "");
    }
  }

  /* =======================================================
     USER FORM SUBMIT
  ======================================================= */

  userForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = getUserFormData();

    if (!validateUserForm(formData)) {
      return;
    }

    const mode = userFormMode.value;

    if (mode === "add") {
      createUser(formData);
    } else if (mode === "edit") {
      updateUser(formData);
    }
  });

  /* =======================================================
     GET FORM DATA
  ======================================================= */

  function getUserFormData() {
    return {
      employeeId: employeeId.value.trim(),

      name: userName.value.trim(),

      email: userEmail.value.trim(),

      department: getDepartmentLabel(userDepartment.value),

      role: getRoleLabel(userRole.value),

      status: userStatus.value,
    };
  }

  /* =======================================================
     VALIDATE FORM
  ======================================================= */

  function validateUserForm(formData) {
    if (!formData.employeeId) {
      showToast("Employee ID is required.", "error");

      employeeId.focus();

      return false;
    }

    if (!formData.name) {
      showToast("Name is required.", "error");

      userName.focus();

      return false;
    }

    if (!formData.email) {
      showToast("Email is required.", "error");

      userEmail.focus();

      return false;
    }

    if (!isValidEmail(formData.email)) {
      showToast("Please enter a valid email address.", "error");

      userEmail.focus();

      return false;
    }

    if (!userDepartment.value) {
      showToast("Please select a department.", "error");

      userDepartment.focus();

      return false;
    }

    if (!userRole.value) {
      showToast("Please select a role.", "error");

      userRole.focus();

      return false;
    }

    /* -----------------------------------------------
       Employee ID uniqueness
    ------------------------------------------------ */

    const currentId = editingUserId.value;

    const duplicate = users.some(
      (user) =>
        user.employeeId.toLowerCase() === formData.employeeId.toLowerCase() &&
        user.id !== currentId,
    );

    if (duplicate) {
      showToast("Employee ID already exists.", "error");

      employeeId.focus();

      return false;
    }

    return true;
  }

  /* =======================================================
     CREATE USER
  ======================================================= */

  function createUser(formData) {
    const newUser = {
      id: generateUserId(),

      employeeId: formData.employeeId,

      name: formData.name,

      email: formData.email,

      department: formData.department,

      role: formData.role,

      status: formData.status,
    };

    users.unshift(newUser);

    saveUsers();

    updateSummary();

    currentPage = 1;

    applyFilters();

    closeUserForm();

    showToast(`${newUser.name} has been added successfully.`, "success");
  }

  /* =======================================================
     UPDATE USER
  ======================================================= */

  function updateUser(formData) {
    const index = users.findIndex((user) => user.id === editingUserId.value);

    if (index === -1) {
      showToast("User could not be found.", "error");

      return;
    }

    const originalUser = users[index];

    users[index] = {
      ...originalUser,

      name: formData.name,

      email: formData.email,

      department: formData.department,

      role: formData.role,

      status: formData.status,
    };

    saveUsers();

    updateSummary();

    applyFilters();

    closeUserForm();

    showToast(`${users[index].name} has been updated successfully.`, "success");
  }

  /* =======================================================
     DELETE USER
  ======================================================= */

  function deleteUser(id) {
    const user = users.find((item) => item.id === id);

    if (!user) {
      return;
    }

    const confirmed = window.confirm(
      `Delete user "${user.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    users = users.filter((item) => item.id !== id);

    saveUsers();

    updateSummary();

    applyFilters();

    showToast(`${user.name} has been deleted.`, "success");
  }

  /* =======================================================
     RESET FORM
  ======================================================= */

  function resetUserForm() {
    userForm.reset();

    userFormMode.value = "add";

    editingUserId.value = "";

    userStatus.value = "active";

    employeeId.readOnly = false;
  }

  /* =======================================================
     CLOSE USER FORM
  ======================================================= */

  closeUserModal.addEventListener("click", closeUserForm);

  cancelUserForm.addEventListener("click", closeUserForm);

  function closeUserForm() {
    if (typeof userModal.close === "function") {
      userModal.close();
    } else {
      userModal.removeAttribute("open");
    }

    resetUserForm();
  }

  /* =======================================================
     CLOSE MODAL WHEN CLICKING BACKDROP
  ======================================================= */

  userModal.addEventListener("click", (event) => {
    if (event.target === userModal) {
      closeUserForm();
    }
  });

  /* =======================================================
     OPEN USER DETAILS
  ======================================================= */

  function openUserDetails(id) {
    const user = users.find((item) => item.id === id);

    if (!user) {
      showToast("User data could not be found.", "error");

      return;
    }

    currentDetailsUserId = user.id;

    detailsEmployeeId.textContent = user.employeeId;

    detailsUserName.textContent = user.name;

    detailsUserEmail.textContent = user.email;

    detailsUserDepartment.textContent = user.department;

    detailsUserRole.textContent = user.role;

    renderDetailsStatus(user.status);

    if (typeof userDetailsModal.showModal === "function") {
      userDetailsModal.showModal();
    } else {
      userDetailsModal.setAttribute("open", "");
    }
  }

  /* =======================================================
     DETAILS STATUS
  ======================================================= */

  function renderDetailsStatus(status) {
    detailsUserStatus.className = "user-status-badge";

    detailsUserStatus.classList.add(
      status === "active" ? "user-status-active" : "user-status-inactive",
    );

    detailsUserStatus.innerHTML = `
      <i class="user-status-dot"></i>
      ${status === "active" ? "Active" : "Inactive"}
    `;
  }

  /* =======================================================
     CLOSE DETAILS
  ======================================================= */

  closeUserDetails.addEventListener("click", closeDetailsModal);

  closeUserDetailsButton.addEventListener("click", closeDetailsModal);

  function closeDetailsModal() {
    if (typeof userDetailsModal.close === "function") {
      userDetailsModal.close();
    } else {
      userDetailsModal.removeAttribute("open");
    }

    currentDetailsUserId = null;
  }

  /* =======================================================
     DETAILS → EDIT
  ======================================================= */

  editUserFromDetails.addEventListener("click", () => {
    if (!currentDetailsUserId) {
      return;
    }

    const id = currentDetailsUserId;

    closeDetailsModal();

    openEditUser(id);
  });

  /* =======================================================
     DETAILS BACKDROP
  ======================================================= */

  userDetailsModal.addEventListener("click", (event) => {
    if (event.target === userDetailsModal) {
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

    if (userModal.open) {
      closeUserForm();
    } else if (userDetailsModal.open) {
      closeDetailsModal();
    }
  });

  /* =======================================================
     ROLE BADGE
  ======================================================= */

  function renderRoleBadge(role) {
    const roleClass = getRoleClass(role);

    return `
      <span class="user-role-badge ${roleClass}">
        ${escapeHtml(role)}
      </span>
    `;
  }

  function getRoleClass(role) {
    const normalized = role.toLowerCase().replace(/\s+/g, "-");

    const classes = {
      administrator: "user-role-administrator",

      "network-engineer": "user-role-network-engineer",

      "asset-manager": "user-role-asset-manager",

      technician: "user-role-technician",

      viewer: "user-role-viewer",
    };

    return classes[normalized] || "";
  }

  /* =======================================================
     STATUS BADGE
  ======================================================= */

  function renderStatusBadge(status) {
    const label = status === "active" ? "Active" : "Inactive";

    const statusClass =
      status === "active" ? "user-status-active" : "user-status-inactive";

    return `
      <span class="user-status-badge ${statusClass}">
        <i class="user-status-dot"></i>
        ${label}
      </span>
    `;
  }

  /* =======================================================
     INITIALS
  ======================================================= */

  function getInitials(name) {
    if (!name) {
      return "U";
    }

    const words = name.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  /* =======================================================
     GENERATE USER ID
  ======================================================= */

  function generateUserId() {
    let highestNumber = 0;

    users.forEach((user) => {
      const match = user.id.match(/^USR-(\d+)$/);

      if (match) {
        const number = Number(match[1]);

        if (number > highestNumber) {
          highestNumber = number;
        }
      }
    });

    return "USR-" + String(highestNumber + 1).padStart(4, "0");
  }

  /* =======================================================
     DEPARTMENT VALUE / LABEL
  ======================================================= */

  function getDepartmentValue(label) {
    const values = {
      "Network Operations": "network-operations",

      IT: "it",

      Engineering: "engineering",

      Finance: "finance",

      Administration: "administration",
    };

    return values[label] || "";
  }

  function getDepartmentLabel(value) {
    const labels = {
      "network-operations": "Network Operations",

      it: "IT",

      engineering: "Engineering",

      finance: "Finance",

      administration: "Administration",
    };

    return labels[value] || "";
  }

  /* =======================================================
     ROLE VALUE / LABEL
  ======================================================= */

  function getRoleValue(label) {
    const values = {
      Administrator: "administrator",

      "Network Engineer": "network-engineer",

      "Asset Manager": "asset-manager",

      Technician: "technician",

      Viewer: "viewer",
    };

    return values[label] || "";
  }

  function getRoleLabel(value) {
    const labels = {
      administrator: "Administrator",

      "network-engineer": "Network Engineer",

      "asset-manager": "Asset Manager",

      technician: "Technician",

      viewer: "Viewer",
    };

    return labels[value] || "";
  }

  /* =======================================================
     EMAIL VALIDATION
  ======================================================= */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* =======================================================
     HTML ESCAPE
  ======================================================= */

  function escapeHtml(value) {
    return String(value)
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

    userToast.hidden = false;

    userToast.textContent = message;

    userToast.className = "user-toast";

    if (type === "error") {
      userToast.classList.add("user-toast-error");
    } else if (type === "info") {
      userToast.classList.add("user-toast-info");
    }

    toastTimer = setTimeout(() => {
      userToast.hidden = true;
    }, 3000);
  }

  /* =======================================================
     DEBUG HELPER
     
     Can be used from browser console:
     
     netassetUsers.reset()
     netassetUsers.clear()
  ======================================================= */

  window.netassetUsers = {
    getUsers() {
      return [...users];
    },

    reset() {
      users = [...defaultUsers];

      saveUsers();

      currentPage = 1;

      updateSummary();

      applyFilters();

      showToast("User data has been reset.", "info");
    },

    clear() {
      users = [];

      saveUsers();

      currentPage = 1;

      updateSummary();

      applyFilters();

      showToast("All user data has been cleared.", "info");
    },
  };
});
