document.addEventListener("DOMContentLoaded", () => {
  const letterDisplay = document.getElementById("letter-display");
  const previousLetter = document.getElementById("previous-letter");
  const nextLetter = document.getElementById("next-letter");
  const emojiDisplay = document.getElementById("emoji-display");
  const displayText = document.getElementById("display-text");
  const feedback = document.getElementById("feedback");
  const musicToggleBtn = document.getElementById("musicToggleBtn");

  let previousLetterData = null;
  let currentLetterData = null;
  let nextLetterData = null;
  let audioContext;
  let backgroundMusic;

  function getRandomLetter() {
    return fetch("/get_random_letter")
      .then((response) => response.json())
      .then((data) => ({
        letter: data.letter,
        emoji: data.emoji,
        displayText: data.display_text,
      }));
  }

  async function initializeGame() {
    currentLetterData = await getRandomLetter();
    nextLetterData = await getRandomLetter();
    updateDisplay();
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
    letterDisplay.style.color = "#4a4a4a"; // Reset color
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
    playTone(523.25, 0.15); // C5
    setTimeout(() => playTone(659.25, 0.15), 80); // E5
  }

  function playIncorrectSound() {
    playTone(311.13, 0.15); // Eb4
    setTimeout(() => playTone(293.66, 0.15), 80); // D4
  }

  async function handleCorrectGuess() {
    letterDisplay.style.color = "#4CAF50"; // Green
    feedback.textContent = "🎉 Correct!";
    playCorrectSound();

    // Disable key presses during the delay
    document.removeEventListener("keydown", handleKeyPress);

    // Wait for 1 second before moving to the next letter
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Move to the next letter
    previousLetterData = currentLetterData;
    currentLetterData = nextLetterData;
    nextLetterData = await getRandomLetter();

    updateDisplay();

    // Re-enable key presses
    document.addEventListener("keydown", handleKeyPress);
  }

  function handleIncorrectGuess() {
    letterDisplay.style.color = "#FF5252"; // Red
    feedback.textContent = "😕 Try again!";
    playIncorrectSound();

    // Disable key presses during the delay
    document.removeEventListener("keydown", handleKeyPress);

    // Wait for 0.5 seconds before allowing next input
    setTimeout(() => {
      document.addEventListener("keydown", handleKeyPress);
    }, 500);
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

  document.addEventListener("keydown", handleKeyPress);

  // Initialize audio context on user interaction
  document.addEventListener("click", initAudio, { once: true });
  document.addEventListener("keydown", initAudio, { once: true });

  initializeGame();

  const historyBtn = document.getElementById("historyBtn");
  const historyModal = document.getElementById("historyModal");
  const closeBtn = document.querySelector(".close");
  const historyList = document.getElementById("historyList");

  historyBtn.addEventListener("click", () => {
    fetch("/get_history")
      .then((response) => response.json())
      .then((data) => {
        historyList.innerHTML = "";
        data.forEach((item) => {
          const li = document.createElement("li");
          li.textContent = `${item.letter}: ${item.emoji} ${item.emoji_name}`;
          historyList.appendChild(li);
        });
        historyModal.style.display = "block";
      });
  });

  closeBtn.addEventListener("click", () => {
    historyModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === historyModal) {
      historyModal.style.display = "none";
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

    // Simple, cheerful melody with two rounds
    const baseNotes = [
      { freq: 261.63, duration: 0.25 }, // C4
      { freq: 293.66, duration: 0.25 }, // D4
      { freq: 329.63, duration: 0.25 }, // E4
      { freq: 349.23, duration: 0.25 }, // F4
      { freq: 392.0, duration: 0.25 }, // G4
      { freq: 349.23, duration: 0.25 }, // F4
      { freq: 329.63, duration: 0.25 }, // E4
      { freq: 293.66, duration: 0.25 }, // D4
    ];

    // Create a second round of notes, one step higher
    const higherNotes = baseNotes.map((note) => ({
      freq: note.freq * 1.122462, // Multiply by 2^(1/12) to go up one semitone
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
      const amplitude = (0.2 * (1 - Math.cos(2 * Math.PI * noteT))) / 2; // Smooth envelope

      data[i] =
        amplitude * Math.sin(currentNote.freq * 2 * Math.PI * loopedTime);
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime); // Reduced volume

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    return {
      play: () => {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        source.start();
      },
      stop: () => {
        source.stop();
      },
      resume: () => {
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
      }
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
      if (audioContext && audioContext.state === 'suspended') {
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

  // Check if the device is mobile
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
    body.classList.add("keyboard-visible");
    setTimeout(() => {
      const viewportHeight = window.innerHeight;
      const gameContainerRect = gameContainer.getBoundingClientRect();
      if (gameContainerRect.bottom > viewportHeight) {
        const overflowAmount = gameContainerRect.bottom - viewportHeight;
        const currentTransform = window.getComputedStyle(gameContainer).transform;
        const matrix = new DOMMatrix(currentTransform);
        const currentTranslateY = matrix.m42;
        gameContainer.style.transform = `translateY(${currentTranslateY - overflowAmount}px) scale(0.8)`;
      }
    }, 300); // Wait for the keyboard to fully appear
  });

  hiddenInput.addEventListener("blur", () => {
    body.classList.remove("keyboard-visible");
    gameContainer.style.transform = "";
  });

  hiddenInput.addEventListener("input", (event) => {
    const inputChar = event.target.value.toLowerCase();
    // Process the input character here
    // You may want to call your existing letter checking function
    // For example: checkLetter(inputChar);
    
    // Clear the input field immediately
    event.target.value = "";
  });

  document.body.addEventListener('touchstart', function() {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (backgroundMusic) {
      backgroundMusic.resume();
    }
  }, false);
});

// Make sure to update your existing letter checking logic to work with this new input method
