import { setupThemeToggle } from "./theme.js";
import { loadSiteData, flattenUnits } from "./data-loader.js";

setupThemeToggle();

const state = {
  subjects: [],
  units: [],
  selectedSubject: "all",
  selectedLevel: "all",
  query: "",
  sort: "default"
};

const params = new URLSearchParams(location.search);
state.selectedSubject = params.get("subject") || "all";

const subjectFilters = document.querySelector("#subjectFilters");
const levelFilters = document.querySelector("#levelFilters");
const unitList = document.querySelector("#unitList");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const dialog = document.querySelector("#unitDialog");
const dialogContent = document.querySelector("#dialogContent");
const dialogClose = document.querySelector("#dialogClose");

const favorites = new Set(JSON.parse(localStorage.getItem("study-vault-favorites") || "[]"));

function saveFavorites() {
  localStorage.setItem("study-vault-favorites", JSON.stringify([...favorites]));
}

function makePill(label, value, active, onClick) {
  const button = document.createElement("button");
  button.className = `pill ${active ? "active" : ""}`;
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderFilters() {
  subjectFilters.innerHTML = "";
  subjectFilters.appendChild(makePill("전체", "all", state.selectedSubject === "all", () => {
    state.selectedSubject = "all";
    render();
  }));

  state.subjects.forEach((subject) => {
    subjectFilters.appendChild(makePill(subject.name, subject.id, state.selectedSubject === subject.id, () => {
      state.selectedSubject = subject.id;
      render();
    }));
  });

  const levels = [...new Map(state.subjects.flatMap(s => s.levels).map(level => [level.id, level])).values()];
  levelFilters.innerHTML = "";
  levelFilters.appendChild(makePill("전체", "all", state.selectedLevel === "all", () => {
    state.selectedLevel = "all";
    render();
  }));
  levels.forEach((level) => {
    levelFilters.appendChild(makePill(level.name, level.id, state.selectedLevel === level.id, () => {
      state.selectedLevel = level.id;
      render();
    }));
  });
}

function getFilteredUnits() {
  const query = state.query.trim().toLowerCase();
  let units = state.units.filter((unit) => {
    const matchesSubject = state.selectedSubject === "all" || unit.subjectId === state.selectedSubject;
    const matchesLevel = state.selectedLevel === "all" || unit.levelId === state.selectedLevel;
    const haystack = `${unit.title} ${unit.summary} ${unit.keywords.join(" ")} ${unit.subjectName} ${unit.groupName}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesSubject && matchesLevel && matchesQuery;
  });

  if (state.sort === "title") {
    units = units.sort((a, b) => a.title.localeCompare(b.title, "ko"));
  }
  if (state.sort === "subject") {
    units = units.sort((a, b) => a.subjectName.localeCompare(b.subjectName, "ko"));
  }
  return units;
}

function renderUnits(units) {
  resultCount.textContent = `${units.length}개의 단원을 찾았습니다.`;

  if (!units.length) {
    unitList.innerHTML = `<article class="unit-card"><h3>검색 결과 없음</h3><p>다른 키워드나 필터를 선택해보세요.</p></article>`;
    return;
  }

  unitList.innerHTML = units.map((unit) => {
    const starred = favorites.has(unit.id) ? "★" : "☆";
    return `
      <article class="unit-card">
        <div class="unit-meta">
          <span class="badge">${unit.subjectIcon} ${unit.subjectName}</span>
          <span class="badge">${unit.levelName}</span>
          <span class="badge">${unit.groupName}</span>
        </div>
        <h3>${unit.title}</h3>
        <p>${unit.summary}</p>
        <div class="badge-row">
          ${unit.keywords.map(keyword => `<span class="badge">#${keyword}</span>`).join("")}
        </div>
        <div class="unit-actions">
          <button class="btn primary" type="button" data-open="${unit.id}">자세히</button>
          <button class="bookmark-btn" type="button" data-bookmark="${unit.id}" aria-label="즐겨찾기">${starred}</button>
        </div>
      </article>
    `;
  }).join("");

  unitList.querySelectorAll("[data-open]").forEach((button) => {
    button.addEventListener("click", () => openUnit(button.dataset.open));
  });

  unitList.querySelectorAll("[data-bookmark]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.bookmark;
      favorites.has(id) ? favorites.delete(id) : favorites.add(id);
      saveFavorites();
      render();
    });
  });
}

function openUnit(id) {
  const unit = state.units.find((item) => item.id === id);
  if (!unit) return;

  dialogContent.innerHTML = `
    <p class="eyebrow">${unit.subjectName} · ${unit.groupName}</p>
    <h2>${unit.title}</h2>
    <p class="lead">${unit.summary}</p>
    <h3>핵심 개념</h3>
    <ul>
      ${unit.concepts.map(concept => `<li>${concept}</li>`).join("")}
    </ul>
    <h3>개념 이해 문제</h3>
    <ol class="question-list">
      ${unit.questions.map((question) => `<li><strong>Q.</strong> ${question}</li>`).join("")}
    </ol>
  `;
  dialog.showModal();
}

function render() {
  renderFilters();
  renderUnits(getFilteredUnits());
}

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  render();
});

dialogClose.addEventListener("click", () => dialog.close());

loadSiteData("..").then(({ subjects }) => {
  state.subjects = subjects;
  state.units = flattenUnits(subjects);
  render();
}).catch((error) => {
  unitList.innerHTML = `<article class="unit-card"><h3>오류</h3><p>${error.message}</p></article>`;
});
