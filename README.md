# EchoWave 🎵

A comprehensive role-based music streaming platform featuring three distinct user roles with specialized dashboards, demo track previews, playlist purchasing, artist upload functionality, and producer analytics.

## 🌟 Features

### 🎧 Listener Dashboard
- Browse all available playlists with cover art and pricing
- Play demo tracks (first track per playlist) without purchase
- Like demo tracks with real-time count updates
- Purchase playlists via payment modal (₹399-999 INR)
- Access full playlist content post-purchase
- View purchased library separately

### 🎤 Artist Dashboard
- View personalized playlist and track statistics
- Upload tracks with multiple cover options (track, artist, playlist)
- Select track type (demo or locked) during upload
- Automatic playlist creation or addition to existing playlist
- Track likes and engagement metrics
- Prevent duplicate playlist creation

### 🎬 Producer Dashboard
- View artist analytics with total likes and track counts
- Discover trending artists and popular tracks
- View detailed artist profiles with track listings
- Contact artists via integrated form system
- Analytics filtered to show only demo track engagement
- No pricing visibility (business-to-business model)

## 🛠️ Technologies Used

- **HTML5** - Semantic markup, audio element, modals
- **CSS3** - Custom properties, Grid/Flexbox layouts, animations
- **JavaScript (ES6+)** - Modular architecture, localStorage API, FileReader API
- **No frameworks or libraries** - Pure vanilla JavaScript

## 📁 Project Structure

```
EchoWave/
├── index.html              # Single-page application (420 lines)
├── README.md
├── css/
│   └── main.css           # Complete styling system (1199 lines)
├── js/
│   ├── data-manager.js    # Data persistence layer (373 lines)
│   ├── auth.js            # Authentication system
│   ├── listener.js        # Listener features (259 lines)
│   ├── artist.js          # Artist features (272 lines)
│   ├── producer.js        # Producer features (257 lines)
│   ├── player.js          # Music player engine (145 lines)
│   └── main.js            # App initialization
└── assets/
    ├── audio/             # MP3 files (Perfect, findingHER, ShaakuntleSikkalu)
    └── images/
        ├── artists/       # Artist profile photos
        └── playlists/     # Playlist cover art
```

## 🚀 How to Run

### Option 1: Direct File
Simply open `index.html` in your web browser (double-click the file).

### Option 2: Local Server (Recommended)
Run a local server to avoid CORS issues:

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

## 🔐 Demo Credentials

**Username:** `demo`  
**Password:** `demo123`

After login, select one of three roles:
- **Listener** - Browse and purchase music
- **Artist** - Upload and manage tracks
- **Producer** - Discover artists and view analytics

## 💾 Data Persistence

All data is stored in browser **localStorage**:
- `echowave_playlists` - Playlist metadata
- `echowave_tracks` - Track information (titles, audio, likes)
- `echowave_purchases` - User purchase history
- `echowave_current_user` - Active session
- `echowave_contacts` - Producer-artist messages

**Note:** Clearing browser data will reset the application.

## 🎨 Design Highlights

- **Color Scheme:** Dark theme with Spotify-inspired green (#1db954)
- **Responsive Design:** Grid layouts with mobile-friendly breakpoints
- **Modal System:** Layered interactions for purchases and details
- **Music Player:** Persistent bottom player across all dashboards
- **Role-Based UI:** Specialized interfaces for each user type

## 🔑 Key Features

✅ Role-based authentication with three distinct dashboards  
✅ Demo/locked track system (preview before purchase)  
✅ Real-time like synchronization across roles  
✅ Multi-cover upload (track, artist, playlist)  
✅ Payment flow simulation with Indian Rupee pricing  
✅ Producer contact form for artist collaboration  
✅ Music player with progress tracking and controls  
✅ Duplicate playlist prevention  
✅ Cross-role data consistency  

## 🎯 Use Cases

- **Portfolio Project** - Showcase full-stack concepts with frontend-only tech
- **Educational Demo** - Learn SPA architecture and localStorage management
- **UI/UX Reference** - Modern music streaming platform design patterns
- **Prototype Base** - Foundation for backend integration

## 🔮 Future Enhancements

- Backend integration (Node.js + MongoDB)
- Real payment gateway (Razorpay/Stripe)
- Advanced search and filtering
- Social features (sharing, following)
- Mobile application (React Native)
- AI-powered recommendations

## 📄 License

## Drive link : https://drive.google.com/drive/folders/1BGe6qLUQ3jK55JVt0WsQB-jCr3m-dmF5?usp=sharing

This project is open source and available for educational purposes.

## 👨‍💻 Author

Built as a demonstration of modern web development practices using vanilla JavaScript.

