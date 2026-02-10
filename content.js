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
      <canvas id="flame" width="140" height="180"></canvas>
      <div id="candle-body"></div>
    </div>
  `;
  document.body.appendChild(container);

  // Inject candle JS
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("candle.js");
  document.body.appendChild(script);

  // Inject timer JS
  const timerScript = document.createElement("script");
  timerScript.src = chrome.runtime.getURL("timer.js");
  document.body.appendChild(timerScript);
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

  score -= Math.min(features.pauseVariance / 5000, 40);
  score -= features.correctionRate * 30;

  if (features.typingSpeed > 4) {
    score -= (features.typingSpeed - 4) * 5;
  }

  if (features.typingSpeed < 2) {
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


// -------- STABILITY WINDOW --------
setInterval(() => {
  if (keyEvents.length === 0) return;

  const features = extractFeatures(keyEvents, 2500);
  const stability = computeStabilityScore(features);
  const bursts = detectCorrectionBursts(keyEvents);

  console.log("Stability score:", stability);
  console.log("Correction bursts:", bursts);

  window.postMessage(
    {
      type: "CANDLE_UPDATE",
      stability: stability
    },
    "*"
  );

  keyEvents = [];
}, 2500);


// ---------------- MELTING (POSTMESSAGE-BASED) ----------------
const candleBody = document.getElementById("candle-body");
const FULL_HEIGHT = 65; // MUST match candle.css

let meltProgress = 0;

// Receive melt progress from timer.js
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CANDLE_MELT") {
    meltProgress = event.data.meltProgress;
  }
});

// Apply melting visually
setInterval(() => {
  if (!candleBody) return;

  const newHeight = FULL_HEIGHT * (1 - meltProgress);
  candleBody.style.height = Math.max(newHeight, 4) + "px";

  const meltiness = meltProgress * 12;
  candleBody.style.borderTopLeftRadius = meltiness + "px";
  candleBody.style.borderTopRightRadius = meltiness + "px";
}, 200);
