document.addEventListener("DOMContentLoaded", () => {
  const letterDisplay = document.getElementById("letter-display");
  const previousLetter = document.getElementById("previous-letter");
  const nextLetter = document.getElementById("next-letter");
  const emojiDisplay = document.getElementById("emoji-display");
  const displayText = document.getElementById("display-text");
  const feedback = document.getElementById("feedback");
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  const historyBtn = document.getElementById("historyBtn");
  const statsBtn = document.getElementById("statsBtn");
  const historyModal = document.getElementById("historyModal");
  const statsModal = document.getElementById("statsModal");
  const closeBtn = document.querySelector(".close");
  const closeStatsBtn = document.querySelector(".close-stats");
  const historyList = document.getElementById("historyList");
  const totalAttempts = document.getElementById("totalAttempts");
  const totalErrors = document.getElementById("totalErrors");
  const accuracy = document.getElementById("accuracy");

  const timerValue = document.getElementById("timer-value");
  let timerInterval;
  let elapsedTime = 0;

  let previousLetterData = null;
  let currentLetterData = null;
  let nextLetterData = null;
  let audioContext;
  let backgroundMusic;

  const colorToggleBtn = document.getElementById("colorToggleBtn");

  let isRainbow = true; // Change this to true

  // Add this array of nice colors
  const niceColors = [
    "#D32F2F",
    "#C2185B",
    "#7B1FA2",
    "#512DA8",
    "#303F9F",
    "#1976D2",
    "#0288D1",
    "#0097A7",
    "#00796B",
    "#388E3C",
    "#689F38",
    "#AFB42B",
    "#FBC02D",
    "#FFA000",
    "#F57C00",
  ];

  let currentColor;

  function getRandomColor() {
    return niceColors[Math.floor(Math.random() * niceColors.length)];
  }

  function toggleColor() {
    isRainbow = !isRainbow;
    if (displayText) {
      if (isRainbow) {
        currentColor = getRandomColor();
        displayText.style.color = currentColor;
      } else {
        displayText.style.color = "#333333"; // Darker gray color
      }
    }

    if (colorToggleBtn) {
      if (isRainbow) {
        colorToggleBtn.textContent = "🔳";
        colorToggleBtn.setAttribute("aria-label", "Switch to gray color");
      } else {
        colorToggleBtn.textContent = "🌈";
        colorToggleBtn.setAttribute("aria-label", "Switch to colored text");
      }
    }
  }

  if (colorToggleBtn) {
    colorToggleBtn.addEventListener("click", toggleColor);
  } else {
    console.error("Color toggle button not found in the DOM");
  }

  // Initialize with rainbow color
  displayText.classList.add("rainbow");
  colorToggleBtn.textContent = "🔳";
  colorToggleBtn.setAttribute("aria-label", "Switch to gray color");

  function startTimer() {
    elapsedTime = 0;
    timerValue.textContent = elapsedTime.toString();
    clearInterval(timerInterval);
    timerInterval = window.setInterval(() => {
      elapsedTime += 1;
      timerValue.textContent = elapsedTime.toString();
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    timerValue.textContent = elapsedTime.toString();
    startTimer();
  }

  function getRandomLetter() {
    return fetch("/get_random_letter")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        return {
          letter: data.letter,
          emoji: data.emoji,
          displayText: data.display_text,
        };
      })
      .catch((error) => {
        console.error("Error fetching random letter:", error);
        return null;
      });
  }

  async function initializeGame() {
    try {
      currentLetterData = await getRandomLetter();
      nextLetterData = await getRandomLetter();
      if (currentLetterData && nextLetterData) {
        updateDisplay();
        startTimer();
      } else {
        console.error("Failed to initialize game due to API errors");
        // Handle the error, maybe show a message to the user
      }
    } catch (error) {
      console.error("Error initializing game:", error);
      // Handle the error, maybe show a message to the user
    }
  }

  function updateDisplay() {
    previousLetter.textContent = previousLetterData
      ? previousLetterData.letter
      : "";
    letterDisplay.textContent = currentLetterData
      ? currentLetterData.letter
      : "";
    nextLetter.textContent = nextLetterData ? nextLetterData.letter : "";
    emojiDisplay.textContent = currentLetterData ? currentLetterData.emoji : "";
    displayText.textContent = currentLetterData
      ? currentLetterData.displayText
      : "";
    feedback.textContent = "";
    letterDisplay.style.color = "#4a4a4a";
    resetTimer();

    if (isRainbow) {
      currentColor = getRandomColor();
      displayText.style.color = currentColor;
    } else {
      displayText.style.color = "#333333"; // Darker gray color
    }
  }

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(frequency, duration) {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(
      0,
      audioContext.currentTime + duration - 0.01
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }

  function playCorrectSound() {
    playTone(523.25, 0.15);
    setTimeout(() => playTone(659.25, 0.15), 80);
  }

  function playIncorrectSound() {
    playTone(311.13, 0.15);
    setTimeout(() => playTone(293.66, 0.15), 80);
  }

  async function handleCorrectGuess() {
    letterDisplay.style.color = "#4CAF50";
    feedback.textContent = "🎉 Correct!";
    playCorrectSound();

    document.removeEventListener("keydown", handleKeyPress);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    previousLetterData = currentLetterData;
    currentLetterData = nextLetterData;
    nextLetterData = await getRandomLetter();

    updateDisplay();

    document.addEventListener("keydown", handleKeyPress);
  }

  function handleIncorrectGuess() {
    if (currentLetterData) {
      letterDisplay.style.color = "#FF5252";
      feedback.textContent = "😕 Try again!";
      playIncorrectSound();

      document.removeEventListener("keydown", handleKeyPress);

      reportError(currentLetterData.letter);

      setTimeout(() => {
        document.addEventListener("keydown", handleKeyPress);
      }, 500);
    } else {
      console.error("currentLetterData is null in handleIncorrectGuess");
      // Handle this error case, maybe reinitialize the game
    }
  }

  function handleKeyPress(event) {
    if (
      currentLetterData &&
      event.key.toUpperCase() === currentLetterData.letter
    ) {
      handleCorrectGuess();
    } else {
      handleIncorrectGuess();
    }
  }

  function reportError(letter) {
    fetch("/report_error", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ letter }),
    });
  }

  document.addEventListener("keydown", handleKeyPress);

  document.addEventListener("click", initAudio, { once: true });
  document.addEventListener("keydown", initAudio, { once: true });

  initializeGame();

  historyBtn.addEventListener("click", () => {
    fetch("/get_history")
      .then((response) => response.json())
      .then((data) => {
        historyList.innerHTML = "";
        data.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = `${item.letter}: ${item.emoji} (${item.emoji_name}) - Errors: ${item.error}`;
          historyList.appendChild(li);
        });
        historyModal.style.display = "block";
      });
  });

  closeBtn.addEventListener("click", () => {
    historyModal.style.display = "none";
  });

  statsBtn.addEventListener("click", () => {
    fetch("/get_statistics")
      .then((response) => response.json())
      .then((data) => {
        totalAttempts.textContent = data.total_attempts.toString();
        totalErrors.textContent = data.total_errors.toString();
        accuracy.textContent = `${data.accuracy}%`;
        statsModal.style.display = "block";
      });
  });

  closeStatsBtn.addEventListener("click", () => {
    statsModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === historyModal) {
      historyModal.style.display = "none";
    }
    if (event.target === statsModal) {
      statsModal.style.display = "none";
    }
  });

  function createBackgroundMusic() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const bufferSize = 8 * audioContext.sampleRate;
    const buffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate
    );
    const data = buffer.getChannelData(0);

    const baseNotes = [
      { freq: 261.63, duration: 0.25 },
      { freq: 293.66, duration: 0.25 },
      { freq: 329.63, duration: 0.25 },
      { freq: 349.23, duration: 0.25 },
      { freq: 392.0, duration: 0.25 },
      { freq: 349.23, duration: 0.25 },
      { freq: 329.63, duration: 0.25 },
      { freq: 293.66, duration: 0.25 },
    ];

    const higherNotes = baseNotes.map((note) => ({
      freq: note.freq * 1.122462,
      duration: note.duration,
    }));

    const notes = [...baseNotes, ...higherNotes];

    const totalDuration = notes.reduce((sum, note) => sum + note.duration, 0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / audioContext.sampleRate;
      const loopedTime = t % totalDuration;

      let currentNote = notes[0];
      let noteStartTime = 0;
      for (const note of notes) {
        if (
          loopedTime >= noteStartTime &&
          loopedTime < noteStartTime + note.duration
        ) {
          currentNote = note;
          break;
        }
        noteStartTime += note.duration;
      }

      const noteT = (loopedTime - noteStartTime) / currentNote.duration;
      const amplitude = (0.2 * (1 - Math.cos(2 * Math.PI * noteT))) / 2;

      data[i] =
        amplitude * Math.sin(currentNote.freq * 2 * Math.PI * loopedTime);
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    return {
      play: () => {
        if (audioContext.state === "suspended") {
          audioContext.resume();
        }
        source.start();
      },
      stop: () => {
        source.stop();
      },
      resume: () => {
        if (audioContext.state === "suspended") {
          audioContext.resume();
        }
      },
    };
  }

  function toggleBackgroundMusic() {
    if (!backgroundMusic) {
      backgroundMusic = createBackgroundMusic();
      backgroundMusic.play();
      musicToggleBtn.textContent = "🔇";
      musicToggleBtn.setAttribute("aria-label", "Stop background music");
    } else {
      backgroundMusic.stop();
      backgroundMusic = null;
      musicToggleBtn.textContent = "🎵";
      musicToggleBtn.setAttribute("aria-label", "Play background music");
    }
  }

  musicToggleBtn.addEventListener("click", toggleBackgroundMusic);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (audioContext) {
        audioContext.suspend();
      }
    } else {
      if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
      }
      if (backgroundMusic) {
        backgroundMusic.resume();
      }
    }
  });

  const hiddenInput = document.getElementById("hiddenInput");
  const showKeyboardBtn = document.getElementById("showKeyboardBtn");
  const body = document.body;
  const main = document.querySelector("main");
  const gameContainer = document.getElementById("game-container");

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    showKeyboardBtn.style.display = "inline-block";
  } else {
    showKeyboardBtn.style.display = "none";
  }

  showKeyboardBtn.addEventListener("click", () => {
    hiddenInput.focus();
  });

  hiddenInput.addEventListener("focus", () => {
    document.body.classList.add("keyboard-visible");

    setTimeout(() => {
      const viewportHeight = window.innerHeight;
      const gameContainerRect = gameContainer.getBoundingClientRect();
      const bottomOverflow = gameContainerRect.bottom - viewportHeight;

      if (bottomOverflow > 0) {
        gameContainer.style.transform = `translateY(-${bottomOverflow + 50}px)`;
      }
    }, 300);
  });

  hiddenInput.addEventListener("blur", () => {
    document.body.classList.remove("keyboard-visible");
    gameContainer.style.transform = "";
  });

  hiddenInput.addEventListener("input", (event) => {
    const inputChar = event.target.value.toLowerCase();
    event.target.value = "";
  });

  document.body.addEventListener(
    "touchstart",
    function () {
      if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
      }
      if (backgroundMusic) {
        backgroundMusic.resume();
      }
    },
    false
  );

  const fontToggleBtn = document.getElementById("fontToggleBtn");

  const fonts = ["font-fredoka", "font-comic", "font-indie", "font-schoolbell"];
  const fontEmojis = ["🔤", "🖋️", "✏️", "📚"];
  let currentFontIndex = 0;

  function toggleFont() {
    if (displayText && letterDisplay && previousLetter && nextLetter) {
      displayText.classList.remove(fonts[currentFontIndex]);
      letterDisplay.classList.remove(fonts[currentFontIndex]);
      previousLetter.classList.remove(fonts[currentFontIndex]);
      nextLetter.classList.remove(fonts[currentFontIndex]);

      currentFontIndex = (currentFontIndex + 1) % fonts.length;

      displayText.classList.add(fonts[currentFontIndex]);
      letterDisplay.classList.add(fonts[currentFontIndex]);
      previousLetter.classList.add(fonts[currentFontIndex]);
      nextLetter.classList.add(fonts[currentFontIndex]);
    }

    if (fontToggleBtn) {
      fontToggleBtn.textContent = fontEmojis[currentFontIndex];
      fontToggleBtn.setAttribute(
        "aria-label",
        `Switch to ${fonts[(currentFontIndex + 1) % fonts.length]} font`
      );
    }
  }

  if (fontToggleBtn) {
    fontToggleBtn.addEventListener("click", toggleFont);
  } else {
    console.error("Font toggle button not found in the DOM");
  }

  // Initialize with the first font
  displayText.classList.add(fonts[currentFontIndex]);
  letterDisplay.classList.add(fonts[currentFontIndex]);
  previousLetter.classList.add(fonts[currentFontIndex]);
  nextLetter.classList.add(fonts[currentFontIndex]);
  fontToggleBtn.textContent = fontEmojis[currentFontIndex];
  fontToggleBtn.setAttribute(
    "aria-label",
    `Switch to ${fonts[(currentFontIndex + 1) % fonts.length]} font`
  );
});
