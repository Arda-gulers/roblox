(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const head = $(".site-head");
  if (head) {
    const onScroll = () => head.classList.toggle("stuck", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));
  setTimeout(() => $$(".reveal").forEach((el) => el.classList.add("in")), 2400);

  const yr = $("#yr");
  if (yr) yr.textContent = String(new Date().getFullYear());

  const frames = $$(".frame");
  if (!frames.length) return;

  const lb = document.createElement("div");
  lb.className = "lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.innerHTML =
    '<button class="x" type="button" aria-label="关闭">×</button>' +
    '<button class="arr prev" type="button" aria-label="上一张">‹</button>' +
    '<img alt="">' +
    '<button class="arr next" type="button" aria-label="下一张">›</button>' +
    '<p class="cap"></p>';
  document.body.appendChild(lb);

  const img = $("img", lb);
  const cap = $(".cap", lb);
  let idx = 0;

  const items = frames.map((fig) => {
    const pic = $("img", fig);
    return {
      src: fig.dataset.full || pic.src,
      alt: pic.alt || "",
      caption: ($("figcaption", fig) || {}).textContent || pic.alt || "",
    };
  });

  function show(i) {
    idx = (i + items.length) % items.length;
    const it = items[idx];
    img.src = it.src;
    img.alt = it.alt;
    cap.textContent = it.caption;
  }
  function open(i) {
    show(i);
    lb.classList.add("open");
    $(".x", lb).focus();
    document.documentElement.style.overflow = "hidden";
  }
  function close() {
    lb.classList.remove("open");
    document.documentElement.style.overflow = "";
  }

  frames.forEach((fig, i) => {
    fig.addEventListener("click", () => open(i));
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(i);
      }
    });
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
  });

  $(".x", lb).addEventListener("click", close);
  $(".prev", lb).addEventListener("click", () => show(idx - 1));
  $(".next", lb).addEventListener("click", () => show(idx + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) close();
  });
  window.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
})();
