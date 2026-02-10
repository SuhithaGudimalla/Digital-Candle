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


