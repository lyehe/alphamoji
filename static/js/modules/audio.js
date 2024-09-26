/**
 * Audio module for managing sound effects and background music.
 */

// Constants for frequency values
const FREQUENCIES = {
  C5: 523.25,
  E5: 659.25,
  Eb4: 311.13,
  D4: 293.66
};

let audioContext;
let backgroundMusic;
let backgroundMusicSource;

/**
 * Initializes the audio context.
 */
export function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

/**
 * Plays a tone with the specified frequency and duration.
 * @param {number} frequency - The frequency of the tone in Hz.
 * @param {number} duration - The duration of the tone in seconds.
 */
export function playTone(frequency, duration) {
  initAudio();
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Envelope to avoid clicks
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.01);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

/**
 * Plays the correct answer sound (two ascending tones).
 */
export function playCorrectSound() {
  playTone(FREQUENCIES.C5, 0.15);
  setTimeout(() => playTone(FREQUENCIES.E5, 0.15), 80);
}

/**
 * Plays the incorrect answer sound (two descending tones).
 */
export function playIncorrectSound() {
  playTone(FREQUENCIES.Eb4, 0.15);
  setTimeout(() => playTone(FREQUENCIES.D4, 0.15), 80);
}

/**
 * Toggles the background music on and off.
 */
export function toggleBackgroundMusic() {
  initAudio();
  const musicToggleBtn = document.getElementById("musicToggleBtn");
  if (!musicToggleBtn) return;

  if (!backgroundMusic) {
    loadBackgroundMusic().then(() => {
      if (backgroundMusic) {
        backgroundMusic.start();
        musicToggleBtn.textContent = "🔇";
        musicToggleBtn.setAttribute("aria-label", "Stop background music");
      }
    }).catch(error => console.error("Error loading background music:", error));
  } else {
    backgroundMusic.stop();
    backgroundMusic = null;
    musicToggleBtn.textContent = "🎵";
    musicToggleBtn.setAttribute("aria-label", "Play background music");
  }
}

/**
 * Loads the background music from an MP3 file.
 * @returns {Promise<void>}
 */
function loadBackgroundMusic() {
  if (!audioContext) return Promise.reject("Audio context not initialized");

  return fetch('/static/audio/background_music.mp3')
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      backgroundMusicSource = audioContext.createBufferSource();
      backgroundMusicSource.buffer = audioBuffer;
      backgroundMusicSource.connect(audioContext.destination);
      backgroundMusicSource.loop = true;

      backgroundMusic = {
        start: () => backgroundMusicSource.start(),
        stop: () => backgroundMusicSource.stop()
      };
    });
}

/**
 * Resumes audio playback if it was suspended.
 */
export function resumeAudio() {
  if (audioContext?.state === "suspended") {
    audioContext.resume();
  }
  if (backgroundMusicSource?.playbackRate.value === 0) {
    backgroundMusicSource.playbackRate.value = 1;
  }
}

/**
 * Pauses audio playback by setting the playback rate to 0.
 */
export function pauseAudio() {
  if (backgroundMusicSource?.playbackRate.value !== 0) {
    backgroundMusicSource.playbackRate.value = 0;
  }
}

/**
 * Starts the background music.
 */
export function startBackgroundMusic() {
  if (!backgroundMusic) {
    loadBackgroundMusic().then(() => {
      if (backgroundMusic) {
        backgroundMusic.start();
        const musicToggleBtn = document.getElementById("musicToggleBtn");
        if (musicToggleBtn) {
          musicToggleBtn.textContent = "🔇";
          musicToggleBtn.setAttribute("aria-label", "Stop background music");
        }
      }
    }).catch(error => console.error("Error starting background music:", error));
  }
}