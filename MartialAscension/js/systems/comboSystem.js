function checkCombo(buffer, comboList, character) {
  if (buffer.history.length === 0) return null;

  let historyLabels = buffer.history.map(h => h.label);
  let currentTime = frameCount;

  let validCombos = comboList.filter(combo => {
    // If combo has no characterSpecific, everyone can use it
    if (!combo.characterSpecific) return true;
    // If combo has characterSpecific, only match that character
    return combo.characterSpecific === character.name;
  });

  // Sort by sequence length
  let sortedCombos = [...validCombos].sort((a, b) => b.sequence.length - a.sequence.length);
  
  for (let combo of sortedCombos) {
    let seq = combo.sequence;
    if (historyLabels.length < seq.length) continue;
    let recentInputs = historyLabels.slice(-seq.length);
    let match = seq.every((val, index) => val === recentInputs[index]);

    if (match) {
      // Timing check
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