// ========================================
// AUTHENTICATION
// ========================================

// Handle login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.querySelector('input[name="role"]:checked')?.value;

    // Simple demo validation
    if (!role) {
      alert('Please select a role (Listener, Artist, or Producer)');
      return;
    }

    if (username === 'demo' && password === 'demo123') {
      const user = {
        username: username,
        role: role
      };

      dataManager.setCurrentUser(user);
      navigateToDashboard(role);
    } else {
      alert('Invalid credentials. Please use:\nUsername: demo\nPassword: demo123');
    }
  });
}

// Navigate to appropriate dashboard
function navigateToDashboard(role) {
  document.getElementById('loginPage').classList.remove('active');
  
  if (role === 'listener') {
    document.getElementById('listenerDashboard').classList.add('active');
    if (window.listenerApp) window.listenerApp.init();
  } else if (role === 'artist') {
    document.getElementById('artistDashboard').classList.add('active');
    if (window.artistApp) window.artistApp.init();
  } else if (role === 'producer') {
    document.getElementById('producerDashboard').classList.add('active');
    if (window.producerApp) window.producerApp.init();
  }
}

// Logout handlers
function setupLogout(buttonId, dashboardId) {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', function() {
      dataManager.clearCurrentUser();
      document.getElementById(dashboardId).classList.remove('active');
      document.getElementById('loginPage').classList.add('active');
      
      // Reset form
      const form = document.getElementById('loginForm');
      if (form) form.reset();
    });
  }
}

setupLogout('logoutListener', 'listenerDashboard');
setupLogout('logoutArtist', 'artistDashboard');
setupLogout('logoutProducer', 'producerDashboard');

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
  const currentUser = dataManager.getCurrentUser();
  if (currentUser && currentUser.role) {
    navigateToDashboard(currentUser.role);
  }
});
