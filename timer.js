// Prevent duplicate panel
if (!window.candleTimerPanelLoaded) {
  window.candleTimerPanelLoaded = true;

  // ---------------- SHARED TIMER STATE ----------------
  window.candleTimer = {
    enabled: false,
    duration: 0,
    startTime: null,
    meltProgress: 0
  };

  // ---------------- CREATE PANEL ----------------
  const panel = document.createElement("div");
  panel.id = "candle-timer-panel";
  panel.style.position = "fixed";
  panel.style.bottom = "120px";
  panel.style.right = "20px";
  panel.style.background = "#1e1e1e";
  panel.style.color = "#fff";
  panel.style.padding = "12px";
  panel.style.borderRadius = "8px";
  panel.style.fontSize = "12px";
  panel.style.display = "none";
  panel.style.zIndex = "999999";
  panel.style.width = "180px";

  // ----- LABEL -----
  const label = document.createElement("label");
  label.textContent = "Duration (minutes):";
  label.style.display = "block";
  label.style.marginBottom = "6px";

  // ----- INPUT -----
  const input = document.createElement("input");
  input.id = "candle-minutes";
  input.type = "number";
  input.min = "1";
  input.placeholder = "25";
  input.style.width = "100%";
  input.style.marginBottom = "8px";
  input.style.padding = "4px";

  // ----- START BUTTON -----
  const startBtn = document.createElement("button");
  startBtn.id = "start-timer";
  startBtn.textContent = "Start Timer";
  startBtn.style.width = "100%";
  startBtn.style.marginBottom = "6px";

  // ----- STOP BUTTON -----
  const stopBtn = document.createElement("button");
  stopBtn.id = "stop-timer";
  stopBtn.textContent = "Stop Timer";
  stopBtn.style.width = "100%";

  // Append elements
  panel.appendChild(label);
  panel.appendChild(input);
  panel.appendChild(startBtn);
  panel.appendChild(stopBtn);

  document.body.appendChild(panel);

  // ---------------- TOGGLE PANEL ----------------
  const candle = document.getElementById("digital-candle");

  candle.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.style.display =
      panel.style.display === "none" ? "block" : "none";
  });

  // Prevent closing when clicking inside panel
  panel.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    panel.style.display = "none";
  });

  // ---------------- TIMER LOGIC ----------------
  startBtn.onclick = () => {
    const minutes = Number(input.value);

    if (!minutes || minutes <= 0) {
      alert("Please enter valid minutes");
      return;
    }

    window.candleTimer.enabled = true;
    window.candleTimer.duration = minutes * 60 * 1000;
    window.candleTimer.startTime = Date.now();
    window.candleTimer.meltProgress = 0;

    console.log("Timer started:", {
      enabled: true,
      duration: window.candleTimer.duration,
      startTime: window.candleTimer.startTime
    });
  };

  stopBtn.onclick = () => {
    window.candleTimer.enabled = false;
    window.candleTimer.startTime = null;
    window.candleTimer.meltProgress = 0;

    // Reset candle
    window.postMessage(
      { type: "CANDLE_MELT", meltProgress: 0 },
      "*"
    );

    console.log("Timer stopped");
  };

  // ---------------- UPDATE MELT PROGRESS ----------------
  setInterval(() => {
    if (!window.candleTimer.enabled) return;

    const elapsed = Date.now() - window.candleTimer.startTime;
    const progress = elapsed / window.candleTimer.duration;

    const clamped = Math.min(Math.max(progress, 0), 1);
    window.candleTimer.meltProgress = clamped;

    // Send melt progress to content script
    window.postMessage(
      {
        type: "CANDLE_MELT",
        meltProgress: clamped
      },
      "*"
    );

    if (progress >= 1) {
      window.candleTimer.enabled = false;
      console.log("Timer finished");
    }
  }, 1000);
}