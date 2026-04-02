async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.json();
}

async function loadMarkdown(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.text();
}

function getQuery() {
  const params = new URLSearchParams(window.location.search);
  return { id: params.get("id") };
}

async function init() {
  const query = getQuery();
  const data = await loadJSON("content/articles/articles.json");
  const list = data.articles.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  const nav = document.getElementById("article-nav");
  const content = document.getElementById("article-content");
  const currentId = query.id || list[0]?.id;

  async function openArticle(id) {
    const selected = list.find((item) => item.id === id) || list[0];
    if (!selected) {
      content.innerHTML = "<p>No article found.</p>";
      return;
    }

    history.replaceState({}, "", `article.html?id=${encodeURIComponent(selected.id)}`);
    const markdown = await loadMarkdown(selected.file);
    content.innerHTML = marked.parse(markdown);

    [...nav.querySelectorAll("button")].forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.id === selected.id);
    });
  }

  list.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.id = item.id;
    button.textContent = item.title;
    button.addEventListener("click", () => openArticle(item.id));
    nav.append(button);
  });

  openArticle(currentId);
}

init().catch((error) => {
  const content = document.getElementById("article-content");
  if (content) content.innerHTML = `<p>Unable to load content. ${error.message}</p>`;
});
