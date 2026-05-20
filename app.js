const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const tabs = document.querySelectorAll(".topic-tab");
const searchInput = document.querySelector("#searchInput");
const newsItems = document.querySelectorAll(".news-item");

let activeFilter = "all";

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();

  newsItems.forEach((item) => {
    const categoryMatch = activeFilter === "all" || item.dataset.category === activeFilter;
    const textMatch = !query || item.dataset.text.toLowerCase().includes(query) || item.textContent.toLowerCase().includes(query);
    item.classList.toggle("is-hidden", !(categoryMatch && textMatch));
  });
}

menuButton.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    activeFilter = tab.dataset.filter;
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);
