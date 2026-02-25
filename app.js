const TOTAL = 50;

const frame = document.getElementById("slideFrame");
const counter = document.getElementById("counter");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
function pad2(n){ return String(n).padStart(2, "0"); }

function getSlideFromHash(){
  const raw = (location.hash || "").replace("#", "").trim();
  const n = parseInt(raw, 10);
  if (Number.isFinite(n)) return clamp(n, 1, TOTAL);
  return 1;
}

let current = getSlideFromHash();

function loadSlide(n){
  current = clamp(n, 1, TOTAL);
  frame.src = `slides/${pad2(current)}.html`;
  location.hash = String(current);

  // 🔑 Reprend le focus sur la page parent
  setTimeout(() => window.focus(), 0);
}

frame.addEventListener("load", () => window.focus());

function next(){ loadSlide(current + 1); }
function prev(){ loadSlide(current - 1); }


window.addEventListener("hashchange", () => {
  loadSlide(getSlideFromHash());
});

document.addEventListener("keydown", (e) => {
  console.log("key pressed:", e.key);
  if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
  if (e.key.toLowerCase() === "f") {
    e.preventDefault();
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
}, { capture: true });

loadSlide(current);
