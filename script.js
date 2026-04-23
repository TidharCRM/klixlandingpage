const cards = Array.from(document.querySelectorAll(".tcard"));
const deck = document.getElementById("deck");
const dotsWrap = document.getElementById("dots");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

let idx = 0;
let autoplay;

function renderDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = `dot${i === idx ? " active" : ""}`;
    dot.type = "button";
    dot.setAttribute("aria-label", `מעבר להמלצה ${i + 1}`);
    dot.addEventListener("click", () => {
      setIndex(i);
      restartAutoplay();
    });
    dotsWrap.appendChild(dot);
  });
}

function setIndex(nextIndex) {
  if (!cards.length) return;
  idx = (nextIndex + cards.length) % cards.length;
  cards.forEach((card, i) => {
    card.classList.toggle("active", i === idx);
  });
  renderDots();
}

function restartAutoplay() {
  clearInterval(autoplay);
  autoplay = setInterval(() => setIndex(idx + 1), 6000);
}

next?.addEventListener("click", () => {
  setIndex(idx + 1);
  restartAutoplay();
});
prev?.addEventListener("click", () => {
  setIndex(idx - 1);
  restartAutoplay();
});

let touchStartX = 0;
let touchStartY = 0;

deck?.addEventListener(
  "touchstart",
  (ev) => {
    const t = ev.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  },
  { passive: true }
);

deck?.addEventListener(
  "touchend",
  (ev) => {
    const t = ev.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
      setIndex(dx < 0 ? idx + 1 : idx - 1);
      restartAutoplay();
    }
  },
  { passive: true }
);

if (cards.length) {
  setIndex(0);
  restartAutoplay();
}

const revealEls = document.querySelectorAll("[data-reveal]");
revealEls.forEach((el) => {
  const delay = parseInt(el.dataset.delay || "0", 10);
  el.style.setProperty("--reveal-delay", delay);
});

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-in"));
}

const nav = document.querySelector(".nav");
if (nav) {
  let lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (y > 20) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
      lastY = y;
    },
    { passive: true }
  );
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
