const TOTAL = 34;

const frame = document.getElementById("slideFrame");
const progressBar = document.getElementById("progressBar");

function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
function pad2(n){ return String(n).padStart(2, "0"); }

function getSlideFromHash(){
  const raw = (location.hash || "").replace("#", "").trim();
  const n = parseInt(raw, 10);
  if (Number.isFinite(n)) return clamp(n, 1, TOTAL);
  return 1;
}

let current = getSlideFromHash();

// Responsive scaling: fit the 1910×1070 frame into the viewport
const SLIDE_W = 1910;
const SLIDE_H = 1070;

function applyScale(){
  const scaleX = window.innerWidth  / SLIDE_W;
  const scaleY = window.innerHeight / SLIDE_H;
  const scale  = Math.min(scaleX, scaleY);
  frame.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", applyScale);

function updateProgress(){
  const pct = ((current - 1) / (TOTAL - 1)) * 100;
  progressBar.style.width = pct + "%";
}

function loadSlide(n){
  current = clamp(n, 1, TOTAL);
  frame.src = `slides/${pad2(current)}.html`;
  location.hash = String(current);
  updateProgress();
  setTimeout(() => window.focus(), 0);
}

function next(){ loadSlide(current + 1); }
function prev(){ loadSlide(current - 1); }

window.addEventListener("hashchange", () => {
  loadSlide(getSlideFromHash());
});

function handleNavKeys(e){
  const t = e.target;
  const tag = t && t.tagName ? t.tagName.toLowerCase() : "";
  const isTyping =
    tag === "input" || tag === "textarea" || tag === "select" || (t && t.isContentEditable);

  if (isTyping) return;

  if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
  if (e.key && e.key.toLowerCase() === "f") {
    e.preventDefault();
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
}

document.addEventListener("keydown", handleNavKeys, { capture: true });

function attachIframeKeyListener(){
  try {
    const doc = frame.contentDocument;
    if (!doc) return;
    doc.removeEventListener("keydown", handleNavKeys, true);
    doc.addEventListener("keydown", handleNavKeys, { capture: true });
  } catch (err) {
    console.warn("Impossible d’attacher le keydown à l’iframe (cross-origin ?)", err);
  }
}

frame.addEventListener("load", () => {
  attachIframeKeyListener();
});

applyScale();
loadSlide(current);