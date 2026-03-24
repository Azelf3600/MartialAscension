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
      playPromise.catch(() => {});
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
  }
};
