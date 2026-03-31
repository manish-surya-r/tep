import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

const state = {
  newsletter: null,
  selectedCategory: null,
};

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

function renderCourses(courses) {
  const target = document.getElementById("course-grid");
  target.innerHTML = "";
  courses.forEach((course) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img class="course-image" src="${course.image}" alt="${course.title}" />
      <h3>${course.title}</h3>
      <p>${course.description}</p>
      <p class="meta">Time to complete: ${course.duration}</p>
    `;
    target.append(card);
  });
}

function renderNewsletterCategories() {
  const target = document.getElementById("newsletter-categories");
  target.innerHTML = "";

  state.newsletter.categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `chip ${state.selectedCategory === category.id ? "active" : ""}`;
    button.textContent = category.name;
    button.addEventListener("click", () => {
      state.selectedCategory = category.id;
      renderNewsletterCategories();
      renderNewsletterList();
    });
    target.append(button);
  });
}

function renderNewsletterList() {
  const target = document.getElementById("newsletter-list");
  const articleTarget = document.getElementById("newsletter-article");
  target.innerHTML = "";
  articleTarget.classList.add("hidden");

  const articles = state.newsletter.articles.filter(
    (item) => item.category === state.selectedCategory,
  );

  articles.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <p class="meta">${item.date}</p>
      <button>Read article</button>
    `;
    card.querySelector("button").addEventListener("click", async () => {
      const markdown = await loadMarkdown(item.file);
      articleTarget.innerHTML = marked.parse(markdown);
      articleTarget.classList.remove("hidden");
      articleTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    target.append(card);
  });
}

function renderAdvancements(list) {
  const target = document.getElementById("advancements-list");
  const articleTarget = document.getElementById("advancements-article");
  target.innerHTML = "";

  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <p class="meta">${item.date}</p>
      <button>Read explainer</button>
    `;

    card.querySelector("button").addEventListener("click", async () => {
      const markdown = await loadMarkdown(item.file);
      articleTarget.innerHTML = marked.parse(markdown);
      articleTarget.classList.remove("hidden");
      articleTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    target.append(card);
  });
}

function initHeroScene() {
  const mount = document.getElementById("hero-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    mount.clientWidth / mount.clientHeight,
    0.1,
    1000,
  );
  camera.position.z = 26;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.append(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x1d6f86,
    transparent: true,
    opacity: 0.55,
  });

  const points = [];
  const total = 220;
  for (let i = 0; i < total; i += 1) {
    const t = (i / total) * Math.PI * 18;
    const r = 2 + 7 * Math.sin(i * 0.33);
    points.push(new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), (i - total / 2) * 0.055));
  }

  for (let i = 0; i < points.length - 1; i += 1) {
    const geom = new THREE.BufferGeometry().setFromPoints([points[i], points[i + 1]]);
    group.add(new THREE.Line(geom, lineMaterial));
  }

  const nodeGeometry = new THREE.SphereGeometry(0.14, 12, 12);
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x7cc5c2 });

  points.filter((_, idx) => idx % 15 === 0).forEach((pt) => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.copy(pt);
    group.add(node);
  });

  const animate = () => {
    group.rotation.z += 0.0017;
    group.rotation.x = 0.28 + Math.sin(Date.now() * 0.00045) * 0.06;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  });
}

async function init() {
  document.getElementById("year").textContent = new Date().getFullYear();

  const [newsletter, courses, advancements] = await Promise.all([
    loadJSON("content/newsletter/newsletter.json"),
    loadJSON("content/courses/courses.json"),
    loadJSON("content/advancements/advancements.json"),
  ]);

  state.newsletter = newsletter;
  state.selectedCategory = newsletter.categories[0]?.id;

  renderNewsletterCategories();
  renderNewsletterList();
  renderCourses(courses);
  renderAdvancements(advancements);
  initHeroScene();
}

init().catch((err) => {
  console.error(err);
});
