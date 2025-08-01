// src/utils/timeUtils.js

/**
 * Returns true if the date is within the threshold in minutes from now.
 * @param {string|Date} timestamp - The date/time to check.
 * @param {number} thresholdMinutes - Minutes considered "recent" (default: 15).
 * @returns {boolean}
 */
export function isRecent(timestamp, thresholdMinutes = 15) {
  if (!timestamp) return false;

    const diffInMs = new Date() - new Date(timestamp);
    const diffInMinutes = diffInMs / (1000 * 60);

  return diffInMinutes < thresholdMinutes;
}
