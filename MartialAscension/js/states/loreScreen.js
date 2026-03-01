// Lore Screen State
let loreText = "";
let loreTextFull = "";
let loreTextIndex = 0;
let loreTypeSpeed = 2; // Characters per frame (adjust for speed)
let loreTypingComplete = false;
let loreSkipPromptAlpha = 0;

// Lore text data for each character's chapters
const LORE_TEXTS = {
  // Ethan Li (Index 0)
  0: [
    "Ethan Li was born the Holy Son of the Sword God Palace, the supreme sect of the righteous path. Every five years, the Grand Martial Conclave gathered the heirs of illustrious clans and sacred sects to exchange Dao and test destiny. Upon its final stage, Ethan Li crossed blades with his rival and sworn brother, Lucas Tang, the prodigy fated to become the Ten Thousand Poison Sovereign.",
    
    "As the years flowed like an endless river, Ethan Li ascended into the ranks of the world's supreme experts beneath One God, alongside Two Saints, Three Sovereigns, and Four Kings. During an expedition into the Black Forest, where ancient beasts roamed and miasma veiled the heavens, he encountered the infamous monarch of the unorthodox path the Azure Dragon Fist King, Aaron Shu.",
    
    "After the earth-shaking battle within the Black Forest, Ethan Li proved why the Martial World hailed him as the White Wind Sword Saint of the Sword God Palace. Yet destiny offered no rest, for soon the Crimson Heaven Demon God descended, leading the Heavenly Demon Cult in a tide meant to drown the righteous path in blood.",
    
    "With sword intent that split heaven and gale that scattered clouds, Ethan Li struck down the Crimson Heaven Demon God and expelled the demonic forces from the mortal realm. From that day onward, the martial world acknowledged him as the Number One Sword Under Heaven, the White Wind Sword Saint."
  ],
  
  // Lucas Tang (Index 1)
  1: [
    "Lucas Tang was born bearing the Myriad Venom Body, a sacred physique whispered of in poison scriptures. At twelve years of age, he journeyed with his clan to the Raging Tide Gate in pursuit of a rare medicinal treasure. The old sect master decreed that the treasure would be granted only if Lucas Tang could defeat his prized disciple Aaron Shu, the destined Azure Dragon Fist King.",
    
    "During the Grand Martial Conclave hosted by the Sword God Palace, Lucas Tang displayed brilliance that shook the younger generation and brought immeasurable glory to the Poison Tang Clan. Upon the final arena, he faced his closest rival and dearest friend Ethan Li, the White Wind Sword Saint of a distant future.",
    
    "When the Heavenly Demon Cult swept across the land, the Poison Tang Clan stood at the forefront of resistance beside the great families of the righteous path. Yet when the Crimson Heaven Demon God himself descended, even veteran masters felt their Dao-hearts tremble only Lucas Tang stepped forward, poison qi surging like a sea of death.",
    
    "Though gravely wounded, Lucas Tang held his ground against the Demon God. As darkness closed in, a streak of white light cut through the battlefield and a heavenly gale swept the skies. Before losing consciousness, Lucas Tang knew the tides had turned. When he awoke, the demonic forces had vanished, and the righteous path stood restored. As he emerged from seclusion, the world greeted him with thunderous acclaim—he had solidified his legend as this generation's Ten Thousand Poison Sovereign."
  ],
  
  // Aaron Shu (Index 2)
  2: [
    "Aaron Shu was born amidst the dust of the streets, a nameless child sold into fate, until the Great Leader of the Raging Tide Gate discerned extraordinary talent within him and accepted him as a disciple. Years later, envoys of the Poison Tang Clan arrived seeking a rare medicinal treasure. The old sect master ordered Aaron Shu to face their young master Lucas Tang, the fated child to become the Ten Thousand Poison Sovereign.",
    
    "A decade passed since that fateful duel. Aaron Shu rose to prominence within the unorthodox path, earning the fearsome title of Azure Dragon Fist King. While tempering his body within the perilous Black Forest, he encountered an expedition of the Sword God Palace and met its shining pillar the White Wind Sword Saint. When the pinnacles of righteous and unorthodox paths meet, conflict is written by heaven.",
    
    "Not long after their cataclysmic clash, the Heavenly Demon Cult descended upon the world, and the Raging Tide Gate became one of the first sects to fall. Consumed by fury and grief, Aaron Shu challenged the Crimson Heaven Demon God beneath blood-red skies.",
    
    "Though he battled with dragon's fury, Aaron Shu was forced to retreat, barely preserving his life. Standing amidst the ruins of his sect, he raised his fist toward the heavens and swore a Dao-oath that he would return, and the Crimson Heaven Demon God would pay in blood."
  ],
  
  // Damon Cheon (Index 3)
  3: [
    "Damon Cheon carved his path to supremacy through slaughter, ascending the demonic throne beneath a sky dyed crimson by his own hands. With scarlet eyes and blood-bright hair, he claimed the title of Crimson Heaven Demon God. He turned his gaze toward the righteous path and devoured sect after sect until a rage-filled figure, the Azure Dragon Fist King, dared to challenge him.",
    
    "He waged war against the entire martial world, and though the great clans resisted with desperate valor, Damon Cheon regarded them as insects defying fate. When boredom overtook him, he stepped personally onto the battlefield. The heavens dimmed, time itself seemed to stagnate, and the world turned gray before being painted red with carnage. Amidst universal terror, only one man advanced Lucas Tang, the Ten Thousand Poison Sovereign.",
    
    "After countless exchanges that shook the firmament, Damon Cheon struck Lucas Tang with a devastating blow and prepared to end him. Yet a sudden gale roared across the battlefield, and a figure clad in radiant white descended from the heavens, swords pointed toward Damon Cheon. For the first time in years, the Crimson Heaven Demon God felt danger coil around his heart.",
    
    "In a brutal clash against the White Wind Sword Saint, Damon Cheon endured the descent of the White God's True Judgment and escaped only by invoking the Heaven-Shadow Reversal Step. Gravely wounded, he ordered his forces to retreat to their demonic stronghold. Coughing blood beneath a shattered sky, he swore an oath that he would return, and the head of the White Wind Sword Saint would hang beneath the Crimson Heavens."
  ]
};

