function checkCombo(buffer, comboList) {
  if (buffer.history.length === 0) return null;

  let historyLabels = buffer.history.map(h => h.label);
  let currentTime = frameCount;
  
  for (let combo of comboList) {
    let seq = combo.sequence;
    if (historyLabels.length < seq.length) continue;

    let recentInputs = historyLabels.slice(-seq.length);
    let match = seq.every((val, index) => val === recentInputs[index]);

    if (match) {
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