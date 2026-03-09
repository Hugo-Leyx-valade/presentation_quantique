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

  // optionnel : focus parent (pas suffisant seul)
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

// ✅ écoute au niveau parent
document.addEventListener("keydown", handleNavKeys, { capture: true });

// ✅ installe aussi l'écoute dans l’iframe à chaque chargement
function attachIframeKeyListener(){
  try {
    const doc = frame.contentDocument;
    if (!doc) return;

    // évite les doubles listeners si l’iframe recharge souvent
    doc.removeEventListener("keydown", handleNavKeys, true);
    doc.addEventListener("keydown", handleNavKeys, { capture: true });
  } catch (err) {
    // Si un jour l’iframe devient cross-origin, ça plantera ici.
    // Dans ce cas il faudrait postMessage.
    console.warn("Impossible d'attacher le keydown à l'iframe (cross-origin ?)", err);
  }
}

frame.addEventListener("load", () => {
  attachIframeKeyListener();
});

loadSlide(current);