// ========================================
// ARTIST DASHBOARD
// ========================================

window.artistApp = {
  currentArtist: null,
  currentPlaylist: null,

  init() {
    const user = dataManager.getCurrentUser();
    this.currentArtist = user.username;
    
    this.setupNavigation();
    this.loadArtistData();
    this.setupUploadForm();
  },

  setupNavigation() {
    const playlistLink = document.getElementById('myPlaylistLink');
    const uploadLink = document.getElementById('uploadLink');
    const playlistView = document.getElementById('artistPlaylistView');
    const uploadView = document.getElementById('uploadView');

    playlistLink?.addEventListener('click', (e) => {
      e.preventDefault();
      playlistView.style.display = 'block';
      uploadView.style.display = 'none';
      playlistLink.classList.add('active');
      uploadLink.classList.remove('active');
    });

    uploadLink?.addEventListener('click', (e) => {
      e.preventDefault();
      playlistView.style.display = 'none';
      uploadView.style.display = 'block';
      uploadLink.classList.add('active');
      playlistLink.classList.remove('active');
      
      // Check if artist has existing playlist
      this.updateUploadForm();
    });
  },

  loadArtistData() {
    // Pre-fill artist name in upload form
    const artistNameInput = document.getElementById('trackArtist');
    if (artistNameInput && !artistNameInput.value) {
      artistNameInput.value = this.currentArtist;
    }

    // Find or create playlist for this artist
    const playlists = dataManager.getPlaylists();
    let playlist = playlists.find(p => p.artist.toLowerCase() === this.currentArtist.toLowerCase());

    if (!playlist) {
      // Show empty state
      this.showEmptyState();
    } else {
      this.currentPlaylist = playlist;
      this.renderPlaylist();
    }
  },

  showEmptyState() {
    const tracksList = document.getElementById('artistTracksList');
    if (!tracksList) return;

    tracksList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🎤</div>
        <h3>No tracks yet</h3>
        <p>Upload your first track to create your playlist</p>
      </div>
    `;
  },

  renderPlaylist() {
    if (!this.currentPlaylist) return;

    document.getElementById('artistPlaylistTitle').textContent = this.currentPlaylist.name;
    
    const tracks = dataManager.getTracksByPlaylist(this.currentPlaylist.id);
    const totalLikes = tracks.reduce((sum, track) => sum + (track.likes || 0), 0);
    
    document.getElementById('artistPlaylistSubtitle').textContent = 
      `${tracks.length} tracks • ${totalLikes} total likes`;

    this.renderTracks(tracks);
  },

  renderTracks(tracks) {
    const tracksList = document.getElementById('artistTracksList');
    if (!tracksList) return;

    if (tracks.length === 0) {
      this.showEmptyState();
      return;
    }

    tracksList.innerHTML = '';

    tracks.forEach((track, index) => {
      const trackItem = document.createElement('div');
      trackItem.className = 'track-item';
      trackItem.innerHTML = `
        <span class="track-number">${index + 1}</span>
        <img src="${track.cover}" alt="${track.title}" class="track-cover">
        <div class="track-info">
          <div class="track-title">${track.title}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
        <div class="track-likes">
          <span>❤️</span>
          <span>${track.likes || 0} likes</span>
        </div>
        <button class="play-btn" data-track-id="${track.id}">▶</button>
      `;

      // Play button handler
      const playBtn = trackItem.querySelector('.play-btn');
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.musicPlayer) {
          window.musicPlayer.loadTrack(track);
          window.musicPlayer.play();
        }
      });

      tracksList.appendChild(trackItem);
    });
  },

  updateUploadForm() {
    const addToExistingGroup = document.getElementById('addToExistingGroup');
    const addToExisting = document.getElementById('addToExisting');

    if (this.currentPlaylist) {
      addToExistingGroup.style.display = 'block';
      addToExisting.checked = true;
    } else {
      addToExistingGroup.style.display = 'none';
    }
  },

  setupUploadForm() {
    const form = document.getElementById('uploadForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleUpload();
    });
  },

  handleUpload() {
    const title = document.getElementById('trackTitle').value;
    const artist = document.getElementById('trackArtist').value;
    const trackFile = document.getElementById('trackFile').files[0];
    const trackCover = document.getElementById('trackCover').files[0];
    const artistCover = document.getElementById('artistCover').files[0];
    const playlistCover = document.getElementById('playlistCover').files[0];
    const addToExisting = document.getElementById('addToExisting')?.checked || false;
    const trackType = document.querySelector('input[name="trackType"]:checked').value;
    const isDemo = trackType === 'demo';

    if (!trackFile) {
      alert('Please select an audio file');
      return;
    }

    // Process all images first
    const imagePromises = {
      track: trackCover ? this.readFileAsDataURL(trackCover) : Promise.resolve(null),
      artist: artistCover ? this.readFileAsDataURL(artistCover) : Promise.resolve(null),
      playlist: playlistCover ? this.readFileAsDataURL(playlistCover) : Promise.resolve(null),
      audio: this.readFileAsDataURL(trackFile)
    };

    Promise.all([
      imagePromises.track,
      imagePromises.artist, 
      imagePromises.playlist,
      imagePromises.audio
    ]).then(([trackCoverUrl, artistCoverUrl, playlistCoverUrl, audioSrc]) => {
      // Determine final cover priority: trackCover > artistCover > playlistCover > default
      let finalTrackCover = trackCoverUrl || artistCoverUrl || playlistCoverUrl || `assets/images/artists/${artist.replace(/\s+/g, '')}.jpg`;
      let finalArtistCover = artistCoverUrl || finalTrackCover;
      let finalPlaylistCover = playlistCoverUrl || artistCoverUrl || trackCoverUrl || `assets/images/playlists/${artist.replace(/\s+/g, '')}-playlist.jpg`;

      this.completeUpload(title, artist, audioSrc, finalTrackCover, finalArtistCover, finalPlaylistCover, addToExisting, isDemo);
    });
  },

  readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  completeUpload(title, artist, audioSrc, trackCover, artistCover, playlistCover, addToExisting, isDemo) {
    // Check if playlist already exists for this artist
    const allPlaylists = dataManager.getPlaylists();
    let existingPlaylist = allPlaylists.find(p => p.artist.toLowerCase() === artist.toLowerCase());
    
    let playlistId;
    let playlistName;

    if (existingPlaylist && (addToExisting || !this.currentPlaylist)) {
      // Add to existing playlist
      playlistId = existingPlaylist.id;
      playlistName = existingPlaylist.name;
      this.currentPlaylist = existingPlaylist;
      
      let needsUpdate = false;
      
      // Update artist cover if provided
      if (artistCover && !artistCover.startsWith('assets/images/')) {
        existingPlaylist.artistCover = artistCover;
        needsUpdate = true;
      }
      
      // Update playlist cover if provided and is not default
      if (playlistCover && !playlistCover.startsWith('assets/images/playlists/')) {
        existingPlaylist.cover = playlistCover;
        needsUpdate = true;
        
        // Update all existing tracks in this playlist with new cover
        const allTracks = dataManager.getTracks();
        allTracks.forEach(track => {
          if (track.playlistId === playlistId && artistCover && !track.cover.startsWith('data:')) {
            track.cover = artistCover || playlistCover;
          }
        });
        localStorage.setItem('echowave_tracks', JSON.stringify(allTracks));
      }
      
      // Save playlist updates if any changes were made
      if (needsUpdate) {
        localStorage.setItem('echowave_playlists', JSON.stringify(allPlaylists));
      }
    } else if (!existingPlaylist) {
      // Create new playlist only if none exists for this artist
      const adjective = dataManager.generatePlaylistAdjective();
      playlistName = `${artist}'s ${adjective}`;

      const newPlaylist = {
        name: playlistName,
        artist: artist,
        cover: playlistCover,
        artistCover: artistCover && !artistCover.startsWith('assets/images/') ? artistCover : null,
        price: 499,
        tracks: []
      };

      const createdPlaylist = dataManager.addPlaylist(newPlaylist);
      playlistId = createdPlaylist.id;
      this.currentPlaylist = createdPlaylist;
    } else {
      // This shouldn't happen, but fallback to current playlist
      playlistId = this.currentPlaylist.id;
      playlistName = this.currentPlaylist.name;
    }

    // Add track with proper cover hierarchy
    const newTrack = {
      title: title,
      artist: artist,
      cover: trackCover, // Already prioritized in handleUpload
      src: audioSrc,
      playlistId: playlistId,
      isDemo: isDemo,
      likes: 0,
      likedBy: []
    };

    dataManager.addTrack(newTrack);

    // Show success message
    const trackTypeText = isDemo ? 'Demo track' : 'Locked track';
    alert(`✓ ${trackTypeText} uploaded successfully!\n\nPlaylist: ${playlistName}\nTrack: ${title}`);

    // Reset form and refresh
    document.getElementById('uploadForm').reset();
    
    // Refresh artist data to reload playlist
    this.currentArtist = artist;
    this.loadArtistData();
    
    // Switch back to playlist view
    document.getElementById('artistPlaylistView').style.display = 'block';
    document.getElementById('uploadView').style.display = 'none';
    document.getElementById('myPlaylistLink').classList.add('active');
    document.getElementById('uploadLink').classList.remove('active');
  }
};
