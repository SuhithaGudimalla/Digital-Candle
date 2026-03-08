# 🕯️ Digital Candle

### An Ambient Focus and Interaction Stability Visualizer

Digital Candle is a Chrome browser extension that visualizes a user's typing behavior and focus through a dynamic candle metaphor. Instead of using intrusive alerts or timers, it provides a calm, ambient visual indicator of interaction stability.

The candle flame subtly changes based on typing rhythm, pauses, and corrections, allowing users to gain awareness of their focus state without distractions. Additionally, a study timer mode allows users to focus until the candle slowly melts away.

---

## ✨ Features

### 🔥 Interaction Stability Visualization

* Candle flame reacts to typing patterns
* Smooth typing → stable, taller flame
* Irregular typing → flickering flame

### ⌨️ Typing Behavior Analysis

The system observes:

* Typing speed
* Pause patterns
* Correction bursts (backspaces)

These signals are used to estimate **interaction stability**.

### ⏱️ Focus Timer Mode

Clicking the candle opens a timer panel where users can:

* Set any study duration (in minutes)
* Start or stop a focus session
* Watch the candle gradually melt as time passes

### 🕯️ Realistic Candle Animation

* Dynamic flame flicker
* Soft glow effect
* Candle body gradually melts
* Wax dripping animation

### 🔒 Privacy-First Design

Digital Candle does **not record or store typed text**.

Only interaction patterns such as timing between key presses are used.

No:

* text logging
* cloud storage
* camera usage
* microphone access

All processing happens **locally inside the browser**.

---

## ⚙️ How It Works

The system follows a simple behavioral pipeline:

1. **Keyboard Event Capture**

   * Detects typing events and pauses

2. **Feature Extraction**

   * Typing speed
   * Pause variance
   * Correction rate

3. **Stability Estimation**

   * A score between 0–100 is calculated

4. **Visual Mapping**

   * Stability → candle flame behavior

5. **Timer Mode**

   * Timer progress → candle melting animation

---

## 🧩 Project Structure

```
digital-candle/
│
├── manifest.json
├── content.js
├── candle.js
├── timer.js
├── candle.css
└── README.md
```

### File Overview

| File            | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `manifest.json` | Chrome extension configuration                   |
| `content.js`    | Injects the candle UI and tracks typing behavior |
| `candle.js`     | Handles flame animation and visual rendering     |
| `timer.js`      | Implements the focus timer and melting logic     |
| `candle.css`    | Styling for the candle and wax effects           |

---

## 🚀 Installation

1. Clone the repository

```
git clone https://github.com/your-username/Digital-Candle.git
```

2. Open Chrome and go to:

```
chrome://extensions
```

3. Enable **Developer Mode**

4. Click **Load Unpacked**

5. Select the **Digital Candle project folder**

The extension will now appear on all supported webpages.

---

## 🧪 Usage

1. Start typing on any webpage.
2. Observe the candle flame reacting to typing stability.
3. Click the candle to open the timer panel.
4. Enter a focus duration (in minutes).
5. Start the timer and study until the candle melts.

---

## 🌐 Compatibility

Works on most websites including:

* Coding platforms (LeetCode, HackerRank, CodeChef)
* Documentation sites
* Blogs and learning platforms
* Search engines and articles

Some sites such as **Google Docs** restrict keyboard access due to strict security policies.

---

## 💡 Motivation

Most productivity tools rely on notifications, alarms, or intrusive tracking.

Digital Candle explores an alternative:

> **Ambient feedback instead of interruption.**

By visualizing interaction patterns through a familiar metaphor, users can develop awareness of their focus state naturally.

---

#🔮 Future Improvements

* Focus history analytics
* Multi-day study tracking
* Custom candle themes
* Dark-mode adaptive glow
* Optional Pomodoro cycles

---

## 🛠️ Tech Stack

* JavaScript
* HTML5
* CSS3
* Canvas API
* Chrome Extension APIs

---

## License

MIT License

---

## Author

Suhitha G
* AIML Student | App Development | Creative Tech Projects

---
