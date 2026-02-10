function checkCombo(buffer, comboList) {
  if (buffer.history.length === 0) return null;

  let historyLabels = buffer.history.map(h => h.label);
  let currentTime = frameCount;
  
  for (let combo of comboList) {
    let seq = combo.sequence;
    if (historyLabels.length < seq.length) continue;

    // 1. Get the last X inputs to match the sequence length
    let recentInputs = historyLabels.slice(-seq.length);
    let match = seq.every((val, index) => val === recentInputs[index]);

    if (match) {
      // 2. TIMING CHECK: Ensure the first move of the combo wasn't too long ago
      // This prevents "stale" inputs from triggering a combo 2 seconds later.
      let firstInputOfCombo = buffer.history[buffer.history.length - seq.length];
      let timeDifference = currentTime - firstInputOfCombo.frame;

      if (timeDifference < 60) { // Must complete the sequence within 60 frames (1 sec)
        buffer.history = []; // Success! Clear the history
        return combo;
      }
    }
  }
  return null;
}