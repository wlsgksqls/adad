import { setupThemeToggle } from "./theme.js";
import { loadSiteData } from "./data-loader.js";

setupThemeToggle();

const grid = document.querySelector("#subjectGrid");

loadSiteData(".").then(({ subjects }) => {
  grid.innerHTML = subjects.map((subject) => {
    const levelNames = subject.levels.map((level) => `<span class="badge">${level.name}</span>`).join("");
    return `
      <a class="subject-card" href="./pages/explorer.html?subject=${subject.id}"
         style="--card-a:${subject.colors[0]}; --card-b:${subject.colors[1]}">
        <div class="subject-icon">${subject.icon}</div>
        <h3>${subject.name}</h3>
        <p>${subject.description}</p>
        <div class="badge-row">${levelNames}</div>
      </a>
    `;
  }).join("");
}).catch((error) => {
  grid.innerHTML = `<p>데이터를 불러오지 못했습니다: ${error.message}</p>`;
});
