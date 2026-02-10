const canvas = document.getElementById("flame");
const ctx = canvas.getContext("2d");

let time = 0;

function drawFlame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const baseY = 100;

  // Flame parameters (will later be controlled by behavior)
  const flameHeight = 60;
  const flicker = Math.sin(time) * 6;

  ctx.beginPath();
  ctx.moveTo(centerX, baseY);

  ctx.quadraticCurveTo(
    centerX - 15 + flicker,
    baseY - flameHeight / 2,
    centerX,
    baseY - flameHeight
  );

  ctx.quadraticCurveTo(
    centerX + 15 - flicker,
    baseY - flameHeight / 2,
    centerX,
    baseY
  );

  ctx.fillStyle = "rgba(255, 170, 60, 0.9)";
  ctx.fill();

  time += 0.1;
  requestAnimationFrame(drawFlame);
}

drawFlame();
