import { setupThemeToggle } from "./theme.js";
import { loadJSON } from "./data-loader.js";

setupThemeToggle();

const grid = document.querySelector("#resourceGrid");

loadJSON("../data/common/resources.json").then((resources) => {
  grid.innerHTML = resources.map((item) => `
    <article class="resource-card">
      <span class="badge">${item.type}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="badge-row">
        ${item.tags.map(tag => `<span class="badge">#${tag}</span>`).join("")}
      </div>
    </article>
  `).join("");
});
