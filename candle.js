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
  const baseY = 100;

  // 🔥 Flame height depends ONLY on stability (as before)
  const flameHeight = 40 + (stability / 100) * 40;

  // Gentle flicker
  const flicker = Math.sin(time) * 6;

  ctx.beginPath();
  ctx.moveTo(cx, baseY);

  ctx.quadraticCurveTo(
    cx - 15 + flicker,
    baseY - flameHeight / 2,
    cx,
    baseY - flameHeight
  );

  ctx.quadraticCurveTo(
    cx + 15 - flicker,
    baseY - flameHeight / 2,
    cx,
    baseY
  );

  // 🔥 Solid original color (no brightness change)
  ctx.fillStyle = "#ffb347";
  ctx.fill();

  time += 0.1;
  requestAnimationFrame(drawFlame);
}

drawFlame();
