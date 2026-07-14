const CATALOG_URL = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "https://registry.libreagents.com/v1/appcards/index.json"
  : "/v1/appcards/index.json";
const PAGE_SIZE = 24;
const TYPE_ORDER = ["all", "agent", "skill", "workflow", "mcp"];

const state = {
  entries: [],
  activeType: "all",
  query: "",
  visible: PAGE_SIZE,
};

const elements = {
  grid: document.querySelector("#catalog-grid"),
  empty: document.querySelector("#empty-state"),
  filters: document.querySelector("#filters"),
  search: document.querySelector("#search"),
  meta: document.querySelector("#catalog-meta"),
  loadMore: document.querySelector("#load-more"),
  totalCount: document.querySelector("#total-count"),
  agentCount: document.querySelector("#agent-count"),
  skillCount: document.querySelector("#skill-count"),
  copyEndpoint: document.querySelector("#copy-endpoint"),
};

function typeLabel(type) {
  return type === "mcp" ? "MCP" : `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
}

function filteredEntries() {
  const query = state.query.toLowerCase();
  return state.entries.filter((entry) => {
    if (state.activeType !== "all" && entry.type !== state.activeType) return false;
    if (!query) return true;
    const haystack = [
      entry.name,
      entry.description,
      entry.author,
      entry.category,
      ...(entry.tags || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createCard(entry) {
  const card = createElement("article", "registry-card");
  const top = createElement("div", "card-top");
  top.append(
    createElement("div", "type-icon", entry.type === "workflow" ? "WF" : entry.type.slice(0, 2)),
    createElement("span", "license-badge", entry.license),
  );

  const title = createElement("h3", "", entry.name);
  const author = createElement("p", "card-author", entry.author || "LibreAgents Registry");
  const description = createElement("p", "card-description", entry.description || "Portable LibreAgents registry entry.");
  const tags = createElement("div", "card-tags");
  (entry.tags || []).slice(0, 3).forEach((tag) => tags.append(createElement("span", "", tag)));

  const footer = createElement("div", "card-footer");
  footer.append(createElement("span", "mode-badge", entry.runtimeMode || "dual"));
  const source = createElement("a", "source-link", "View source ↗");
  source.href = `https://github.com/LibreAgent/registry/tree/main/${entry.path}`;
  source.target = "_blank";
  source.rel = "noreferrer";
  source.setAttribute("aria-label", `View source for ${entry.name}`);
  footer.append(source);

  card.append(top, title, author, description, tags, footer);
  return card;
}

function renderFilters() {
  const counts = state.entries.reduce((result, entry) => {
    result[entry.type] = (result[entry.type] || 0) + 1;
    return result;
  }, { all: state.entries.length });

  elements.filters.replaceChildren();
  TYPE_ORDER.forEach((type) => {
    const button = createElement("button", "filter-tab");
    button.type = "button";
    button.dataset.type = type;
    button.setAttribute("aria-pressed", String(type === state.activeType));
    button.append(document.createTextNode(typeLabel(type)), createElement("span", "", counts[type] || 0));
    elements.filters.append(button);
  });
}

function renderCatalog() {
  const entries = filteredEntries();
  const visible = entries.slice(0, state.visible);
  elements.grid.replaceChildren(...visible.map(createCard));
  elements.grid.setAttribute("aria-busy", "false");
  elements.empty.hidden = entries.length > 0;
  elements.grid.hidden = entries.length === 0;
  elements.loadMore.hidden = visible.length >= entries.length;
  elements.meta.textContent = `${entries.length.toLocaleString()} ${entries.length === 1 ? "entry" : "entries"} shown`;
}

function handleFilter(event) {
  const button = event.target.closest("button[data-type]");
  if (!button) return;
  state.activeType = button.dataset.type;
  state.visible = PAGE_SIZE;
  renderFilters();
  renderCatalog();
}

async function loadCatalog() {
  try {
    const response = await fetch(CATALOG_URL, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Catalog returned HTTP ${response.status}`);
    const catalog = await response.json();
    if (!Array.isArray(catalog.entries)) throw new Error("Catalog entries are unavailable");
    state.entries = catalog.entries;
    elements.totalCount.textContent = catalog.count.toLocaleString();
    elements.agentCount.textContent = state.entries.filter((entry) => entry.type === "agent").length.toLocaleString();
    elements.skillCount.textContent = state.entries.filter((entry) => entry.type === "skill").length.toLocaleString();
    elements.meta.textContent = `Updated ${new Date(catalog.generated).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
    renderFilters();
    renderCatalog();
  } catch (error) {
    elements.grid.hidden = true;
    elements.empty.hidden = false;
    elements.empty.querySelector("h3").textContent = "Registry temporarily unavailable";
    elements.empty.querySelector("p").textContent = error instanceof Error ? error.message : "Please try again shortly.";
    elements.meta.textContent = "Unable to load catalog";
  }
}

elements.search.addEventListener("input", (event) => {
  state.query = event.target.value.trim();
  state.visible = PAGE_SIZE;
  renderCatalog();
});
elements.filters.addEventListener("click", handleFilter);
elements.loadMore.addEventListener("click", () => {
  state.visible += PAGE_SIZE;
  renderCatalog();
});
elements.copyEndpoint.addEventListener("click", async () => {
  const endpoint = `${window.location.origin}${CATALOG_URL}`;
  try {
    await navigator.clipboard.writeText(endpoint);
    elements.copyEndpoint.textContent = "Copied";
    window.setTimeout(() => { elements.copyEndpoint.textContent = "Copy URL"; }, 1600);
  } catch {
    window.prompt("Copy the catalog endpoint", endpoint);
  }
});

loadCatalog();
