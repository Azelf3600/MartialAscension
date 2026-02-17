function checkCombo(buffer, comboList) {
  if (buffer.history.length === 0) return null;

  let historyLabels = buffer.history.map(h => h.label);
  let currentTime = frameCount;
  
  let sortedCombos = [...comboList].sort((a, b) => b.sequence.length - a.sequence.length);
  
  for (let combo of sortedCombos) {
    let seq = combo.sequence;
    if (historyLabels.length < seq.length) continue;

    // Get the last X inputs to match the sequence length
    let recentInputs = historyLabels.slice(-seq.length);
    let match = seq.every((val, index) => val === recentInputs[index]);

    if (match) {
      // TIMING CHECK: Ensure the first move of the combo wasn't too long ago
      let firstInputOfCombo = buffer.history[buffer.history.length - seq.length];
      let timeDifference = currentTime - firstInputOfCombo.frame;

      if (timeDifference < 60) {
        buffer.history = [];
        return combo;
      }
    }
  }
  return null;
}