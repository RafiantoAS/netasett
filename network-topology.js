/* =========================================================
   NETASSET — NETWORK TOPOLOGY
   network-topology.js

   Page-specific JavaScript.
   Does not modify the shared sidebar or global app.js.
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
       DOM REFERENCES
       ========================================================= */

  const canvas = document.getElementById("topologyCanvas");
  const nodesLayer = document.getElementById("topologyNodes");
  const linksLayer = document.getElementById("topologyLinks");
  const grid = document.querySelector(".topology-grid");

  if (!canvas || !nodesLayer || !linksLayer) {
    return;
  }

  /* =========================================================
       FILTER / CONTROL ELEMENTS
       ========================================================= */

  const searchInput = document.getElementById("topologySearch");

  const typeFilter = document.getElementById("topologyTypeFilter");

  const locationFilter = document.getElementById("topologyLocationFilter");

  const statusFilter = document.getElementById("topologyStatusFilter");

  const layoutSelect = document.getElementById("topologyLayoutSelect");

  /* =========================================================
       STATISTICS
       ========================================================= */

  const statNodes = document.getElementById("topologyStatNodes");

  const statLinks = document.getElementById("topologyStatLinks");

  const statActive = document.getElementById("topologyStatActive");

  const statLocations = document.getElementById("topologyStatLocations");

  /* =========================================================
       FOOTER
       ========================================================= */

  const resultCount = document.getElementById("topologyResultCount");

  /* =========================================================
       BUTTONS
       ========================================================= */

  const zoomInButton = document.getElementById("topologyZoomIn");

  const zoomOutButton = document.getElementById("topologyZoomOut");

  const fitButton = document.getElementById("topologyFitCanvas");

  const headerFitButton = document.getElementById("topologyFitBtn");

  const resetButton = document.getElementById("topologyResetViewBtn");

  const fullscreenButton = document.getElementById("topologyFullscreenBtn");

  /* =========================================================
       DEMO TOPOLOGY DATA

       Struktur ini sengaja dibuat menyerupai data NETASSET.

       Nanti ketika backend Laravel sudah dibuat,
       bagian ini dapat diganti dengan API response.
       ========================================================= */

  const topologyNodes = [
    {
      id: "RTR-JKT-001",
      name: "Core Router",
      code: "RTR-JKT-001",
      type: "router",
      location: "Jakarta DC-01",
      status: "Active",
      icon: "RTR",
    },

    {
      id: "SW-JKT-001",
      name: "Core Switch",
      code: "SW-JKT-001",
      type: "switch",
      location: "Jakarta DC-01",
      status: "Active",
      icon: "SW",
    },

    {
      id: "SW-JKT-002",
      name: "Distribution Switch",
      code: "SW-JKT-002",
      type: "switch",
      location: "Jakarta POP-01",
      status: "Active",
      icon: "SW",
    },

    {
      id: "SRV-JKT-001",
      name: "Core Application Server",
      code: "SRV-JKT-001",
      type: "server",
      location: "Jakarta DC-01",
      status: "Active",
      icon: "SRV",
    },

    {
      id: "SRV-JKT-002",
      name: "Customer Portal Server",
      code: "SRV-JKT-002",
      type: "server",
      location: "Jakarta POP-01",
      status: "Active",
      icon: "SRV",
    },

    {
      id: "OLT-JKT-001",
      name: "Jakarta Access OLT",
      code: "OLT-JKT-001",
      type: "olt",
      location: "Jakarta POP-01",
      status: "Active",
      icon: "OLT",
    },

    {
      id: "VM-MON-001",
      name: "Monitoring VM",
      code: "VM-MON-001",
      type: "vm",
      location: "Jakarta DC-01",
      status: "Active",
      icon: "VM",
    },

    {
      id: "VPN-JKT-SBY-001",
      name: "Jakarta–Surabaya Core VPN",
      code: "VPN-0001",
      type: "vpn",
      location: "Jakarta DC-01",
      status: "Active",
      icon: "VPN",
    },

    {
      id: "RTR-SBY-001",
      name: "Surabaya Edge Router",
      code: "RTR-SBY-001",
      type: "router",
      location: "Surabaya POP-01",
      status: "Active",
      icon: "RTR",
    },

    {
      id: "SW-SBY-001",
      name: "Surabaya Distribution Switch",
      code: "SW-SBY-001",
      type: "switch",
      location: "Surabaya POP-01",
      status: "Maintenance",
      icon: "SW",
    },
  ];

  /* =========================================================
       RELATIONSHIPS

       source -> target
       ========================================================= */

  const topologyLinks = [
    {
      source: "RTR-JKT-001",
      target: "SW-JKT-001",
    },

    {
      source: "SW-JKT-001",
      target: "SW-JKT-002",
    },

    {
      source: "SW-JKT-001",
      target: "SRV-JKT-001",
    },

    {
      source: "SW-JKT-002",
      target: "SRV-JKT-002",
    },

    {
      source: "SW-JKT-002",
      target: "OLT-JKT-001",
    },

    {
      source: "SW-JKT-001",
      target: "VM-MON-001",
    },

    {
      source: "RTR-JKT-001",
      target: "VPN-JKT-SBY-001",
    },

    {
      source: "VPN-JKT-SBY-001",
      target: "RTR-SBY-001",
    },

    {
      source: "RTR-SBY-001",
      target: "SW-SBY-001",
    },
  ];

  /* =========================================================
       STATE
       ========================================================= */

  const state = {
    zoom: 1,

    minZoom: 0.55,

    maxZoom: 1.8,

    panX: 0,

    panY: 0,

    draggingNode: null,

    draggingCanvas: false,

    pointerStartX: 0,

    pointerStartY: 0,

    nodeStartX: 0,

    nodeStartY: 0,

    panStartX: 0,

    panStartY: 0,

    positions: {},

    visibleNodes: [],

    visibleLinks: [],

    currentLayout: "auto",
  };

  /* =========================================================
       NODE COLORS
       ========================================================= */

  const nodeTypeClass = {
    router: "legend-router",
    switch: "legend-switch",
    server: "legend-server",
    olt: "legend-olt",
    vm: "legend-virtual",
    vpn: "legend-virtual",
  };

  /* =========================================================
       INITIAL POSITIONS
       ========================================================= */

  function createInitialPositions() {
    const positions = {
      "RTR-JKT-001": {
        x: 170,
        y: 190,
      },

      "SW-JKT-001": {
        x: 430,
        y: 120,
      },

      "SW-JKT-002": {
        x: 700,
        y: 120,
      },

      "SRV-JKT-001": {
        x: 430,
        y: 300,
      },

      "SRV-JKT-002": {
        x: 700,
        y: 300,
      },

      "OLT-JKT-001": {
        x: 960,
        y: 300,
      },

      "VM-MON-001": {
        x: 430,
        y: 450,
      },

      "VPN-JKT-SBY-001": {
        x: 700,
        y: 450,
      },

      "RTR-SBY-001": {
        x: 960,
        y: 450,
      },

      "SW-SBY-001": {
        x: 1210,
        y: 450,
      },
    };

    state.positions = positions;
  }

  /* =========================================================
       FILTERING
       ========================================================= */

  function getFilteredNodes() {
    const query = (searchInput?.value || "").trim().toLowerCase();

    const selectedType = typeFilter?.value || "";

    const selectedLocation = locationFilter?.value || "";

    const selectedStatus = statusFilter?.value || "";

    return topologyNodes.filter((node) => {
      const searchableText = [
        node.id,
        node.name,
        node.code,
        node.type,
        node.location,
        node.status,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesType = !selectedType || node.type === selectedType;

      const matchesLocation =
        !selectedLocation || node.location === selectedLocation;

      const matchesStatus = !selectedStatus || node.status === selectedStatus;

      return matchesSearch && matchesType && matchesLocation && matchesStatus;
    });
  }

  /* =========================================================
       FILTER LINKS
       ========================================================= */

  function getFilteredLinks(nodes) {
    const visibleIds = new Set(nodes.map((node) => node.id));

    return topologyLinks.filter((link) => {
      return visibleIds.has(link.source) && visibleIds.has(link.target);
    });
  }

  /* =========================================================
       CREATE NODE ELEMENT
       ========================================================= */

  function createNodeElement(node) {
    const element = document.createElement("article");

    element.className = "topology-node";

    element.dataset.nodeId = node.id;

    const iconClass = nodeTypeClass[node.type] || "legend-virtual";

    element.innerHTML = `

            <div class="topology-node-header">

                <div
                    class="topology-node-icon ${iconClass}"
                >
                    ${escapeHTML(node.icon)}
                </div>

                <span class="topology-node-type">
                    ${escapeHTML(formatType(node.type))}
                </span>

            </div>


            <h3 class="topology-node-name">
                ${escapeHTML(node.name)}
            </h3>


            <div class="topology-node-code">
                ${escapeHTML(node.code)}
            </div>


            <div class="topology-node-status">
                ${escapeHTML(node.status)}
            </div>

        `;

    element.addEventListener("pointerdown", handleNodePointerDown);

    element.addEventListener("click", handleNodeClick);

    return element;
  }

  /* =========================================================
       FORMAT TYPE
       ========================================================= */

  function formatType(type) {
    const labels = {
      router: "Router",

      switch: "Switch",

      server: "Server",

      olt: "OLT",

      vm: "Virtual Machine",

      vpn: "VPN",
    };

    return labels[type] || type;
  }

  /* =========================================================
       ESCAPE HTML
       ========================================================= */

  function escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  /* =========================================================
       RENDER
       ========================================================= */

  function render() {
    state.visibleNodes = getFilteredNodes();

    state.visibleLinks = getFilteredLinks(state.visibleNodes);

    renderNodes();

    renderLinks();

    updateStatistics();

    updateFooter();

    applyViewportTransform();
  }

  /* =========================================================
       RENDER NODES
       ========================================================= */

  function renderNodes() {
    nodesLayer.innerHTML = "";

    if (!state.visibleNodes.length) {
      nodesLayer.innerHTML = `

                <div class="topology-empty-state">

                    <div class="topology-empty-icon">
                        N
                    </div>

                    <strong>
                        No topology data
                    </strong>

                    <span>
                        No network nodes match
                        the selected filters.
                    </span>

                </div>

            `;

      return;
    }

    state.visibleNodes.forEach((node) => {
      if (!state.positions[node.id]) {
        state.positions[node.id] = {
          x: 100,
          y: 100,
        };
      }

      const element = createNodeElement(node);

      const position = state.positions[node.id];

      element.style.left = `${position.x}px`;

      element.style.top = `${position.y}px`;

      nodesLayer.appendChild(element);
    });
  }

  /* =========================================================
       RENDER LINKS
       ========================================================= */

  function renderLinks() {
    linksLayer.innerHTML = `

            <defs>

                <marker
                    id="topologyArrow"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="3"
                    orient="auto"
                >

                    <path
                        d="M0,0 L0,6 L6,3 z"
                    ></path>

                </marker>

            </defs>

        `;

    state.visibleLinks.forEach((link) => {
      const source = state.positions[link.source];

      const target = state.positions[link.target];

      if (!source || !target) {
        return;
      }

      const sourceElement = nodesLayer.querySelector(
        `[data-node-id="${CSS.escape(link.source)}"]`,
      );

      const targetElement = nodesLayer.querySelector(
        `[data-node-id="${CSS.escape(link.target)}"]`,
      );

      if (!sourceElement || !targetElement) {
        return;
      }

      const sourceWidth = sourceElement.offsetWidth;

      const sourceHeight = sourceElement.offsetHeight;

      const targetWidth = targetElement.offsetWidth;

      const targetHeight = targetElement.offsetHeight;

      const x1 = source.x + sourceWidth / 2;

      const y1 = source.y + sourceHeight / 2;

      const x2 = target.x + targetWidth / 2;

      const y2 = target.y + targetHeight / 2;

      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );

      line.setAttribute("x1", x1);

      line.setAttribute("y1", y1);

      line.setAttribute("x2", x2);

      line.setAttribute("y2", y2);

      line.setAttribute("marker-end", "url(#topologyArrow)");

      linksLayer.appendChild(line);
    });
  }

  /* =========================================================
       UPDATE STATISTICS
       ========================================================= */

  function updateStatistics() {
    const nodes = state.visibleNodes;

    const links = state.visibleLinks;

    const active = nodes.filter((node) => node.status === "Active").length;

    const locations = new Set(nodes.map((node) => node.location)).size;

    if (statNodes) {
      statNodes.textContent = nodes.length;
    }

    if (statLinks) {
      statLinks.textContent = links.length;
    }

    if (statActive) {
      statActive.textContent = active;
    }

    if (statLocations) {
      statLocations.textContent = locations;
    }
  }

  /* =========================================================
       FOOTER
       ========================================================= */

  function updateFooter() {
    if (!resultCount) {
      return;
    }

    const nodeText = state.visibleNodes.length === 1 ? "node" : "nodes";

    resultCount.textContent = `${state.visibleNodes.length} ${nodeText} shown`;
  }

  /* =========================================================
       VIEWPORT TRANSFORM
       ========================================================= */

  function applyViewportTransform() {
    const transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;

    nodesLayer.style.transform = transform;

    nodesLayer.style.transformOrigin = "0 0";

    linksLayer.style.transform = transform;

    linksLayer.style.transformOrigin = "0 0";
  }

  /* =========================================================
       ZOOM
       ========================================================= */

  function setZoom(
    nextZoom,
    centerX = canvas.clientWidth / 2,
    centerY = canvas.clientHeight / 2,
  ) {
    const clampedZoom = Math.max(
      state.minZoom,
      Math.min(state.maxZoom, nextZoom),
    );

    if (clampedZoom === state.zoom) {
      return;
    }

    /*
     * Keep the point under the mouse
     * in approximately the same position.
     */

    const zoomRatio = clampedZoom / state.zoom;

    state.panX = centerX - (centerX - state.panX) * zoomRatio;

    state.panY = centerY - (centerY - state.panY) * zoomRatio;

    state.zoom = clampedZoom;

    applyViewportTransform();
  }

  /* =========================================================
       ZOOM IN
       ========================================================= */

  function zoomIn() {
    setZoom(state.zoom + 0.1);
  }

  /* =========================================================
       ZOOM OUT
       ========================================================= */

  function zoomOut() {
    setZoom(state.zoom - 0.1);
  }

  /* =========================================================
       FIT VIEW
       ========================================================= */

  function fitView() {
    if (!state.visibleNodes.length) {
      state.zoom = 1;

      state.panX = 0;

      state.panY = 0;

      applyViewportTransform();

      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    state.visibleNodes.forEach((node) => {
      const position = state.positions[node.id];

      if (!position) {
        return;
      }

      const element = nodesLayer.querySelector(
        `[data-node-id="${CSS.escape(node.id)}"]`,
      );

      const width = element?.offsetWidth || 190;

      const height = element?.offsetHeight || 92;

      minX = Math.min(minX, position.x);

      minY = Math.min(minY, position.y);

      maxX = Math.max(maxX, position.x + width);

      maxY = Math.max(maxY, position.y + height);
    });

    if (!Number.isFinite(minX)) {
      return;
    }

    const padding = 90;

    const boundsWidth = maxX - minX;

    const boundsHeight = maxY - minY;

    const canvasWidth = canvas.clientWidth;

    const canvasHeight = canvas.clientHeight;

    const scaleX = (canvasWidth - padding * 2) / Math.max(boundsWidth, 1);

    const scaleY = (canvasHeight - padding * 2) / Math.max(boundsHeight, 1);

    const nextZoom = Math.min(scaleX, scaleY, 1.25);

    state.zoom = Math.max(state.minZoom, Math.min(state.maxZoom, nextZoom));

    const scaledWidth = boundsWidth * state.zoom;

    const scaledHeight = boundsHeight * state.zoom;

    state.panX = (canvasWidth - scaledWidth) / 2 - minX * state.zoom;

    state.panY = (canvasHeight - scaledHeight) / 2 - minY * state.zoom;

    applyViewportTransform();
  }

  /* =========================================================
       RESET VIEW
       ========================================================= */

  function resetView() {
    state.zoom = 1;

    state.panX = 0;

    state.panY = 0;

    state.currentLayout = layoutSelect?.value || "auto";

    createInitialPositions();

    applyLayout(state.currentLayout, false);

    render();

    requestAnimationFrame(() => {
      fitView();
    });
  }

  /* =========================================================
       LAYOUT ENGINE
       ========================================================= */

  function applyLayout(layout, shouldRender = true) {
    const nodes = state.visibleNodes.length
      ? state.visibleNodes
      : topologyNodes;

    if (!nodes.length) {
      return;
    }

    const canvasWidth = Math.max(canvas.clientWidth, 1000);

    const spacingX = 260;

    const spacingY = 180;

    if (layout === "horizontal" || layout === "auto") {
      const columns = Math.max(2, Math.floor(canvasWidth / spacingX));

      nodes.forEach((node, index) => {
        const column = index % columns;

        const row = Math.floor(index / columns);

        state.positions[node.id] = {
          x: 90 + column * spacingX,

          y: 80 + row * spacingY,
        };
      });
    }

    if (layout === "vertical") {
      nodes.forEach((node, index) => {
        state.positions[node.id] = {
          x: 180 + (index % 3) * 300,

          y: 70 + Math.floor(index / 3) * 170,
        };
      });
    }

    if (layout === "hierarchical") {
      const levels = {
        router: 0,

        switch: 1,

        server: 2,

        olt: 2,

        vm: 2,

        vpn: 3,
      };

      const grouped = {};

      nodes.forEach((node) => {
        const level = levels[node.type] ?? 2;

        if (!grouped[level]) {
          grouped[level] = [];
        }

        grouped[level].push(node);
      });

      Object.entries(grouped).forEach(([level, levelNodes]) => {
        const numericLevel = Number(level);

        const total = levelNodes.length;

        levelNodes.forEach((node, index) => {
          const groupWidth = Math.max(1, total - 1);

          state.positions[node.id] = {
            x: 120 + (index / groupWidth) * 900,

            y: 70 + numericLevel * 170,
          };
        });
      });
    }

    if (shouldRender) {
      render();
    }
  }

  /* =========================================================
       NODE DRAG
       ========================================================= */

  function handleNodePointerDown(event) {
    const element = event.currentTarget;

    const nodeId = element.dataset.nodeId;

    const position = state.positions[nodeId];

    if (!position) {
      return;
    }

    event.stopPropagation();

    state.draggingNode = nodeId;

    state.pointerStartX = event.clientX;

    state.pointerStartY = event.clientY;

    state.nodeStartX = position.x;

    state.nodeStartY = position.y;

    element.setPointerCapture(event.pointerId);

    element.style.zIndex = "20";
  }

  /* =========================================================
       NODE CLICK
       ========================================================= */

  function handleNodeClick(event) {
    if (
      Math.abs(event.clientX - state.pointerStartX) > 5 ||
      Math.abs(event.clientY - state.pointerStartY) > 5
    ) {
      return;
    }

    const nodeId = event.currentTarget.dataset.nodeId;

    const node = topologyNodes.find((item) => item.id === nodeId);

    if (!node) {
      return;
    }

    /*
     * For now we use a small native notification.
     * Later this can become a proper NETASSET detail drawer.
     */

    console.info("NETASSET topology node:", node);
  }

  /* =========================================================
       POINTER MOVE
       ========================================================= */

  function handlePointerMove(event) {
    if (state.draggingNode) {
      const nodeId = state.draggingNode;

      const position = state.positions[nodeId];

      if (!position) {
        return;
      }

      const deltaX = (event.clientX - state.pointerStartX) / state.zoom;

      const deltaY = (event.clientY - state.pointerStartY) / state.zoom;

      position.x = state.nodeStartX + deltaX;

      position.y = state.nodeStartY + deltaY;

      updateNodePosition(nodeId);

      renderLinks();

      return;
    }

    if (state.draggingCanvas) {
      state.panX = state.panStartX + (event.clientX - state.pointerStartX);

      state.panY = state.panStartY + (event.clientY - state.pointerStartY);

      applyViewportTransform();
    }
  }

  /* =========================================================
       UPDATE ONE NODE POSITION
       ========================================================= */

  function updateNodePosition(nodeId) {
    const element = nodesLayer.querySelector(
      `[data-node-id="${CSS.escape(nodeId)}"]`,
    );

    if (!element) {
      return;
    }

    const position = state.positions[nodeId];

    element.style.left = `${position.x}px`;

    element.style.top = `${position.y}px`;
  }

  /* =========================================================
       POINTER UP
       ========================================================= */

  function handlePointerUp() {
    if (state.draggingNode) {
      const element = nodesLayer.querySelector(
        `[data-node-id="${CSS.escape(state.draggingNode)}"]`,
      );

      if (element) {
        element.style.zIndex = "";
      }
    }

    state.draggingNode = null;

    state.draggingCanvas = false;

    canvas.classList.remove("is-panning");
  }

  /* =========================================================
       CANVAS PAN
       ========================================================= */

  function handleCanvasPointerDown(event) {
    if (
      event.target.closest(".topology-node") ||
      event.target.closest(".topology-zoom-controls") ||
      event.target.closest(".topology-legend")
    ) {
      return;
    }

    state.draggingCanvas = true;

    state.pointerStartX = event.clientX;

    state.pointerStartY = event.clientY;

    state.panStartX = state.panX;

    state.panStartY = state.panY;

    canvas.classList.add("is-panning");
  }

  /* =========================================================
       MOUSE WHEEL ZOOM
       ========================================================= */

  function handleWheel(event) {
    event.preventDefault();

    const rect = canvas.getBoundingClientRect();

    const centerX = event.clientX - rect.left;

    const centerY = event.clientY - rect.top;

    const direction = event.deltaY < 0 ? 1 : -1;

    setZoom(state.zoom + direction * 0.08, centerX, centerY);
  }

  /* =========================================================
       SEARCH / FILTER EVENTS
       ========================================================= */

  function handleFiltersChanged() {
    state.visibleNodes = getFilteredNodes();

    state.visibleLinks = getFilteredLinks(state.visibleNodes);

    render();
  }

  /* =========================================================
       LAYOUT CHANGE
       ========================================================= */

  function handleLayoutChange() {
    const layout = layoutSelect?.value || "auto";

    state.currentLayout = layout;

    applyLayout(layout);

    requestAnimationFrame(() => {
      fitView();
    });
  }

  /* =========================================================
       FULLSCREEN
       ========================================================= */

  function toggleFullscreen() {
    const mapCard = document.getElementById("topologyMapCard");

    if (!mapCard) {
      return;
    }

    mapCard.classList.toggle("is-fullscreen");

    if (mapCard.classList.contains("is-fullscreen")) {
      if (fullscreenButton) {
        fullscreenButton.innerHTML = "⛶ Exit Fullscreen";
      }
    } else {
      if (fullscreenButton) {
        fullscreenButton.innerHTML = "⛶ Fullscreen";
      }
    }

    requestAnimationFrame(() => {
      fitView();
    });
  }

  /* =========================================================
       KEYBOARD
       ========================================================= */

  function handleKeyboard(event) {
    if (event.target.matches("input, select, textarea")) {
      return;
    }

    if (event.key === "+") {
      zoomIn();
    }

    if (event.key === "-") {
      zoomOut();
    }

    if (event.key.toLowerCase() === "f") {
      fitView();
    }

    if (event.key === "Escape") {
      const mapCard = document.getElementById("topologyMapCard");

      if (mapCard?.classList.contains("is-fullscreen")) {
        mapCard.classList.remove("is-fullscreen");

        if (fullscreenButton) {
          fullscreenButton.innerHTML = "⛶ Fullscreen";
        }

        requestAnimationFrame(fitView);
      }
    }
  }

  /* =========================================================
       EVENT LISTENERS
       ========================================================= */

  zoomInButton?.addEventListener("click", zoomIn);

  zoomOutButton?.addEventListener("click", zoomOut);

  fitButton?.addEventListener("click", fitView);

  headerFitButton?.addEventListener("click", fitView);

  resetButton?.addEventListener("click", resetView);

  fullscreenButton?.addEventListener("click", toggleFullscreen);

  searchInput?.addEventListener("input", handleFiltersChanged);

  typeFilter?.addEventListener("change", handleFiltersChanged);

  locationFilter?.addEventListener("change", handleFiltersChanged);

  statusFilter?.addEventListener("change", handleFiltersChanged);

  layoutSelect?.addEventListener("change", handleLayoutChange);

  canvas.addEventListener("pointerdown", handleCanvasPointerDown);

  canvas.addEventListener("wheel", handleWheel, {
    passive: false,
  });

  window.addEventListener("pointermove", handlePointerMove);

  window.addEventListener("pointerup", handlePointerUp);

  window.addEventListener("keydown", handleKeyboard);

  window.addEventListener("resize", () => {
    render();
  });

  /* =========================================================
       INITIALIZE
       ========================================================= */

  createInitialPositions();

  /*
   * Set default layout.
   */

  state.currentLayout = layoutSelect?.value || "auto";

  /*
   * Render once first so that
   * node dimensions are available.
   */

  render();

  /*
   * Then fit the topology nicely
   * inside the viewport.
   */

  requestAnimationFrame(() => {
    applyLayout(state.currentLayout);

    requestAnimationFrame(() => {
      fitView();
    });
  });
})();
