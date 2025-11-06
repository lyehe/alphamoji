/**
 * HistoryModal Component
 *
 * WHAT: Displays a modal showing the user's typing history
 *
 * WHY: Users want to see which letters they've typed and how they performed
 *
 * LEARNING NOTES:
 * - Demonstrates modal/dialog pattern in React
 * - Shows how to fetch data when component opens
 * - Example of list rendering with real data
 */

import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { getHistory } from '../../services/api';
import styles from './Modal.module.css';

/**
 * HistoryModal Component
 *
 * LEARNING: This component demonstrates:
 * - Conditional rendering (only show when open)
 * - Data fetching (loading state, error handling)
 * - Portal pattern (modal overlays)
 * - List rendering with keys
 */
function HistoryModal() {
  const { isHistoryModalOpen, toggleHistoryModal } = useGameContext();

  // Local state for history data
  // LEARNING: Not all state needs to be in Context!
  // History data is only needed by this component
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch history when modal opens
   *
   * LEARNING: useEffect with dependency [isHistoryModalOpen]
   * Runs whenever the modal opens
   */
  useEffect(() => {
    if (isHistoryModalOpen) {
      fetchHistory();
    }
  }, [isHistoryModalOpen]);

  /**
   * Fetch history data from API
   */
  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      setError('Failed to load history');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle clicking outside modal to close
   *
   * LEARNING: Common modal pattern
   * Click on backdrop (dark area) closes modal
   */
  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      toggleHistoryModal();
    }
  };

  // Don't render anything if modal is closed
  if (!isHistoryModalOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
    >
      <div className={styles.modal}>
        {/* Modal header */}
        <header className={styles.header}>
          <h2 id="history-title">Your History</h2>
          <button
            className={styles.closeButton}
            onClick={toggleHistoryModal}
            aria-label="Close history modal"
          >
            ×
          </button>
        </header>

        {/* Modal content */}
        <div className={styles.content}>
          {isLoading && <p>Loading history...</p>}

          {error && <p className={styles.error}>{error}</p>}

          {!isLoading && !error && history.length === 0 && (
            <p className={styles.empty}>No history yet. Start typing to build your history!</p>
          )}

          {!isLoading && !error && history.length > 0 && (
            <ul className={styles.list}>
              {history.map((entry, index) => (
                <li key={`${entry.letter}-${entry.timestamp || index}`} className={styles.listItem}>
                  <span className={styles.emoji}>{entry.emoji}</span>
                  <span className={styles.letter}>{entry.letter}</span>
                  <span className={styles.emojiName}>{entry.emoji_name || entry.emojiName}</span>
                  {entry.time_taken !== undefined && (
                    <span className={styles.time}>{entry.time_taken.toFixed(2)}s</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * LEARNING SUMMARY:
 *
 * Modal Pattern:
 * 1. Backdrop: Dark overlay behind modal
 * 2. Modal: The content box
 * 3. Close button: X button to close
 * 4. Click outside to close: Click backdrop closes modal
 *
 * Data Fetching in Components:
 * - Fetch when component mounts or when specific prop changes
 * - Handle loading, error, empty, and success states
 * - Store fetched data in local state (not Context unless needed globally)
 *
 * Try This:
 * - Add sort/filter options
 * - Add pagination for long histories
 * - Add clear history button
 */

export default HistoryModal;
