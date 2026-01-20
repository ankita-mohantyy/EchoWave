// ========================================
// MUSIC PLAYER
// ========================================

window.musicPlayer = {
  audio: null,
  currentTrack: null,
  playlist: [],
  currentIndex: 0,

  init() {
    this.audio = document.getElementById('audio');
    if (!this.audio) return;

    this.setupControls();
    this.setupProgressBar();
    this.setupVolumeBar();
  },

  setupControls() {
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    playBtn?.addEventListener('click', () => this.togglePlay());
    prevBtn?.addEventListener('click', () => this.previous());
    nextBtn?.addEventListener('click', () => this.next());

    // Audio events
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
  },

  setupProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    progressBar.addEventListener('input', (e) => {
      const time = (e.target.value / 100) * this.audio.duration;
      this.audio.currentTime = time;
    });
  },

  setupVolumeBar() {
    const volumeBar = document.getElementById('volumeBar');
    if (!volumeBar) return;

    volumeBar.addEventListener('input', (e) => {
      this.audio.volume = e.target.value;
    });
  },

  loadTrack(track) {
    this.currentTrack = track;
    this.audio.src = track.src;

    document.getElementById('playerTitle').textContent = track.title;
    document.getElementById('playerArtist').textContent = track.artist;
    document.getElementById('playerCover').src = track.cover;

    this.updatePlayButton(false);
  },

  loadPlaylist(tracks, startIndex = 0) {
    this.playlist = tracks;
    this.currentIndex = startIndex;
    if (tracks.length > 0) {
      this.loadTrack(tracks[startIndex]);
    }
  },

  play() {
    this.audio.play();
    this.updatePlayButton(true);
  },

  pause() {
    this.audio.pause();
    this.updatePlayButton(false);
  },

  togglePlay() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  },

  previous() {
    if (this.playlist.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
      this.loadTrack(this.playlist[this.currentIndex]);
      this.play();
    }
  },

  next() {
    if (this.playlist.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
      this.loadTrack(this.playlist[this.currentIndex]);
      this.play();
    }
  },

  updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const currentTime = document.getElementById('currentTime');

    if (progressBar && this.audio.duration) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      progressBar.value = progress;
    }

    if (currentTime) {
      currentTime.textContent = this.formatTime(this.audio.currentTime);
    }
  },

  updateDuration() {
    const duration = document.getElementById('duration');
    if (duration) {
      duration.textContent = this.formatTime(this.audio.duration);
    }
  },

  updatePlayButton(isPlaying) {
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
      playBtn.textContent = isPlaying ? '⏸' : '▶';
    }
  },

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};
