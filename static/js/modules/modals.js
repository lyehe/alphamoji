/**
 * Fetches and displays the history in a modal.
 */
export function showHistory() {
  fetch("/get_history")
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      const historyList = document.getElementById("historyList");
      const historyModal = document.getElementById("historyModal");

      historyList.innerHTML = "";
      data.forEach(item => {
        const li = document.createElement("li");
        const timeTaken = item.time_taken !== null ? `${item.time_taken.toFixed(2)}s` : 'N/A';
        li.textContent = `${item.letter}: ${item.emoji} (${item.emoji_name}) - ⏱️ ${timeTaken} - ❌ ${item.error}`;
        historyList.appendChild(li);
      });
      historyModal.style.display = "block";
    })
    .catch(error => console.error('Error fetching history:', error));
}

/**
 * Fetches and displays statistics in a modal.
 */
export function showStats() {
  fetch("/get_statistics")
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      const elements = {
        totalAttempts: document.getElementById("totalAttempts"),
        totalErrors: document.getElementById("totalErrors"),
        accuracy: document.getElementById("accuracy"),
        statsModal: document.getElementById("statsModal")
      };

      elements.totalAttempts.textContent = data.total_attempts.toString();
      elements.totalErrors.textContent = data.total_errors.toString();
      elements.accuracy.textContent = `${data.accuracy}%`;
      elements.statsModal.style.display = "block";
    })
    .catch(error => console.error('Error fetching statistics:', error));
}

/**
 * Sets up event listeners for closing modals.
 */
export function setupModalClosers() {
  const elements = {
    closeBtn: document.querySelector(".close"),
    closeStatsBtn: document.querySelector(".close-stats"),
    historyModal: document.getElementById("historyModal"),
    statsModal: document.getElementById("statsModal")
  };

  const closeModal = modal => {
    modal.style.display = "none";
  };

  elements.closeBtn.addEventListener("click", () => closeModal(elements.historyModal));
  elements.closeStatsBtn.addEventListener("click", () => closeModal(elements.statsModal));

  window.addEventListener("click", event => {
    if (event.target === elements.historyModal) closeModal(elements.historyModal);
    if (event.target === elements.statsModal) closeModal(elements.statsModal);
  });
}

