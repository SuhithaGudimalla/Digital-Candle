(function () {
  // Prevent duplicate injection
  if (document.getElementById("digital-candle")) return;

  // Inject CSS
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("candle.css");
  document.head.appendChild(link);

  // Inject candle HTML
  const container = document.createElement("div");
  container.innerHTML = `
    <div id="digital-candle">
      <canvas id="flame" width="80" height="120"></canvas>
      <div id="candle-body"></div>
    </div>
  `;
  document.body.appendChild(container);

  // Inject candle JS
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("candle.js");
  document.body.appendChild(script);
})();

// --- Interaction capture (STEP 3) ---
let lastKeyTime = null;
let keyEvents = [];

document.addEventListener("keydown", (e) => {
  const now = Date.now();

  if (lastKeyTime !== null) {
    keyEvents.push({
      interval: now - lastKeyTime,
      isBackspace: e.key === "Backspace"
    });
  }

  lastKeyTime = now;
});

function extractFeatures(events, windowDurationMs) {
  const totalKeys = events.length;
  const typingSpeed = totalKeys / (windowDurationMs / 1000);

  let sumIntervals = 0;
  let backspaces = 0;

  for (let e of events) {
    sumIntervals += e.interval;
    if (e.isBackspace) backspaces++;
  }

  const avgPause = sumIntervals / totalKeys;

  // Variance calculation
  let varianceSum = 0;
  for (let e of events) {
    varianceSum += Math.pow(e.interval - avgPause, 2);
  }
  const pauseVariance = varianceSum / totalKeys;

  const correctionRate = backspaces / totalKeys;

  return {
    typingSpeed,
    avgPause,
    pauseVariance,
    correctionRate
  };
}

function computeStabilityScore(features) {
  let score = 100;

  // Penalize high pause variance (instability)
  score -= Math.min(features.pauseVariance / 5000, 40);

  // Penalize high correction rate
  score -= features.correctionRate * 30;

  // Penalize extremely slow typing
  if (features.typingSpeed < 1) {
    score -= 15;
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return score;
}


setInterval(() => {
  if (keyEvents.length === 0) return;

  const features = extractFeatures(keyEvents, 10000);
  const stabilityScore = computeStabilityScore(features);

  console.log("Stability score:", stabilityScore);

  // Reset window
  keyEvents = [];
}, 10000);

