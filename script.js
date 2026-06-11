/* ============================================================
   Happy Birthday • interaksi
   Atur nama & isi di sini lalu simpan.
   ============================================================ */
const CONFIG = {
  nameTarget: "Rayshiel", // nama yang berulang tahun
  nameFrom: "~Emiw~",     // dari kamu
};

/* terapkan config ke teks */
document.getElementById("nameTarget").textContent = CONFIG.nameTarget;
document.getElementById("nameFrom").textContent = CONFIG.nameFrom;

/* ---------- Buka "open me" ---------- */
const cover = document.getElementById("cover");
const story = document.getElementById("story");
const openBtn = document.getElementById("openBtn");
const bgm = document.getElementById("bgm");
const musicToggle = document.getElementById("musicToggle");

document.body.style.overflow = "hidden";

openBtn.addEventListener("click", () => {
  cover.classList.add("hide");
  story.classList.add("show");
  document.body.style.overflow = "auto";
  heartBurst(40);
  tryPlayMusic();
});

/* ---------- Musik latar ---------- */
let musicWanted = false;

function tryPlayMusic() {
  musicWanted = true;
  bgm.volume = 0.45;
  bgm.play()
    .then(() => musicToggle.classList.add("playing"))
    .catch(() => { /* file belum ada / diblok browser */ });
}

musicToggle.addEventListener("click", () => {
  if (!bgm.paused) {
    bgm.pause();
    musicToggle.classList.remove("playing");
  } else {
    bgm.play()
      .then(() => musicToggle.classList.add("playing"))
      .catch(() => {});
  }
});

/* ---------- Reveal tiap scene saat di-scroll ---------- */
const scenes = document.querySelectorAll(".scene");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("in");
    });
  },
  { threshold: 0.3 }
);
scenes.forEach((s) => revealObserver.observe(s));

/* ---------- Dot nav aktif ---------- */
const dots = document.querySelectorAll(".dots .dot");
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.id;
        dots.forEach((d) =>
          d.classList.toggle("active", d.getAttribute("href") === "#" + id)
        );
        // confetti hati kecil saat sampai surat
        if (id === "scene-letter") heartBurst(30);
      }
    });
  },
  { threshold: 0.55 }
);
scenes.forEach((s) => navObserver.observe(s));

/* ---------- Hujan hati (canvas) ---------- */
let canvas, ctx, hearts = [], rafId;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.id = "fxCanvas";
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
}
function resize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const HEART_COLORS = ["#e7a9b4", "#d98a98", "#f4e7df", "#c77f8e", "#e9c46a"];

function heartBurst(count) {
  ensureCanvas();
  for (let i = 0; i < count; i++) {
    hearts.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      size: 8 + Math.random() * 12,
      color: HEART_COLORS[(Math.random() * HEART_COLORS.length) | 0],
      vx: -1 + Math.random() * 2,
      vy: 1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI,
      vr: -0.05 + Math.random() * 0.1,
      alpha: 1,
    });
  }
  if (!rafId) animate();
}

function drawHeart(x, y, size, rot, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  const s = size / 16;
  ctx.moveTo(0, 4 * s);
  ctx.bezierCurveTo(0, 1 * s, -4 * s, -3 * s, -8 * s, 1 * s);
  ctx.bezierCurveTo(-12 * s, 5 * s, -4 * s, 11 * s, 0, 14 * s);
  ctx.bezierCurveTo(4 * s, 11 * s, 12 * s, 5 * s, 8 * s, 1 * s);
  ctx.bezierCurveTo(4 * s, -3 * s, 0, 1 * s, 0, 4 * s);
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach((h) => {
    h.x += h.vx;
    h.y += h.vy;
    h.rot += h.vr;
    if (h.y > canvas.height * 0.7) h.alpha -= 0.02;
    drawHeart(h.x, h.y, h.size, h.rot, h.color, Math.max(0, h.alpha));
  });
  hearts = hearts.filter((h) => h.alpha > 0 && h.y < canvas.height + 40);
  if (hearts.length) {
    rafId = requestAnimationFrame(animate);
  } else {
    cancelAnimationFrame(rafId);
    rafId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
