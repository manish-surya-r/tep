import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.163.0/build/three.module.js";

const state = {
  articlesData: null,
  currentCategory: "all",
  visibleCount: 6,
};

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Could not load ${path}`);
  return res.json();
}

function byRecent(a, b) {
  return new Date(b.date) - new Date(a.date);
}

function getFilteredArticles() {
  const list = [...state.articlesData.articles].sort(byRecent);
  if (state.currentCategory === "all") return list;
  return list.filter((item) => item.category === state.currentCategory);
}

function renderArticleCategories() {
  const target = document.getElementById("article-categories");
  target.innerHTML = "";
  state.articlesData.categories.forEach((category) => {
    const button = document.createElement("button");
    button.className = `chip ${state.currentCategory === category.id ? "active" : ""}`;
    button.textContent = category.name;
    button.addEventListener("click", () => {
      state.currentCategory = category.id;
      state.visibleCount = 6;
      renderArticleCategories();
      renderArticleList();
    });
    target.append(button);
  });
}

function renderArticleList() {
  const target = document.getElementById("article-list");
  const moreBtn = document.getElementById("article-more");
  target.innerHTML = "";

  const filtered = getFilteredArticles();
  const visible = filtered.slice(0, state.visibleCount);

  visible.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <p class="meta">${item.date}</p>
      <button>Read article</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      const url = `article.html?type=articles&id=${encodeURIComponent(item.id)}`;
      window.open(url, "_blank", "noopener");
    });
    target.append(card);
  });

  if (filtered.length > state.visibleCount) {
    moreBtn.classList.remove("hidden");
  } else {
    moreBtn.classList.add("hidden");
  }

  moreBtn.onclick = () => {
    state.visibleCount += 6;
    renderArticleList();
  };
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

function renderNeuroscience(list) {
  const target = document.getElementById("neuro-list");
  target.innerHTML = "";

  [...list].sort(byRecent).forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <p class="meta">${item.date}</p>
      <button>Read update</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      const url = `article.html?type=neuroscience&id=${encodeURIComponent(item.id)}`;
      window.open(url, "_blank", "noopener");
    });
    target.append(card);
  });
}

function renderVideos(videosData) {
  const target = document.getElementById("video-grid");
  const underDev = document.getElementById("videos-under-dev");
  target.innerHTML = "";

  if (!videosData.videos.length) {
    underDev.classList.remove("hidden");
    return;
  }

  underDev.classList.add("hidden");
  videosData.videos.forEach((video) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${video.title}</h3>
      <p>${video.description}</p>
      <a class="visit-link" href="${video.url}" target="_blank" rel="noopener">Watch</a>
    `;
    target.append(card);
  });
}

function initHeroScene() {
  const mount = document.getElementById("hero-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  mount.append(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1b6e85, transparent: true, opacity: 0.52 });
  const points = [];
  const total = 260;
  for (let i = 0; i < total; i += 1) {
    const t = (i / total) * Math.PI * 20;
    const r = 2 + 6.8 * Math.sin(i * 0.31);
    points.push(new THREE.Vector3(r * Math.cos(t), r * Math.sin(t), (i - total / 2) * 0.05));
  }

  for (let i = 0; i < points.length - 1; i += 1) {
    const geom = new THREE.BufferGeometry().setFromPoints([points[i], points[i + 1]]);
    group.add(new THREE.Line(geom, lineMaterial));
  }

  const nodeGeometry = new THREE.SphereGeometry(0.14, 12, 12);
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x77c3c1 });
  points.filter((_, idx) => idx % 13 === 0).forEach((point) => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.copy(point);
    group.add(node);
  });

  const animate = () => {
    group.rotation.z += 0.0016;
    group.rotation.x = 0.23 + Math.sin(Date.now() * 0.0005) * 0.07;
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

  const [articlesData, courses, neuroscience, videos] = await Promise.all([
    loadJSON("content/articles/articles.json"),
    loadJSON("content/courses/courses.json"),
    loadJSON("content/advancements/advancements.json"),
    loadJSON("content/videos/videos.json"),
  ]);

  state.articlesData = articlesData;
  renderArticleCategories();
  renderArticleList();
  renderCourses(courses);
  renderNeuroscience(neuroscience);
  renderVideos(videos);
  initHeroScene();
}

init().catch((error) => console.error(error));
