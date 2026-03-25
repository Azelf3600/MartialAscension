// Global sound manager used by states/screens.
const soundSystem = {
  // Store all loaded tracks here so we can reuse them without reloading files.
  tracks: {},
  sfx: {},
  currentMusicKey: null,
  musicVolume: 0.35,
  sfxVolume: 0.75,
  initialized: false,
  hasUserInteracted: false,
  // Preloaded one-shot clips per category; clone before play so overlaps do not cut off.
  _punchPool: [],
  _kickPool: [],
  _bodyHitPool: [],
  _blockPool: [],
  _dashPool: [],
  _jumpPool: [],
  _landPool: [],
  _footstepTracks: {},

  // Builds a list of Audio objects from paths (volume set for template clones).
  _loadSfxPool(urls) {
    return urls.map((url) => {
      const clip = new Audio(url);
      clip.volume = this.sfxVolume;
      return clip;
    });
  },

  // Picks one template, clones it, and plays (same file can stack during fast combat).
  _playRandomFromPool(pool) {
    if (!pool || pool.length === 0) return;
    const clip = pool[floor(random(pool.length))];
    const oneShot = clip.cloneNode();
    oneShot.volume = this.sfxVolume;
    const playPromise = oneShot.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => { });
    }
  },

  // Swing audio when a standing/crouch LP or HP window opens.
  playRandomPunchSfx() {
    this.init();
    this._playRandomFromPool(this._punchPool);
  },

  // Swing audio when a standing/crouch LK or HK window opens.
  playRandomKickSfx() {
    this.init();
    this._playRandomFromPool(this._kickPool);
  },

  // Flesh impact after final damage math (includes chip damage through guard).
  playRandomBodyHitSfx() {
    this.init();
    this._playRandomFromPool(this._bodyHitPool);
  },

  // Guard impact when a strike is blocked (ignored for unblockable hits).
  playRandomBlockSfx() {
    this.init();
    this._playRandomFromPool(this._blockPool);
  },

  playRandomDashSfx() {
    this.init();
    this._playRandomFromPool(this._dashPool);
  },

  // Play jump whoosh / takeoff.
  playRandomJumpSfx() {
    this.init();
    this._playRandomFromPool(this._jumpPool);
  },

  // Play landing impact after being airborne.
  playRandomLandSfx() {
    this.init();
    this._playRandomFromPool(this._landPool);
  },

  // Initialize audio assets once (safe to call multiple times).
  init() {
    if (this.initialized) return;

    this.tracks.mainMenu = new Audio("Assets/audio/music/MainMenu-WarBattle.mp3");
    this.tracks.mainMenu.loop = true;
    this.tracks.mainMenu.volume = this.musicVolume;

    this.tracks.blackForest = new Audio("Assets/audio/music/BlackForest-ScaryForest.mp3");
    this.tracks.blackForest.loop = true;
    this.tracks.blackForest.volume = this.musicVolume;

    this.tracks.immortalAncientBattlefield = new Audio("Assets/audio/music/ImmortalAncientBattlefield-AncientMusic.mp3");
    this.tracks.immortalAncientBattlefield.loop = true;
    this.tracks.immortalAncientBattlefield.volume = this.musicVolume;

    this.tracks.swordGodArena = new Audio("Assets/audio/music/SwordGodArena-FightingDrums.mp3");
    this.tracks.swordGodArena.loop = true;
    this.tracks.swordGodArena.volume = this.musicVolume;

    this.sfx.startMatchGong = new Audio("Assets/audio/sfx/StartMatch-Gong.mp3");
    this.sfx.startMatchGong.volume = this.sfxVolume;
    this.sfx.fightVoice = new Audio("Assets/audio/sfx/Fight-VoiceBosch.mp3");
    this.sfx.fightVoice.volume = this.sfxVolume;
    this.sfx.victoryVoice = new Audio("Assets/audio/sfx/Victory-VoiceBosch.mp3");
    this.sfx.victoryVoice.volume = this.sfxVolume;

    //Lucas Tang
    this.sfx.myriadVenomBody = new Audio("Assets/audio/sfx/UniqueAbilities/Lucas Tang/Myriad Venom Body.wav");
    this.sfx.myriadVenomBody.volume = this.sfxVolume;
    this.sfx.netherBlossomDomain = new Audio("Assets/audio/sfx/UniqueAbilities/Lucas Tang/Nether Blossom Domain.wav");
    this.sfx.netherBlossomDomain.volume = this.sfxVolume;
    this.sfx.venomShadowStep = new Audio("Assets/audio/sfx/UniqueAbilities/Lucas Tang/Venom Shadow Step.wav");
    this.sfx.venomShadowStep.volume = this.sfxVolume;
    this.sfx.projectileAbility = new Audio("Assets/audio/sfx/UniqueAbilities/Lucas Tang/ProjectileAbilities.wav");
    this.sfx.projectileAbility.volume = this.sfxVolume;

    // Ethan Li
    this.sfx.whiteWindSword = new Audio("Assets/audio/sfx/UniqueAbilities/Ethan Li/White Wind Sword Q1.wav");
    this.sfx.whiteWindSword.volume = this.sfxVolume;
    this.sfx.unstoppableSword = new Audio("Assets/audio/sfx/UniqueAbilities/Ethan Li/Unstoppable Sword.wav");
    this.sfx.unstoppableSword.volume = this.sfxVolume;
    this.sfx.skySeveringStep = new Audio("Assets/audio/sfx/UniqueAbilities/Ethan Li/Sky Severing Step.wav");
    this.sfx.skySeveringStep.volume = this.sfxVolume;
    this.sfx.heavenfallSlash = new Audio("Assets/audio/sfx/UniqueAbilities/Ethan Li/Heavenfall Sword God Slash.wav");
    this.sfx.heavenfallSlash.volume = this.sfxVolume;
    this.sfx.swordGodJudgment = new Audio("Assets/audio/sfx/UniqueAbilities/Ethan Li/White Gods True Judgement.wav");
    this.sfx.swordGodJudgment.volume = this.sfxVolume;

    // Aaron Shu
    this.sfx.azureDragonScale = new Audio("Assets/audio/sfx/UniqueAbilities/Aaron Shu/Azure Dragon Scale.wav");
    this.sfx.azureDragonScale.volume = this.sfxVolume;
    this.sfx.immortalTortoiseBody = new Audio("Assets/audio/sfx/UniqueAbilities/Aaron Shu/Immortal Tortoise Body.wav");
    this.sfx.immortalTortoiseBody.volume = this.sfxVolume;
    this.sfx.oceanRebirthScripture = new Audio("Assets/audio/sfx/UniqueAbilities/Aaron Shu/Ocean Rebirth Scripture.wav");
    this.sfx.oceanRebirthScripture.volume = this.sfxVolume;
    this.sfx.unstoppableSeaDragon = new Audio("Assets/audio/sfx/UniqueAbilities/Aaron Shu/Unstoppable Sea Dragon.wav");
    this.sfx.unstoppableSeaDragon.volume = this.sfxVolume;
    this.sfx.azureDragonAscension = new Audio("Assets/audio/sfx/UniqueAbilities/Aaron Shu/Azure Dragon Ascension.wav");
    this.sfx.azureDragonAscension.volume = this.sfxVolume;

    // Damon Cheon
    this.sfx.crimsonHeavenAwakening = new Audio("Assets/audio/sfx/UniqueAbilities/Dameon Cheon/Crimson Heaven Awakening.wav");
    this.sfx.crimsonHeavenAwakening.volume = this.sfxVolume;
    this.sfx.heavenSplittingDemonStep = new Audio("Assets/audio/sfx/UniqueAbilities/Dameon Cheon/Heaven Splitting Demon Step.wav");
    this.sfx.heavenSplittingDemonStep.volume = this.sfxVolume;
    this.sfx.heavenShadowReversalStep = new Audio("Assets/audio/sfx/UniqueAbilities/Dameon Cheon/Heaven Shadow Reversal Step.wav");
    this.sfx.heavenShadowReversalStep.volume = this.sfxVolume;
    this.sfx.heavenDevouringAbyss = new Audio("Assets/audio/sfx/UniqueAbilities/Dameon Cheon/Heaven Devouring Abyss.wav");
    this.sfx.heavenDevouringAbyss.volume = this.sfxVolume;
    this.sfx.crimsonHeavenAnnihilation = new Audio("Assets/audio/sfx/UniqueAbilities/Dameon Cheon/Crimson Heaven Annihilation.wav");
    this.sfx.crimsonHeavenAnnihilation.volume = this.sfxVolume;

    // Lucas Tang Ultimate
    this.sfx.poisonRain = new Audio("Assets/audio/sfx/UniqueAbilities/Lucas Tang/Ten Thousand Venoms Flower Rain.wav");
    this.sfx.poisonRain.volume = this.sfxVolume;


    this.sfx.uiSelect = new Audio("Assets/audio/sfx/UISelect.mp3");
    this.sfx.uiSelect.volume = this.sfxVolume;

    this._punchPool = this._loadSfxPool([
      "Assets/audio/sfx/punch/punch_long_whoosh_21.wav",
      "Assets/audio/sfx/punch/punch_long_whoosh_30.wav",
      "Assets/audio/sfx/punch/punch_short_whoosh_16.wav",
      "Assets/audio/sfx/punch/punch_short_whoosh_30.wav"
    ]);
    this._kickPool = this._loadSfxPool([
      "Assets/audio/sfx/kick/kick_long_whoosh_19.wav",
      "Assets/audio/sfx/kick/kick_short_whoosh_12.wav",
      "Assets/audio/sfx/kick/kick_short_whoosh_23.wav"
    ]);
    this._bodyHitPool = this._loadSfxPool([
      "Assets/audio/sfx/bodyhit/body_hit_large_32.wav",
      "Assets/audio/sfx/bodyhit/body_hit_large_44.wav",
      "Assets/audio/sfx/bodyhit/body_hit_large_76.wav",
      "Assets/audio/sfx/bodyhit/body_hit_small_11.wav",
      "Assets/audio/sfx/bodyhit/body_hit_small_20.wav",
      "Assets/audio/sfx/bodyhit/body_hit_small_23.wav",
      "Assets/audio/sfx/bodyhit/body_hit_small_79.wav"
    ]);
    this._blockPool = this._loadSfxPool([
      "Assets/audio/sfx/block/block_small_73.wav",
      "Assets/audio/sfx/block/block_small_69.wav",
      "Assets/audio/sfx/block/block_medium_25.wav",
      "Assets/audio/sfx/block/block_medium_09.wav",
      "Assets/audio/sfx/block/block_large_71.wav",
      "Assets/audio/sfx/block/block_large_59.wav"
    ]);
    this._dashPool = this._loadSfxPool(["Assets/audio/sfx/dash/dash1.wav"]);

    this._jumpPool = this._loadSfxPool(["Assets/audio/sfx/Jump/jump1.wav"]);
    this._landPool = this._loadSfxPool(["Assets/audio/sfx/Land/land1.wav"]);

    this.initialized = true;
  },

  // Play a music track by key; stops previous music if switching tracks.
  playMusic(key) {
    this.init();
    const track = this.tracks[key];
    if (!track) return;

    if (this.currentMusicKey && this.currentMusicKey !== key) {
      this.stopMusic(this.currentMusicKey);
    }

    // Avoid restarting the same track if it is already playing.
    if (this.currentMusicKey === key && !track.paused) return;

    track.volume = this.musicVolume;
    const playPromise = track.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // Browsers may block autoplay until first interaction.
      });
    }
    this.currentMusicKey = key;
  },

  // Stop a specific track or the currently active one.
  stopMusic(key = this.currentMusicKey) {
    if (!key) return;
    const track = this.tracks[key];
    if (!track) return;

    track.pause();
    track.currentTime = 0;
    if (this.currentMusicKey === key) this.currentMusicKey = null;
  },

  // Stop every music track before switching to another background theme.
  stopAllMusic() {
    Object.keys(this.tracks).forEach((key) => {
      const track = this.tracks[key];
      track.pause();
      track.currentTime = 0;
    });
    this.currentMusicKey = null;
  },

  // Play one-shot effects by cloning the source so rapid taps can overlap cleanly.
  playSfx(key) {
    this.init();
    const source = this.sfx[key];
    if (!source) return;

    const oneShot = source.cloneNode();
    oneShot.volume = this.sfxVolume;
    const playPromise = oneShot.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // SFX may be blocked until the first user interaction.
      });
    }
  },

  // Called from input events so browser allows audio playback.
  markUserInteraction() {
    this.hasUserInteracted = true;
  },

  // Starts or resumes a looping footstep audio track for a specific ID.
  // Creates a dedicated Audio instance per character to allow independent overlapping.
  startFootstep(id) {
    this.init();
    if (!this._footstepTracks) this._footstepTracks = {};
    if (!this._footstepTracks[id]) {
      const track = new Audio("Assets/audio/sfx/Footstep.wav");
      track.loop = true;
      track.volume = this.sfxVolume * 0.5;
      this._footstepTracks[id] = track;
    }
    const track = this._footstepTracks[id];
    if (track.paused) {
      const playPromise = track.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    }
  },

  // Pauses the footstep audio track assigned to the given ID.
  stopFootstep(id) {
    if (this._footstepTracks && this._footstepTracks[id]) {
      this._footstepTracks[id].pause();
    }
  }
};
