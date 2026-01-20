
// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize music player
  if (window.musicPlayer) {
    window.musicPlayer.init();
  }

  // Note: Auth.js also has a DOMContentLoaded listener that handles login check
  // This is kept for music player initialization
});

// Helper function to show specific page
function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
}

// Make navigateToDashboard available globally for auth.js
// (This function is called by auth.js after successful login)
