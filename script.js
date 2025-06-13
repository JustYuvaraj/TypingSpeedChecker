document.addEventListener("DOMContentLoaded", () => {
  const paragraph = `Typing is a fundamental skill that every computer user must learn. It helps in improving efficiency and accuracy in communication. The ability to type quickly and without errors is important in almost every profession today. Whether you're writing code, drafting emails, or preparing documents, your typing speed plays a crucial role in how fast and well you perform your tasks. In this test, you will be required to type this paragraph within the given time limit.`;

  const container = document.getElementById("typing-text");
  const spans = [];
  let currentIndex = 0;
  let correctCount = 0;
  let startTime = null;
  let timerInterval = null;
  const maxTime = 60;

  // 🔧 Add flag to control typing permission
  let isTestActive = true;

  function createTypingText() {
    paragraph.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.className =
        "text-2xl transition-all duration-150 px-1 text-gray-400";
      if (index === 0) {
        span.classList.replace("text-gray-400", "text-black");
        span.classList.add("bg-blue-200", "animate-pulse");
      }
      container.appendChild(span);
      spans.push(span);
    });
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function updateStats(elapsedSeconds) {
    const minutes = elapsedSeconds / 60;

    const wpm = correctCount / 5 / minutes;

    const accuracy =
      currentIndex > 0 ? (correctCount / currentIndex) * 100 : 100;

    document.getElementById("timer").textContent = formatTime(elapsedSeconds);
    document.getElementById("wpm").textContent = wpm.toFixed(2);

    const accuracyDisplay = Math.min(accuracy, 100).toFixed(2);
    document.getElementById("accuracy").textContent = accuracyDisplay + "%";

    document.getElementById(
      "charCount"
    ).textContent = `${currentIndex}/${paragraph.length}`;
  }

  function completeTest() {
    clearInterval(timerInterval);
    isTestActive = false; // 🔧 Disable further typing
    const totalTime = (Date.now() - startTime) / 1000;
    updateStats(totalTime);
  }

  function startTimer() {
    startTime = Date.now();
    isTestActive = true; // 🔧 Allow typing
    timerInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (elapsed >= maxTime) {
        completeTest();
      } else {
        updateStats(elapsed);
      }
    }, 1000);
  }

  function handleTyping(e) {
    if (!isTestActive) return; // 🔧 Prevent typing after time ends

    e.preventDefault();
    if (!startTime) startTimer();

    if (e.key === "Backspace" && currentIndex > 0) {
      spans[currentIndex].classList.remove("bg-blue-200", "animate-pulse");
      currentIndex--;
      spans[currentIndex].className =
        "text-2xl transition-all duration-150 px-1 text-gray-400 bg-blue-200 animate-pulse";
      return;
    }

    if (e.key.length !== 1) return;

    const expected = paragraph[currentIndex];
    const span = spans[currentIndex];
    span.classList.remove("bg-blue-200", "animate-pulse", "text-gray-400");

    if (e.key === expected) {
      span.classList.add("text-green-600");
      correctCount++;
    } else {
      span.classList.add("text-red-600");
    }

    currentIndex++;

    if (currentIndex < spans.length) {
      spans[currentIndex].classList.remove("text-gray-400");
      spans[currentIndex].classList.add("bg-blue-200", "animate-pulse");
    } else {
      completeTest();
    }
  }

  function restartTest() {
    clearInterval(timerInterval);
    currentIndex = 0;
    correctCount = 0;
    startTime = null;
    isTestActive = true; // 🔧 Reset typing permission
    container.innerHTML = "";
    spans.length = 0;

    document.getElementById("timer").textContent = "0:00";
    document.getElementById("wpm").textContent = "0.00";
    document.getElementById("accuracy").textContent = "100%";
    document.getElementById("charCount").textContent = `0/${paragraph.length}`;

    createTypingText();
    container.focus();
  }

  // ✅ Initialize typing test
  createTypingText();
  container.focus();
  container.addEventListener("keydown", handleTyping);

  // ✅ Bind Reset Button
  const resetButton = document.querySelector("button.flex.items-center");
  if (resetButton) {
    resetButton.addEventListener("click", restartTest);
  }
});
