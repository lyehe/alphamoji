/**
 * StatsModal Component
 *
 * WHAT: Displays game statistics in a modal
 *
 * WHY: Users want to see their progress (average time, most common errors, etc.)
 *
 * LEARNING: Similar to HistoryModal, demonstrates same patterns with different data
 */

import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { getStatistics } from '../../services/api';
import styles from './Modal.module.css';

function StatsModal() {
  const { isStatsModalOpen, toggleStatsModal } = useGameContext();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isStatsModalOpen) {
      fetchStats();
    }
  }, [isStatsModalOpen]);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getStatistics();
      setStats(data);
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      toggleStatsModal();
    }
  };

  if (!isStatsModalOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-title"
    >
      <div className={styles.modal}>
        <header className={styles.header}>
          <h2 id="stats-title">Your Statistics</h2>
          <button
            className={styles.closeButton}
            onClick={toggleStatsModal}
            aria-label="Close statistics modal"
          >
            ×
          </button>
        </header>

        <div className={styles.content}>
          {isLoading && <p>Loading statistics...</p>}

          {error && <p className={styles.error}>{error}</p>}

          {!isLoading && !error && stats && (
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Attempts:</span>
                <span className={styles.statValue}>{stats.totalAttempts || 0}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Average Time:</span>
                <span className={styles.statValue}>
                  {stats.averageTime ? `${stats.averageTime.toFixed(2)}s` : 'N/A'}
                </span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Error Rate:</span>
                <span className={styles.statValue}>
                  {stats.errorRate ? `${(stats.errorRate * 100).toFixed(1)}%` : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsModal;
