// ========================================
// LISTENER DASHBOARD
// ========================================

window.listenerApp = {
  currentPlaylist: null,

  init() {
    this.setupNavigation();
    this.renderPlaylists();
    this.setupModals();
  },

  setupNavigation() {
    const discoverLink = document.getElementById('discoverLink');
    const libraryLink = document.getElementById('listenerLibraryLink');
    const discoverView = document.getElementById('discoverView');
    const libraryView = document.getElementById('libraryView');

    discoverLink?.addEventListener('click', (e) => {
      e.preventDefault();
      discoverView.style.display = 'block';
      libraryView.style.display = 'none';
      discoverLink.classList.add('active');
      libraryLink.classList.remove('active');
      this.renderPlaylists();
    });

    libraryLink?.addEventListener('click', (e) => {
      e.preventDefault();
      discoverView.style.display = 'none';
      libraryView.style.display = 'block';
      libraryLink.classList.add('active');
      discoverLink.classList.remove('active');
      this.renderPurchasedPlaylists();
    });
  },

  renderPlaylists() {
    const grid = document.getElementById('listenerPlaylistsGrid');
    if (!grid) return;

    const playlists = dataManager.getPlaylists();
    const user = dataManager.getCurrentUser();

    grid.innerHTML = '';

    playlists.forEach(playlist => {
      const isPurchased = dataManager.isPurchased(user.username, playlist.id);
      const card = this.createPlaylistCard(playlist, isPurchased);
      grid.appendChild(card);
    });
  },

  createPlaylistCard(playlist, isPurchased) {
    const card = document.createElement('div');
    card.className = 'playlist-card';

    const tracks = dataManager.getTracksByPlaylist(playlist.id);
    
    card.innerHTML = `
      <img src="${playlist.cover}" alt="${playlist.name}" class="playlist-cover">
      <div class="playlist-info">
        <h3>${playlist.name}</h3>
        <p class="playlist-artist">${playlist.artist}</p>
        <div class="playlist-stats">
          <span class="playlist-tracks">${tracks.length} tracks</span>
          ${isPurchased 
            ? '<span class="purchased-badge">✓ Purchased</span>'
            : `<span class="playlist-price">₹${playlist.price}</span>`
          }
        </div>
      </div>
    `;

    card.addEventListener('click', () => this.openPlaylistModal(playlist, isPurchased));
    return card;
  },

  renderPurchasedPlaylists() {
    const grid = document.getElementById('purchasedPlaylistsGrid');
    if (!grid) return;

    const user = dataManager.getCurrentUser();
    const purchasedIds = dataManager.getUserPurchases(user.username);
    const playlists = dataManager.getPlaylists().filter(p => purchasedIds.includes(p.id));

    grid.innerHTML = '';

    if (playlists.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🎵</div>
          <h3>No purchases yet</h3>
          <p>Browse and purchase playlists to build your collection</p>
        </div>
      `;
      return;
    }

    playlists.forEach(playlist => {
      const card = this.createPlaylistCard(playlist, true);
      grid.appendChild(card);
    });
  },

  openPlaylistModal(playlist, isPurchased) {
    const modal = document.getElementById('playlistModal');
    if (!modal) return;

    this.currentPlaylist = playlist;
    const tracks = dataManager.getTracksByPlaylist(playlist.id);
    const user = dataManager.getCurrentUser();

    document.getElementById('modalCover').src = playlist.cover;
    document.getElementById('modalPlaylistName').textContent = playlist.name;
    document.getElementById('modalArtistName').textContent = playlist.artist;
    document.getElementById('modalPrice').textContent = isPurchased 
      ? '✓ You own this playlist' 
      : `₹${playlist.price}`;

    const tracksContainer = document.getElementById('modalTracks');
    tracksContainer.innerHTML = '';

    tracks.forEach((track, index) => {
      const isLiked = dataManager.isLiked(track.id, user.username);
      const isLocked = !isPurchased && !track.isDemo;
      const showLikes = track.isDemo; // Only demo tracks show likes
      
      const trackItem = document.createElement('div');
      trackItem.className = `track-item ${isLocked ? 'locked' : ''}`;
      trackItem.innerHTML = `
        <span class="track-number">${index + 1}</span>
        <img src="${track.cover}" alt="${track.title}" class="track-cover">
        <div class="track-info">
          <div class="track-title">${track.title} ${isLocked ? '🔒' : ''}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
        ${showLikes ? `
        <div class="track-likes">
          <button class="like-btn ${isLiked ? 'liked' : ''}" data-track-id="${track.id}">
            ❤️
          </button>
          <span>${track.likes || 0}</span>
        </div>
        ` : '<div class="track-likes"></div>'}
        <button class="play-btn ${isLocked ? 'btn-locked' : ''}" data-track-id="${track.id}">▶</button>
      `;

      // Like button handler (only for demo tracks)
      if (showLikes) {
        const likeBtn = trackItem.querySelector('.like-btn');
        likeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const updatedTrack = dataManager.toggleLike(track.id, user.username);
          likeBtn.classList.toggle('liked');
          likeBtn.nextElementSibling.textContent = updatedTrack.likes;
        });
      }

      // Play button handler
      const playBtn = trackItem.querySelector('.play-btn');
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isLocked) {
          alert('🔒 Purchase this playlist to unlock all tracks!');
          return;
        }
        if (window.musicPlayer && track.src) {
          window.musicPlayer.loadTrack(track);
          window.musicPlayer.play();
        }
      });

      tracksContainer.appendChild(trackItem);
    });

    const purchaseBtn = document.getElementById('modalPurchase');
    if (isPurchased) {
      purchaseBtn.style.display = 'none';
    } else {
      purchaseBtn.style.display = 'block';
      purchaseBtn.onclick = () => this.openPaymentModal();
    }

    modal.classList.add('active');
  },

  setupModals() {
    const playlistModal = document.getElementById('playlistModal');
    const paymentModal = document.getElementById('paymentModal');

    // Close buttons
    document.querySelectorAll('.modal-close, #modalClose').forEach(btn => {
      btn.addEventListener('click', () => {
        playlistModal.classList.remove('active');
      });
    });

    document.getElementById('paymentClose')?.addEventListener('click', () => {
      paymentModal.classList.remove('active');
    });

    // Click outside to close
    [playlistModal, paymentModal].forEach(modal => {
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Payment form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
      paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.completePurchase();
      });
    }
  },

  openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (!modal || !this.currentPlaylist) return;

    document.getElementById('paymentPlaylistName').textContent = this.currentPlaylist.name;
    document.getElementById('paymentArtistName').textContent = this.currentPlaylist.artist;
    document.getElementById('paymentAmount').textContent = `₹${this.currentPlaylist.price}`;

    document.getElementById('playlistModal').classList.remove('active');
    modal.classList.add('active');
  },

  completePurchase() {
    const user = dataManager.getCurrentUser();
    if (!this.currentPlaylist) return;

    dataManager.addPurchase(user.username, this.currentPlaylist.id);

    document.getElementById('paymentModal').classList.remove('active');
    
    this.showNotification(`Successfully purchased ${this.currentPlaylist.name}!`);
    this.renderPlaylists();
    this.currentPlaylist = null;
  },

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
};
