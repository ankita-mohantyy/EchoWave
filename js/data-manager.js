// ========================================
// DATA MANAGER - localStorage Management
// ========================================

class DataManager {
  constructor() {
    this.initializeData();
    this.updatePlaylistCovers();
  }

  // Update existing playlist covers to use correct folder
  updatePlaylistCovers() {
    const playlists = this.getPlaylists();
    if (playlists && playlists.length > 0) {
      let updated = false;
      playlists.forEach(playlist => {
        // Check for old paths or filenames that need updating
        const needsUpdate = playlist.cover && (
          playlist.cover.includes('assets/images/artists/') ||
          playlist.cover.includes('wd1.jpeg') ||
          playlist.cover.includes('Kushagra.jpg') ||
          playlist.cover.includes('edSheeran.jpg') ||
          playlist.cover.includes('SanjithHegde.jpg')
        );
        
        if (needsUpdate) {
          // Map to available playlist images
          if (playlist.artist === "Kushagra") {
            playlist.cover = "assets/images/playlists/download (4).jpg";
          } else if (playlist.artist === "Ed Sheeran") {
            playlist.cover = "assets/images/playlists/wd2.jpeg";
          } else if (playlist.artist === "Sanjith Hegde") {
            playlist.cover = "assets/images/playlists/download (3).jpg";
          } else {
            // For any other artists, use available images in rotation
            playlist.cover = "assets/images/playlists/wd1.jpeg";
          }
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem('echowave_playlists', JSON.stringify(playlists));
      }
    }
  }

  // Initialize data with sample content
  initializeData() {
    if (!localStorage.getItem('echowave_initialized')) {
      // Sample initial playlists and tracks
      const sampleData = {
        playlists: [
          {
            id: 1,
            name: "Kushagra's Kaleidoscope",
            artist: "Kushagra",
            cover: "assets/images/playlists/download (4).jpg",
            price: 499,
            tracks: [1, 2, 3]
          },
          {
            id: 2,
            name: "Ed's Echoes",
            artist: "Ed Sheeran",
            cover: "assets/images/playlists/wd2.jpeg",
            price: 799,
            tracks: [4, 5]
          },
          {
            id: 3,
            name: "Sanjith's Symphony",
            artist: "Sanjith Hegde",
            cover: "assets/images/playlists/download (3).jpg",
            price: 599,
            tracks: [6, 7, 8]
          }
        ],
        tracks: [
          {
            id: 1,
            title: "Finding Her",
            artist: "Kushagra",
            cover: "assets/images/artists/Kushagra.jpg",
            src: "assets/audio/findingHER.mp3",
            likes: 234,
            playlistId: 1,
            isDemo: true,
            likedBy: []
          },
          {
            id: 2,
            title: "Midnight Melodies",
            artist: "Kushagra",
            cover: "assets/images/artists/Kushagra.jpg",
            src: "",
            likes: 189,
            playlistId: 1,
            isDemo: false,
            likedBy: []
          },
          {
            id: 3,
            title: "Rhythm Revival",
            artist: "Kushagra",
            cover: "assets/images/artists/Kushagra.jpg",
            src: "",
            likes: 312,
            playlistId: 1,
            isDemo: false,
            likedBy: []
          },
          {
            id: 4,
            title: "Perfect",
            artist: "Ed Sheeran",
            cover: "assets/images/artists/edSheeran.jpg",
            src: "assets/audio/Perfect.mp3",
            likes: 456,
            playlistId: 2,
            isDemo: true,
            likedBy: []
          },
          {
            id: 5,
            title: "Castle Memories",
            artist: "Ed Sheeran",
            cover: "assets/images/artists/edSheeran.jpg",
            src: "",
            likes: 401,
            playlistId: 2,
            isDemo: false,
            likedBy: []
          },
          {
            id: 6,
            title: "Shaakuntle Sikkalu",
            artist: "Sanjith Hegde",
            cover: "assets/images/artists/SanjithHegde.jpg",
            src: "assets/audio/ShaakuntleSikkalu.mp3",
            likes: 278,
            playlistId: 3,
            isDemo: true,
            likedBy: []
          },
          {
            id: 7,
            title: "Heartbeat Echo",
            artist: "Sanjith Hegde",
            cover: "assets/images/artists/SanjithHegde.jpg",
            src: "",
            likes: 198,
            playlistId: 3,
            isDemo: false,
            likedBy: []
          },
          {
            id: 8,
            title: "Eternal Vibes",
            artist: "Sanjith Hegde",
            cover: "assets/images/artists/SanjithHegde.jpg",
            src: "",
            likes: 345,
            playlistId: 3,
            isDemo: false,
            likedBy: []
          }
        ],
        purchases: [],
        currentUser: null
      };

      localStorage.setItem('echowave_playlists', JSON.stringify(sampleData.playlists));
      localStorage.setItem('echowave_tracks', JSON.stringify(sampleData.tracks));
      localStorage.setItem('echowave_purchases', JSON.stringify(sampleData.purchases));
      localStorage.setItem('echowave_initialized', 'true');
    }
  }

  // Get all playlists
  getPlaylists() {
    return JSON.parse(localStorage.getItem('echowave_playlists') || '[]');
  }

  // Get playlist by ID
  getPlaylistById(id) {
    const playlists = this.getPlaylists();
    return playlists.find(p => p.id === id);
  }

  // Get all tracks
  getTracks() {
    return JSON.parse(localStorage.getItem('echowave_tracks') || '[]');
  }

  // Get track by ID
  getTrackById(id) {
    const tracks = this.getTracks();
    return tracks.find(t => t.id === id);
  }

  // Get tracks by playlist ID
  getTracksByPlaylist(playlistId) {
    const tracks = this.getTracks();
    return tracks.filter(t => t.playlistId === playlistId);
  }

  // Add new playlist
  addPlaylist(playlist) {
    const playlists = this.getPlaylists();
    playlist.id = Date.now();
    playlist.tracks = [];
    playlists.push(playlist);
    localStorage.setItem('echowave_playlists', JSON.stringify(playlists));
    return playlist;
  }

  // Add new track
  addTrack(track) {
    const tracks = this.getTracks();
    track.id = Date.now();
    track.likes = 0;
    track.likedBy = [];
    tracks.push(track);
    localStorage.setItem('echowave_tracks', JSON.stringify(tracks));

    // Update playlist tracks array
    const playlists = this.getPlaylists();
    const playlist = playlists.find(p => p.id === track.playlistId);
    if (playlist) {
      playlist.tracks.push(track.id);
      localStorage.setItem('echowave_playlists', JSON.stringify(playlists));
    }

    return track;
  }

  // Toggle like on track
  toggleLike(trackId, username) {
    const tracks = this.getTracks();
    const track = tracks.find(t => t.id === trackId);
    
    if (track) {
      if (track.likedBy.includes(username)) {
        track.likedBy = track.likedBy.filter(u => u !== username);
        track.likes = Math.max(0, track.likes - 1);
      } else {
        track.likedBy.push(username);
        track.likes++;
      }
      localStorage.setItem('echowave_tracks', JSON.stringify(tracks));
    }
    
    return track;
  }

  // Check if track is liked by user
  isLiked(trackId, username) {
    const track = this.getTrackById(trackId);
    return track && track.likedBy && track.likedBy.includes(username);
  }

  // Get purchases
  getPurchases() {
    return JSON.parse(localStorage.getItem('echowave_purchases') || '[]');
  }

  // Add purchase
  addPurchase(username, playlistId) {
    const purchases = this.getPurchases();
    purchases.push({
      username,
      playlistId,
      date: new Date().toISOString()
    });
    localStorage.setItem('echowave_purchases', JSON.stringify(purchases));
  }

  // Check if playlist is purchased by user
  isPurchased(username, playlistId) {
    const purchases = this.getPurchases();
    return purchases.some(p => p.username === username && p.playlistId === playlistId);
  }

  // Get user's purchased playlists
  getUserPurchases(username) {
    const purchases = this.getPurchases();
    return purchases.filter(p => p.username === username).map(p => p.playlistId);
  }

  // Get playlist by artist name
  getPlaylistByArtist(artist) {
    const playlists = this.getPlaylists();
    return playlists.find(p => p.artist === artist);
  }

  // Get all unique artists
  getArtists() {
    const playlists = this.getPlaylists();
    const artistMap = new Map();

    playlists.forEach(playlist => {
      if (!artistMap.has(playlist.artist)) {
        const tracks = this.getTracksByPlaylist(playlist.id);
        // Only count likes from demo tracks
        const totalLikes = tracks
          .filter(track => track.isDemo)
          .reduce((sum, track) => sum + (track.likes || 0), 0);
        
        // Get artist cover - prioritize uploaded artistCover from playlist, fallback to default path
        let artistCover = `assets/images/artists/${playlist.artist.replace(/\s+/g, '')}.jpg`;
        if (playlist.artistCover) {
          // Use uploaded artist cover from playlist
          artistCover = playlist.artistCover;
        }
        
        artistMap.set(playlist.artist, {
          name: playlist.artist,
          playlistId: playlist.id,
          playlistName: playlist.name,
          trackCount: tracks.length,
          totalLikes: totalLikes,
          cover: artistCover
        });
      }
    });

    return Array.from(artistMap.values());
  }

  // Set current user
  setCurrentUser(user) {
    localStorage.setItem('echowave_current_user', JSON.stringify(user));
  }

  // Get current user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('echowave_current_user') || 'null');
  }

  // Clear current user (logout)
  clearCurrentUser() {
    localStorage.removeItem('echowave_current_user');
  }

  // Get statistics
  getStats() {
    const tracks = this.getTracks();
    const artists = this.getArtists();
    // Only count likes from demo tracks
    const totalLikes = tracks
      .filter(track => track.isDemo)
      .reduce((sum, track) => sum + (track.likes || 0), 0);

    return {
      totalTracks: tracks.length,
      totalArtists: artists.length,
      totalLikes: totalLikes
    };
  }

  // Get top tracks by likes
  getTopTracks(limit = 10) {
    const tracks = this.getTracks();
    return tracks.sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, limit);
  }

  // Generate adjective for playlist name
  generatePlaylistAdjective() {
    const adjectives = [
      'Kaleidoscope', 'Echoes', 'Symphony', 'Vibes', 'Rhythms',
      'Melodies', 'Harmonies', 'Beats', 'Sounds', 'Waves',
      'Journey', 'Dreams', 'Magic', 'Soul', 'Spirit',
      'Energy', 'Flow', 'Groove', 'Pulse', 'Essence'
    ];
    return adjectives[Math.floor(Math.random() * adjectives.length)];
  }
}

// Create global instance
const dataManager = new DataManager();
