const listEl = document.getElementById("post-list");
const tagFiltersEl = document.getElementById("tag-filters");
const introEl = document.getElementById("intro");
const detailEl = document.getElementById("post-detail");
const detailContentEl = document.getElementById("post-detail-content");
const backBtn = document.getElementById("back-btn");
const lightboxEl = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCloseBtn = document.getElementById("lightbox-close");

let posts = [];
let activeTag = null;

async function loadPosts() {
  try {
    const res = await fetch("posts.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    posts = await res.json();
    posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (err) {
    listEl.innerHTML = `<p class="empty-state">glob posts.json을 불러오지 못했습니다.<br />파일을 더블클릭해서 열었다면, 브라우저 보안 정책 때문에 목록을 불러올 수 없습니다.<br />터미널에서 <code>python -m http.server</code> 같은 간단한 로컬 서버로 열어주세요.</p>`;
    console.error(err);
    return;
  }
  renderTagFilters();
  route();
}

function allTags() {
  const set = new Set();
  posts.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
  return [...set];
}

function renderTagFilters() {
  const tags = allTags();
  if (tags.length === 0) {
    tagFiltersEl.innerHTML = "";
    return;
  }
  tagFiltersEl.innerHTML = "";
  const allChip = makeChip("전체", activeTag === null);
  allChip.addEventListener("click", () => {
    activeTag = null;
    renderTagFilters();
    renderList();
  });
  tagFiltersEl.appendChild(allChip);

  tags.forEach((tag) => {
    const chip = makeChip(tag, activeTag === tag);
    chip.addEventListener("click", () => {
      activeTag = tag;
      renderTagFilters();
      renderList();
    });
    tagFiltersEl.appendChild(chip);
  });
}

function makeChip(label, isActive) {
  const btn = document.createElement("button");
  btn.className = "tag-chip" + (isActive ? " active" : "");
  btn.textContent = label;
  return btn;
}

function getFilteredPosts() {
  if (!activeTag) return posts;
  return posts.filter((p) => (p.tags || []).includes(activeTag));
}

function renderList() {
  const filtered = getFilteredPosts();
  listEl.innerHTML = "";

  if (filtered.length === 0) {
    listEl.innerHTML = `<p class="empty-state">글이 없습니다.</p>`;
    return;
  }

  filtered.forEach((post) => {
    listEl.appendChild(buildCard(post));
  });
}

function buildCard(post) {
  const card = document.createElement("article");
  card.className = "post-card";
  card.addEventListener("click", () => {
    window.location.hash = `#/post/${post.id}`;
  });

  const thumbWrap = document.createElement("div");
  thumbWrap.className = "post-thumb";
  if (post.thumbnail) {
    const img = document.createElement("img");
    img.src = post.thumbnail;
    img.alt = post.title;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.addEventListener("error", () => {
      thumbWrap.innerHTML = "사진 준비중";
    });
    thumbWrap.appendChild(img);
  } else {
    thumbWrap.textContent = "사진 준비중";
  }

  const body = document.createElement("div");
  body.className = "post-card-body";

  const date = document.createElement("span");
  date.className = "post-date";
  date.textContent = formatDate(post.date);

  const title = document.createElement("h3");
  title.className = "post-title";
  title.textContent = post.title;

  const excerpt = document.createElement("p");
  excerpt.className = "post-excerpt";
  excerpt.textContent = post.excerpt || "";

  body.appendChild(date);
  body.appendChild(title);
  body.appendChild(excerpt);

  if ((post.tags || []).length) {
    const tagsEl = document.createElement("div");
    tagsEl.className = "post-tags";
    post.tags.forEach((t) => {
      const span = document.createElement("span");
      span.textContent = t;
      tagsEl.appendChild(span);
    });
    body.appendChild(tagsEl);
  }

  card.appendChild(thumbWrap);
  card.appendChild(body);
  return card;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function showList() {
  detailEl.classList.add("hidden");
  introEl.classList.remove("hidden");
  tagFiltersEl.classList.remove("hidden");
  listEl.classList.remove("hidden");
}

function showDetail(post) {
  introEl.classList.add("hidden");
  tagFiltersEl.classList.add("hidden");
  listEl.classList.add("hidden");
  detailEl.classList.remove("hidden");

  detailContentEl.innerHTML = "";

  const header = document.createElement("div");
  header.className = "post-detail-header";

  const title = document.createElement("h2");
  title.textContent = post.title;

  header.appendChild(title);

  const body = document.createElement("div");
  body.className = "post-detail-content";
  body.innerHTML = post.content || "";

  body.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    img.addEventListener("click", () => openLightbox(src));
    img.addEventListener("error", () => {
      const placeholder = document.createElement("div");
      placeholder.className = "img-placeholder";
      placeholder.textContent = "사진 준비중";
      img.replaceWith(placeholder);
    });
  });

  detailContentEl.appendChild(header);
  detailContentEl.appendChild(body);

  if ((post.images || []).length) {
    const gallery = document.createElement("div");
    gallery.className = "post-gallery";
    post.images.forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = post.title;
      img.addEventListener("click", () => openLightbox(src));
      img.addEventListener("error", () => {
        const placeholder = document.createElement("div");
        placeholder.className = "img-placeholder";
        placeholder.textContent = "사진 준비중";
        img.replaceWith(placeholder);
      });
      gallery.appendChild(img);
    });
    detailContentEl.appendChild(gallery);
  }

  window.scrollTo({ top: 0, behavior: "instant" });
}

function openLightbox(src) {
  lightboxImg.src = src;
  lightboxEl.classList.remove("hidden");
}

function closeLightbox() {
  lightboxEl.classList.add("hidden");
  lightboxImg.src = "";
}

function route() {
  const hash = window.location.hash;
  const match = hash.match(/^#\/post\/(.+)$/);
  if (match) {
    const post = posts.find((p) => p.id === match[1]);
    if (post) {
      showDetail(post);
      return;
    }
  }
  renderList();
  showList();
}

backBtn.addEventListener("click", () => {
  window.location.hash = "";
});

lightboxCloseBtn.addEventListener("click", closeLightbox);
lightboxEl.addEventListener("click", (e) => {
  if (e.target === lightboxEl) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

window.addEventListener("hashchange", route);

loadPosts();
