/**
 * useAudio Custom Hook
 *
 * WHAT: Manages sound effects and background music for the game
 *
 * WHY: Audio in web apps requires careful management:
 * - Browsers block autoplay until user interaction
 * - Audio context needs initialization
 * - We want to control volume, play/pause, etc.
 *
 * LEARNING NOTES:
 * - Web Audio API is complex, so we simplify it here
 * - Uses HTML5 Audio objects for sound effects
 * - Manages mute state for the entire app
 * - Handles browser autoplay restrictions properly
 */

import { useState, useRef, useEffect } from 'react';

/**
 * useAudio Hook
 *
 * HOW IT WORKS:
 * 1. Creates Audio objects for sound effects
 * 2. Manages playback state (playing, muted, etc.)
 * 3. Provides simple functions to play sounds
 * 4. Handles cleanup when component unmounts
 *
 * @returns {Object} Audio controls and state
 *
 * LEARNING NOTES:
 * - Audio objects are stored in refs (don't need to trigger re-renders)
 * - Mute state uses useState (we want to show mute button state)
 * - useEffect handles cleanup to prevent memory leaks
 */
function useAudio() {
  // LEARNING: useState for values that affect the UI
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // LEARNING: useRef for objects that don't affect the UI directly
  // These persist across renders but don't trigger re-renders when changed
  const backgroundMusicRef = useRef(null);
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);

  /**
   * Initialize audio on first user interaction
   *
   * WHY: Browsers block autoplay to prevent annoying websites
   * We must wait for user interaction before playing audio
   *
   * LEARNING: This function is called when user first clicks/touches the screen
   */
  const initializeAudio = () => {
    try {
      // Create background music Audio object
      // LEARNING: Audio is a built-in browser API for playing sounds
      if (!backgroundMusicRef.current) {
        backgroundMusicRef.current = new Audio('/audio/background.mp3');
        backgroundMusicRef.current.loop = true; // Keep playing forever
        backgroundMusicRef.current.volume = 0.3; // Not too loud!
      }

      // Create correct answer sound
      if (!correctSoundRef.current) {
        correctSoundRef.current = new Audio('/audio/correct.mp3');
        correctSoundRef.current.volume = 0.5;
      }

      // Create incorrect answer sound
      if (!incorrectSoundRef.current) {
        incorrectSoundRef.current = new Audio('/audio/incorrect.mp3');
        incorrectSoundRef.current.volume = 0.5;
      }
    } catch (error) {
      // LEARNING: Always handle errors! Audio might not be supported
      console.error('Error initializing audio:', error);
    }
  };

  /**
   * Plays the correct answer sound effect
   *
   * LEARNING: We use try/catch because audio playback can fail
   * (muted by user, file not found, browser restrictions, etc.)
   */
  const playCorrectSound = () => {
    if (isMuted || !correctSoundRef.current) return;

    try {
      // LEARNING: We reset currentTime to 0 to allow rapid consecutive plays
      // Without this, if sound is still playing, it won't restart
      correctSoundRef.current.currentTime = 0;
      correctSoundRef.current.play();
    } catch (error) {
      console.error('Error playing correct sound:', error);
    }
  };

  /**
   * Plays the incorrect answer sound effect
   */
  const playIncorrectSound = () => {
    if (isMuted || !incorrectSoundRef.current) return;

    try {
      incorrectSoundRef.current.currentTime = 0;
      incorrectSoundRef.current.play();
    } catch (error) {
      console.error('Error playing incorrect sound:', error);
    }
  };

  /**
   * Starts playing background music
   *
   * LEARNING: play() returns a Promise
   * We use async/await to handle it properly
   */
  const startBackgroundMusic = async () => {
    if (isMuted || !backgroundMusicRef.current) return;

    try {
      // LEARNING: await is needed because play() returns a Promise
      // The browser might reject if autoplay is blocked
      await backgroundMusicRef.current.play();
      setIsMusicPlaying(true);
    } catch (error) {
      console.error('Error starting background music:', error);
      // Don't crash the app if music fails to play
    }
  };

  /**
   * Stops background music
   */
  const stopBackgroundMusic = () => {
    if (!backgroundMusicRef.current) return;

    try {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0; // Reset to beginning
      setIsMusicPlaying(false);
    } catch (error) {
      console.error('Error stopping background music:', error);
    }
  };

  /**
   * Toggles background music on/off
   *
   * LEARNING: This is a common pattern - check state and do opposite action
   */
  const toggleBackgroundMusic = () => {
    if (isMusicPlaying) {
      stopBackgroundMusic();
    } else {
      startBackgroundMusic();
    }
  };

  /**
   * Toggles mute state
   *
   * LEARNING: When muted, we stop music and prevent sound effects
   */
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    // If muting, stop the music
    if (newMutedState && isMusicPlaying) {
      stopBackgroundMusic();
    }
  };

  /**
   * Cleanup function
   *
   * LEARNING: useEffect with empty dependency array runs once on mount
   * The return function runs when component unmounts
   * We need to stop audio to prevent memory leaks!
   */
  useEffect(() => {
    // This runs when the component mounts
    // We could initialize audio here, but we wait for user interaction instead

    // LEARNING: Return a cleanup function
    // This runs when the component unmounts (when user leaves the page)
    return () => {
      // Stop and cleanup all audio
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
      if (correctSoundRef.current) {
        correctSoundRef.current = null;
      }
      if (incorrectSoundRef.current) {
        incorrectSoundRef.current = null;
      }
    };
  }, []); // LEARNING: Empty array = run once on mount, cleanup on unmount

  // Return all audio controls
  return {
    // State
    isMuted,
    isMusicPlaying,

    // Controls
    initializeAudio,
    playCorrectSound,
    playIncorrectSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,
    toggleMute,
  };
}

/**
 * LEARNING SUMMARY:
 *
 * Key Concepts:
 *
 * 1. **HTML5 Audio API**
 *    - new Audio(url) creates an audio object
 *    - .play() starts playback (returns a Promise!)
 *    - .pause() stops playback
 *    - .currentTime = 0 resets to beginning
 *    - .loop = true makes it repeat
 *    - .volume sets volume (0.0 to 1.0)
 *
 * 2. **Browser Autoplay Policies**
 *    - Browsers block audio until user interacts with page
 *    - We initialize audio in initializeAudio() called on first click
 *    - Always handle play() rejection with try/catch
 *
 * 3. **useRef for Non-Visual Data**
 *    - Audio objects don't need to trigger re-renders
 *    - useRef is perfect for this (persists but doesn't re-render)
 *    - Check if ref.current exists before using it
 *
 * 4. **useEffect for Cleanup**
 *    - Always cleanup resources in the return function
 *    - Prevents memory leaks and keeps audio from playing when user leaves
 *    - Empty dependency array [] means "run once on mount"
 *
 * 5. **Error Handling**
 *    - Audio can fail for many reasons (file not found, blocked by browser, etc.)
 *    - Always use try/catch with audio operations
 *    - Never let audio errors crash your app!
 *
 * Common Patterns:
 * - Toggle functions: Check state, do opposite
 * - Initialize on demand: Don't create Audio until needed
 * - Reset currentTime: Allows sound to play again immediately
 *
 * Try This:
 * - Add volume control (slider from 0 to 1)
 * - Add a fade-in effect when music starts
 * - Create a playlist feature that plays multiple songs
 * - Add sound effect for keyboard presses
 *
 * Debugging Tips:
 * - Check browser console for audio errors
 * - Verify audio files exist in /public/audio/
 * - Test with browser's autoplay policy (might need to click first)
 * - Use browser DevTools to see network requests for audio files
 */

export default useAudio;
