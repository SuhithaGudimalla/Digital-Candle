const canvas = document.getElementById("flame");
const ctx = canvas.getContext("2d");

let time = 0;
let stability = 100;

// Receive stability updates
window.addEventListener("message", (event) => {
  if (event.data.type === "CANDLE_UPDATE") {
    stability = event.data.stability;
  }
});

function drawFlame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const baseY = canvas.height - 20;

  // Flame height depends ONLY on stability
  const flameHeight = 45 + (stability / 100) * 45;

  const flicker = Math.sin(time) * 4;

/* -------- SMALL, ROUND, SUBTLE GLOW -------- */
if (stability > 65) {
  const glowStrength = (stability - 65) / 35; // 0 → 1

  const glowRadius = 25 + glowStrength * 25;

  const glowY = baseY - flameHeight * 0.75; // 🔥 moved glow DOWN

  const gradient = ctx.createRadialGradient(
    cx,
    glowY,
    5,
    cx,
    glowY,
    glowRadius
  );

  gradient.addColorStop(
    0,
    `rgba(255, 240, 180, ${0.25 + glowStrength * 0.25})`
  );
  gradient.addColorStop(1, "rgba(255, 240, 180, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, glowY, glowRadius, 0, Math.PI * 2);
  ctx.fill();
}

  /* -------- FLAME -------- */
  ctx.beginPath();
  ctx.moveTo(cx, baseY);

  ctx.quadraticCurveTo(
    cx - 14 + flicker,
    baseY - flameHeight / 2,
    cx,
    baseY - flameHeight
  );

  ctx.quadraticCurveTo(
    cx + 14 - flicker,
    baseY - flameHeight / 2,
    cx,
    baseY
  );

  ctx.fillStyle = "#ffb347";
  ctx.fill();

  time += 0.08;
  requestAnimationFrame(drawFlame);
}

drawFlame();
