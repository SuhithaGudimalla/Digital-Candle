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
  panel.style.cssText = `
    position: fixed;
    bottom: 120px;
    right: 20px;
    background: #1e1e1e;
    color: #fff;
    padding: 12px;
    border-radius: 8px;
    font-size: 12px;
    display: none;
    z-index: 999999;
    width: 180px;
  `;

  panel.innerHTML = `
    <label style="display:block;margin-bottom:6px;">
      Duration (minutes):
    </label>
    <input id="candle-minutes" type="number" min="1" placeholder="25"
      style="width:100%;margin-bottom:8px;padding:4px;" />

    <button id="start-timer" style="width:100%;margin-bottom:6px;">
      Start Timer
    </button>

    <button id="stop-timer" style="width:100%;">
      Stop Timer
    </button>
  `;

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
  document.getElementById("start-timer").onclick = () => {
    const minutes = Number(
      document.getElementById("candle-minutes").value
    );

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

  document.getElementById("stop-timer").onclick = () => {
    window.candleTimer.enabled = false;
    window.candleTimer.startTime = null;
    window.candleTimer.meltProgress = 0;

    // 🔔 Notify content script to reset candle
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

    // 🔥 SEND MELT PROGRESS TO CONTENT SCRIPT
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
