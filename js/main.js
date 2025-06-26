// Main JavaScript file for the Industrial Dashboard

// Set current user name (would normally come from authentication)
document.addEventListener('DOMContentLoaded', function() {
  // Set user name
  const userNameElement = document.getElementById('userName');
  const currentUser = 'John Doe'; // This would normally come from a user session
  if (userNameElement) {
    userNameElement.textContent = currentUser;
  }

  // Set current date
  const dateElement = document.getElementById('currentDate');
  if (dateElement) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-US', options);
  }

  // Initialize sidebar toggle
  initSidebarToggle();

  // Add event listeners for sidebar navigation
  initNavigation();

  // Add event listeners for buttons
  setupButtonListeners();

  // Initialize notifications counter
  updateNotificationsCount();
});

// Initialize sidebar toggle functionality
function initSidebarToggle() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.main-content');
  
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
  });
}

// Initialize navigation functionality
function initNavigation() {
  // Main navigation
  const navItems = document.querySelectorAll('.sidebar-nav li');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      // Skip if it's the premium option
      if (this.classList.contains('premium-option')) return;
      
      // Remove active class from all items
      navItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // Show corresponding page content
      const pageId = this.getAttribute('data-page');
      if (pageId) {
        showPage(pageId);
      }
    });
  });
  
  // Model card navigation
  const modelCards = document.querySelectorAll('.model-card');
  modelCards.forEach(card => {
    card.addEventListener('click', function() {
      const modelId = this.getAttribute('data-model');
      if (modelId) {
        showSubpage(modelId);
      }
    });
  });
  
  // Back buttons
  const backButtons = document.querySelectorAll('.back-btn');
  backButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Go back to predictive models page
      showPage('predictive-models');
    });
  });
}

// Show a specific page
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page-content');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show the selected page
  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.classList.add('active');
  }
  
  // Hide all subpages
  const subpages = document.querySelectorAll('.subpage');
  subpages.forEach(subpage => {
    subpage.classList.remove('active');
  });
}

// Show a specific subpage
function showSubpage(subpageId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page-content');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show the selected subpage
  const selectedSubpage = document.getElementById(subpageId);
  if (selectedSubpage) {
    selectedSubpage.classList.add('active');
  }
}

// Setup button event listeners
function setupButtonListeners() {
  // Premium button
  const premiumButtons = document.querySelectorAll('.premium-btn, .premium-option a');
  premiumButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'premium.html';
    });
  });

  // Account button
  const accountButtons = document.querySelectorAll('.account-btn, .account-section a');
  accountButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'accounts.html';
    });
  });

  // View all buttons
  const viewAllButtons = document.querySelectorAll('.view-all');
  viewAllButtons.forEach(button => {
    button.addEventListener('click', function() {
      const cardTitle = this.closest('.card-header').querySelector('h3').textContent.trim();
      showModal('View All', `Showing all items for: ${cardTitle}`);
    });
  });

  // Educational material buttons
  const actionButtons = document.querySelectorAll('.resume-btn, .view-btn, .start-btn');
  actionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const materialTitle = this.closest('li').querySelector('.educational-title').textContent;
      const action = this.textContent.trim();
      showModal('Educational Material', `${action} "${materialTitle}"`);
    });
  });
  
  // Model buttons
  const modelButtons = document.querySelectorAll('.model-btn');
  modelButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent the card click event
      const cardTitle = this.closest('.model-card').querySelector('h3').textContent;
      showModal('Model Selected', `You selected: ${cardTitle}`);
    });
  });
}

// Simple modal implementation
function showModal(title, message) {
  // Remove any existing modal
  const existingModal = document.querySelector('.modal-container');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal elements
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  
  const modalTitle = document.createElement('h3');
  modalTitle.textContent = title;
  
  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => modalContainer.remove());
  
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  modalBody.textContent = message;
  
  // Assemble modal
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContainer.appendChild(modalContent);
  
  // Add modal to document
  document.body.appendChild(modalContainer);
  
  // Add modal styles if not already present
  if (!document.getElementById('modal-styles')) {
    const modalStyles = document.createElement('style');
    modalStyles.id = 'modal-styles';
    modalStyles.textContent = `
      .modal-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal-content {
        background-color: white;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }
      .modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      }
      .modal-body {
        padding: 20px;
      }
    `;
    document.head.appendChild(modalStyles);
  }
}

// Update notifications count
function updateNotificationsCount() {
  const notificationItems = document.querySelectorAll('.notification-list li');
  const count = notificationItems.length;
  
  // Create or update notification badge
  let badge = document.querySelector('.notification-badge');
  
  if (!badge) {
    // Create badge if it doesn't exist
    const bellIcon = document.querySelector('.sidebar-nav li a i.fa-bell');
    if (bellIcon) {
      badge = document.createElement('span');
      badge.className = 'notification-badge';
      bellIcon.parentNode.appendChild(badge);
      
      // Add badge styles
      const badgeStyles = document.createElement('style');
      badgeStyles.textContent = `
        .notification-badge {
          position: absolute;
          top: -5px;
          right: 15px;
          background-color: var(--danger-color);
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .sidebar-nav li a {
          position: relative;
        }
      `;
      document.head.appendChild(badgeStyles);
    }
  }
  
  if (badge) {
    badge.textContent = count;
  }
}