function initLoreScreen() {
  // Get the full text for this chapter
  loreTextFull = LORE_TEXTS[campaignPlayerChar][campaignProgress];
  
  // Reset typewriter state
  loreText = "";
  loreTextIndex = 0;
  loreTypingComplete = false;
  loreSkipPromptAlpha = 0;
  
  console.log(`Lore Screen: Chapter ${campaignProgress + 1} for ${FIGHTERS[campaignPlayerChar].name}`);
}

function drawLoreScreen() {
  background(0);
  
  // ══════════════════════════════════════════════════════
  // BACKGROUND IMAGE (scaled to fit)
  // ══════════════════════════════════════════════════════
  
  let playerData = FIGHTERS[campaignPlayerChar];
  let chapterImg = playerData.loreChapters[campaignProgress].img;
  
  if (chapterImg) {
    push();
    imageMode(CENTER);
        
    let scale = Math.min(width / chapterImg.width, height / chapterImg.height);
    let imgW = chapterImg.width * scale;
    let imgH = chapterImg.height * scale;
    
    image(chapterImg, width / 2, height / 2, imgW, imgH);
    pop();
  }
  
  // ══════════════════════════════════════════════════════
  // TYPEWRITER EFFECT UPDATE
  // ══════════════════════════════════════════════════════
  
  if (!loreTypingComplete && loreTextIndex < loreTextFull.length) {
    // Add characters per frame (speed control)
    for (let i = 0; i < loreTypeSpeed; i++) {
      if (loreTextIndex < loreTextFull.length) {
        loreText += loreTextFull.charAt(loreTextIndex);
        loreTextIndex++;
      }
    }
    
    // Check if typing finished
    if (loreTextIndex >= loreTextFull.length) {
      loreTypingComplete = true;
    }
  }
  
  // ══════════════════════════════════════════════════════
  // TEXTBOX BACKGROUND (Bottom third of screen)
  // ══════════════════════════════════════════════════════
  
  push();
  
  let boxX = width * 0.05;
  let boxY = height * 0.70;
  let boxW = width * 0.9;
  let boxH = height * 0.28;
  
  // Semi-transparent black box
  fill(0, 200);
  stroke(255, 255, 255, 150);
  strokeWeight(3);
  rectMode(CORNER);
  rect(boxX, boxY, boxW, boxH, 10);
  
  // Inner border (ornamental)
  noFill();
  stroke(200, 200, 220, 100);
  strokeWeight(1);
  rect(boxX + 10, boxY + 10, boxW - 20, boxH - 20, 5);
  
  pop();
  
  // ══════════════════════════════════════════════════════
  // CHAPTER TITLE (Above textbox)
  // ══════════════════════════════════════════════════════
  
  push();
  textAlign(LEFT, BOTTOM);
  textFont(metalFont);
  fill(255, 215, 0); // Gold color
  noStroke();
  textSize(width * 0.025);
  text(`CHAPTER ${campaignProgress + 1}`, boxX + 20, boxY - 10);
  pop();
  
  // ══════════════════════════════════════════════════════
  // LORE TEXT (Inside textbox with word wrap)
  // ══════════════════════════════════════════════════════
  
  push();
  textAlign(LEFT, TOP);
  textFont(metalFont);
  fill(255);
  noStroke();
  textSize(width * 0.0165); // Readable size
  
  let textX = boxX + 30;
  let textY = boxY + 25;
  let textMaxW = boxW - 60;
  
  // Word wrap the typed text
  let words = loreText.split(' ');
  let line = '';
  let lineY = textY;
  let lineHeight = width * 0.022; // Line spacing
  
  for (let i = 0; i < words.length; i++) {
    let testLine = line + words[i] + ' ';
    let testWidth = textWidth(testLine);
    
    if (testWidth > textMaxW && i > 0) {
      // Draw current line
      text(line, textX, lineY);
      line = words[i] + ' ';
      lineY += lineHeight;
      
      // Stop if text exceeds box height
      if (lineY > boxY + boxH - 30) {
        break;
      }
    } else {
      line = testLine;
    }
  }
  
  // Draw last line
  if (lineY <= boxY + boxH - 30) {
    text(line, textX, lineY);
  }
  
  pop();
  
  // ══════════════════════════════════════════════════════
  // PROMPT (Bottom right of textbox)
  // ══════════════════════════════════════════════════════
  
  push();
  textAlign(RIGHT, BOTTOM);
  textFont(metalFont);
  noStroke();
  textSize(width * 0.015);
  
  // Pulsing alpha effect
  loreSkipPromptAlpha = 150 + sin(frameCount * 0.1) * 105;
  
  if (!loreTypingComplete) {
    // Still typing - show "Press SPACE to skip"
    fill(255, 255, 100, loreSkipPromptAlpha); // Yellow
    text("PRESS SPACE TO SKIP", boxX + boxW - 20, boxY + boxH - 15);
  } else {
    // Typing complete - show "Press SPACE to continue"
    fill(100, 255, 100, loreSkipPromptAlpha); // Green
    text("PRESS SPACE TO CONTINUE", boxX + boxW - 20, boxY + boxH - 15);
  }
  
  pop();
  
  // ══════════════════════════════════════════════════════
  // ESC TO MENU (Top left corner for testing)
  // ══════════════════════════════════════════════════════
  
  push();
  textAlign(LEFT, TOP);
  textFont(metalFont);
  fill(150);
  noStroke();
  textSize(width * 0.012);
  text("ESC - Return to Menu", 20, 20);
  pop();
}

function handleLoreScreenInput(key, keyCode) {
  // ══════════════════════════════════════════════════════
  // SPACE - Skip typing OR continue to next screen
  // ══════════════════════════════════════════════════════
  
  if (key === ' ' || keyCode === ENTER) {
    if (!loreTypingComplete) {
      // ✅ SKIP - Complete typing instantly
      loreText = loreTextFull;
      loreTextIndex = loreTextFull.length;
      loreTypingComplete = true;
      console.log("Lore text skipped!");
    } else {
      // ✅ CONTINUE - Go to next screen
      if (campaignProgress >= 3) {
        // Final chapter - go to victory screen
        console.log("Campaign complete! Going to WIN_SCREEN");
        currentState = GAME_STATE.WIN_SCREEN;
      } else {
        // More matches remain - go to loading screen
        console.log("Going to next match...");
        currentState = GAME_STATE.LOADING_MATCH;
      }
    }
  }
  
  // ══════════════════════════════════════════════════════
  // ESC - Return to menu (testing)
  // ══════════════════════════════════════════════════════
  
  if (keyCode === ESCAPE) {
    currentState = GAME_STATE.MENU;
    campaignProgress = 0;
    console.log("Returned to menu from lore screen");
  }
}