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


// -------- STEP 3: Interaction Capture --------
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


// -------- STEP 4: Feature Extraction --------
function extractFeatures(events, windowMs) {
  const total = events.length;
  const typingSpeed = total / (windowMs / 1000);

  let sumIntervals = 0;
  let backspaces = 0;

  for (let e of events) {
    sumIntervals += e.interval;
    if (e.isBackspace) backspaces++;
  }

  const avgPause = sumIntervals / total;

  let varianceSum = 0;
  for (let e of events) {
    varianceSum += Math.pow(e.interval - avgPause, 2);
  }

  return {
    typingSpeed,
    pauseVariance: varianceSum / total,
    correctionRate: backspaces / total
  };
}


// -------- STEP 5: Stability Score --------
function computeStabilityScore(features) {
  let score = 100;

  // Existing penalties
  score -= Math.min(features.pauseVariance / 5000, 40);
  score -= features.correctionRate * 30;

  // 🔥 NEW: speed sensitivity (small & safe)
  if (features.typingSpeed > 4) {
    // Fast typing → slight instability
    score -= (features.typingSpeed - 4) * 5;
  }

  if (features.typingSpeed < 2) {
    // Calm / slow typing → slightly more stability
    score += (2 - features.typingSpeed) * 5;
  }

  return Math.max(0, Math.min(100, score));
}



// -------- STEP 5.5: Correction Bursts --------
function detectCorrectionBursts(events) {
  let bursts = 0;
  let consecutive = 0;

  for (let e of events) {
    if (e.isBackspace && e.interval < 800) {
      consecutive++;
      if (consecutive >= 2) {
        bursts++;
        consecutive = 0;
      }
    } else {
      consecutive = 0;
    }
  }

  return bursts;
}


// -------- WINDOW (10 seconds – original) --------
setInterval(() => {
  if (keyEvents.length === 0) return;

  const features = extractFeatures(keyEvents, 2500);
  const stability = computeStabilityScore(features);
  const bursts = detectCorrectionBursts(keyEvents);

  // ✅ Console output restored
  console.log("Stability score:", stability);
  console.log("Correction bursts:", bursts);

  // Send ONLY stability (no speed, no brightness)
  window.postMessage(
    {
      type: "CANDLE_UPDATE",
      stability: stability
    },
    "*"
  );

  keyEvents = [];
}, 2500);
