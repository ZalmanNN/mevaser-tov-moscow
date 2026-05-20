const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const tabs = document.querySelectorAll(".topic-tab");
const searchInput = document.querySelector("#searchInput");
const newsItems = document.querySelectorAll(".news-item");
const nextCandle = document.querySelector("#nextCandle");
const candleList = document.querySelector("#candleList");
const torahReading = document.querySelector("#torahReading");
const calendarLocation = document.querySelector("#calendarLocation");

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

function formatMoscowDate(isoDate) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow"
  }).format(new Date(isoDate));
}

function localizeTorahReference(text) {
  return text
    .replaceAll("Exodus", "Исход")
    .replaceAll("Numbers", "Числа")
    .replaceAll("Deuteronomy", "Дварим")
    .replaceAll("Ruth", "Рут")
    .replaceAll("Ezekiel", "Иезекииль")
    .replaceAll("Habakkuk", "Хавакук");
}

async function updateJewishCalendar() {
  if (!nextCandle || !candleList || !torahReading) {
    return;
  }

  try {
    const response = await fetch("https://www.hebcal.com/shabbat?cfg=json&geo=city&city=RU-Moscow&m=50&lg=ru");
    if (!response.ok) {
      throw new Error("Hebcal request failed");
    }

    const data = await response.json();
    const timeItems = data.items.filter((item) => item.category === "candles" || item.category === "havdalah");
    const torahItems = data.items.filter((item) => item.leyning?.torah);

    if (calendarLocation && data.location?.title) {
      calendarLocation.textContent = "Москва";
    }

    const firstCandle = timeItems.find((item) => item.category === "candles");
    if (firstCandle) {
      nextCandle.textContent = formatMoscowDate(firstCandle.date);
    }

    if (timeItems.length) {
      candleList.innerHTML = timeItems.slice(0, 3).map((item) => {
        const label = item.memo || item.title.replace(/:.+$/, "");
        return `<div><dt>${label}</dt><dd>${formatMoscowDate(item.date)}</dd></div>`;
      }).join("");
    }

    if (torahItems.length) {
      torahReading.textContent = torahItems.slice(0, 2).map((item) => {
        const torah = localizeTorahReference(item.leyning.torah);
        return `${item.title}: ${torah}`;
      }).join(". ");
    }
  } catch (error) {
    console.warn("Calendar fallback is shown", error);
  }
}

updateJewishCalendar();
