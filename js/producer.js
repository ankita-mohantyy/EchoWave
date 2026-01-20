// ========================================
// PRODUCER DASHBOARD
// ========================================

window.producerApp = {
  currentArtist: null,

  init() {
    this.setupNavigation();
    this.renderArtists();
    this.setupModals();
  },

  setupNavigation() {
    const talentLink = document.getElementById('talentLink');
    const analyticsLink = document.getElementById('analyticsLink');
    const discoveryView = document.getElementById('producerDiscoveryView');
    const analyticsView = document.getElementById('analyticsView');

    talentLink?.addEventListener('click', (e) => {
      e.preventDefault();
      discoveryView.style.display = 'block';
      analyticsView.style.display = 'none';
      talentLink.classList.add('active');
      analyticsLink.classList.remove('active');
      this.renderArtists();
    });

    analyticsLink?.addEventListener('click', (e) => {
      e.preventDefault();
      discoveryView.style.display = 'none';
      analyticsView.style.display = 'block';
      analyticsLink.classList.add('active');
      talentLink.classList.remove('active');
      this.renderAnalytics();
    });
  },

  renderArtists() {
    const grid = document.getElementById('producerArtistsGrid');
    if (!grid) return;

    const artists = dataManager.getArtists();
    grid.innerHTML = '';

    artists.forEach(artist => {
      const card = this.createArtistCard(artist);
      grid.appendChild(card);
    });
  },

  createArtistCard(artist) {
    const card = document.createElement('div');
    card.className = 'artist-card';

    card.innerHTML = `
      <img src="${artist.cover}" alt="${artist.name}" class="artist-avatar-img">
      <h3 class="artist-name">${artist.name}</h3>
      <p class="artist-playlist-name">${artist.playlistName}</p>
      <div class="artist-metrics">
        <div class="metric">
          <h4>${artist.trackCount}</h4>
          <p>Tracks</p>
        </div>
        <div class="metric">
          <h4>${artist.totalLikes}</h4>
          <p>Likes</p>
        </div>
      </div>
    `;

    card.addEventListener('click', () => this.openArtistModal(artist));
    return card;
  },

  openArtistModal(artist) {
    const modal = document.getElementById('artistModal');
    if (!modal) return;

    this.currentArtist = artist;
    const playlist = dataManager.getPlaylistById(artist.playlistId);
    const tracks = dataManager.getTracksByPlaylist(artist.playlistId);

    document.getElementById('artistModalName').textContent = artist.name;
    document.getElementById('artistModalPlaylist').textContent = artist.playlistName;
    document.getElementById('artistModalTrackCount').textContent = artist.trackCount;
    document.getElementById('artistModalLikes').textContent = artist.totalLikes;

    const tracksContainer = document.getElementById('artistModalTracks');
    tracksContainer.innerHTML = '';

    tracks.forEach((track, index) => {
      const trackItem = document.createElement('div');
      trackItem.className = 'track-item';
      const showLikes = track.isDemo; // Only demo tracks show likes
      
      trackItem.innerHTML = `
        <span class="track-number">${index + 1}</span>
        <img src="${track.cover}" alt="${track.title}" class="track-cover">
        <div class="track-info">
          <div class="track-title">${track.title}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
        ${showLikes ? `
        <div class="track-likes">
          <span>❤️</span>
          <span>${track.likes || 0} likes</span>
        </div>
        ` : '<div class="track-likes"></div>'}
      `;

      tracksContainer.appendChild(trackItem);
    });

    modal.classList.add('active');
  },

  setupModals() {
    const modal = document.getElementById('artistModal');
    const closeBtn = document.getElementById('artistModalCloseBtn');
    const closeButtonBottom = document.getElementById('artistModalClose');
    const contactBtn = document.getElementById('contactArtistBtn');

    closeBtn?.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    closeButtonBottom?.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Contact Artist button
    contactBtn?.addEventListener('click', () => {
      this.openContactModal();
    });

    // Setup contact modal
    this.setupContactModal();
  },

  openContactModal() {
    const contactModal = document.getElementById('contactModal');
    const artistModal = document.getElementById('artistModal');
    
    if (!contactModal || !this.currentArtist) return;

    // Set artist name in contact form
    document.getElementById('contactArtistName').textContent = this.currentArtist.name;
    
    // Hide artist modal and show contact modal
    artistModal.classList.remove('active');
    contactModal.classList.add('active');
  },

  setupContactModal() {
    const contactModal = document.getElementById('contactModal');
    const contactForm = document.getElementById('contactForm');
    const closeBtn = document.getElementById('contactModalCloseBtn');
    const cancelBtn = document.getElementById('contactModalCancel');

    closeBtn?.addEventListener('click', () => {
      contactModal.classList.remove('active');
      // Return to artist modal
      document.getElementById('artistModal').classList.add('active');
    });

    cancelBtn?.addEventListener('click', () => {
      contactModal.classList.remove('active');
      contactForm.reset();
      // Return to artist modal
      document.getElementById('artistModal').classList.add('active');
    });

    contactModal?.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        contactModal.classList.remove('active');
        document.getElementById('artistModal').classList.add('active');
      }
    });

    // Handle form submission
    contactForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = {
        artistName: this.currentArtist.name,
        producerName: document.getElementById('producerName').value,
        producerEmail: document.getElementById('producerEmail').value,
        producerPhone: document.getElementById('producerPhone').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value,
        date: new Date().toISOString()
      };

      // Store contact request in localStorage
      this.saveContactRequest(formData);

      // Show success message
      alert(`✓ Message sent to ${this.currentArtist.name}!\n\nThey will receive your contact details and get back to you soon.`);
      
      // Close modal and reset form
      contactModal.classList.remove('active');
      contactForm.reset();
    });
  },

  saveContactRequest(formData) {
    const contacts = JSON.parse(localStorage.getItem('echowave_contacts') || '[]');
    contacts.push(formData);
    localStorage.setItem('echowave_contacts', JSON.stringify(contacts));
  },

  renderAnalytics() {
    const stats = dataManager.getStats();
    
    document.getElementById('totalTracks').textContent = stats.totalTracks;
    document.getElementById('totalArtists').textContent = stats.totalArtists;
    document.getElementById('totalLikes').textContent = stats.totalLikes;

    // Render top tracks
    const topTracks = dataManager.getTopTracks(10);
    const topTracksList = document.getElementById('topTracksList');
    if (!topTracksList) return;

    topTracksList.innerHTML = '';

    topTracks.forEach((track, index) => {
      const trackItem = document.createElement('div');
      trackItem.className = 'track-item';
      const showLikes = track.isDemo; // Only demo tracks show likes
      
      trackItem.innerHTML = `
        <span class="track-number">#${index + 1}</span>
        <img src="${track.cover}" alt="${track.title}" class="track-cover">
        <div class="track-info">
          <div class="track-title">${track.title}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
        ${showLikes ? `
        <div class="track-likes">
          <span>❤️</span>
          <span>${track.likes || 0} likes</span>
        </div>
        ` : '<div class="track-likes"></div>'}
      `;

      topTracksList.appendChild(trackItem);
    });
  }
};
