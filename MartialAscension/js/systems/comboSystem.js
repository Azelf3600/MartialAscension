function checkCombo(buffer, comboList, character) {
  if (buffer.history.length === 0) return null;

  let historyLabels = buffer.history.map(h => h.label);
  let currentTime = frameCount;

  // ✅ FIX: Filter combos to only ones valid for this character
  let validCombos = comboList.filter(combo => {
    // If combo has no characterSpecific, everyone can use it
    if (!combo.characterSpecific) return true;
    // If combo has characterSpecific, only match that character
    return combo.characterSpecific === character.name;
  });

  // Sort by sequence length (longest first) to prevent partial matches
  let sortedCombos = [...validCombos].sort((a, b) => b.sequence.length - a.sequence.length);
  
  for (let combo of sortedCombos) {
    let seq = combo.sequence;
    if (historyLabels.length < seq.length) continue;

    // Get the last X inputs to match the sequence length
    let recentInputs = historyLabels.slice(-seq.length);
    let match = seq.every((val, index) => val === recentInputs[index]);

    if (match) {
      // TIMING CHECK: Ensure the first move wasn't too long ago
      let firstInputOfCombo = buffer.history[buffer.history.length - seq.length];
      let timeDifference = currentTime - firstInputOfCombo.frame;

      if (timeDifference < 60) {
        buffer.history = []; // Clear buffer on successful match
        return combo;
      }
    }
  }
  return null;
}