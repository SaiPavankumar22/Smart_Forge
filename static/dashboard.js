// Main JavaScript file for the Industrial Dashboard

// Set current user name (would normally come from authentication)
document.addEventListener('DOMContentLoaded', function() {
  // Set user name
  const userNameElement = document.getElementById('userName');
  const currentUser = 'SAI'; // This would normally come from a user session
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

  // Initialize theme toggle
  initThemeToggle();

  // Add event listeners for sidebar navigation
  initNavigation();

  // Add event listeners for buttons
  setupButtonListeners();

  // Initialize notifications counter
  updateNotificationsCount();
});

// Initialize theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  
  // Check for saved theme preference or use default light theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  themeToggle.addEventListener('click', function() {
    // If the current theme is light, change to dark, and vice versa
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Set the theme attribute on the html element
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save the theme preference to localStorage
    localStorage.setItem('theme', newTheme);
  });
}

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
    card.addEventListener('click', function(e) {
      // Check if this is a premium card
      if (this.classList.contains('premium-card')) {
        e.preventDefault();
        window.location.href = 'premium.html';
        return;
      }
      
      const modelId = this.getAttribute('data-model');
      if (modelId) {
        showSubpage(modelId);
      }
    });
  });
  
  // Alloy card navigation
  const alloyCards = document.querySelectorAll('.alloy-card');
  alloyCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Check if this is a premium card
      if (this.classList.contains('premium-card')) 
        {
        e.preventDefault();
        window.location.href = 'premium.html';
        return;
      }
      
      const alloyId = this.getAttribute('data-alloy');
      if (alloyId) {
        showAlloyPage(alloyId);
      }
    });
  });
  
  // Specific alloy type navigation
  const specificAlloyCards = document.querySelectorAll('.specific-alloy-card');
  specificAlloyCards.forEach(card => {
    card.addEventListener('click', function(e) {
      e.stopPropagation();
      
      // Get the alloy name
      const alloyName = this.querySelector('h3').textContent;
      
      // If it's Aluminum 3003, redirect to predict.html
      if (alloyName === 'Aluminum 3003') {
        window.location.href = '/al_3003.html';
        return;
      }
      
      if (alloyName === 'Aluminum 5052') {
        window.location.href = '/al_5052.html';
        return;
      }

      if (alloyName === 'Aluminum 6061') {
        window.location.href = '/al_6061.html';
        return;
      }

      if (alloyName === 'Aluminum 3105') {
        window.location.href = '/al_3105.html';
        return;
      }

      if (alloyName === 'Medium Carbon Steel') {
        window.location.href = '/steel_1045.html';
        return;
      }

      if (alloyName === 'Stainless Steel') {
        window.location.href = '/stainless_steel.html';
        return;
      }

      if (alloyName === 'HSLA Steel') {
        window.location.href = '/steel_hstl.html';
        return;
      }
      // For other alloys, show a modal
      showModal('Alloy Selected', `You selected: ${alloyName}`);
    });
  });
  
  // Back buttons
  const backButtons = document.querySelectorAll('.back-btn');
  backButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.getAttribute('data-target');
      if (target === 'predictive-models') {
        showPage('predictive-models');
      } else if (target === 'property-prediction') {
        showSubpage('property-prediction');
      } else {
        showPage('predictive-models');
      }
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
  
  // Hide all alloy pages
  const alloyPages = document.querySelectorAll('.alloy-page');
  alloyPages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Hide all specific alloy pages
  const specificAlloyPages = document.querySelectorAll('.specific-alloy-page');
  specificAlloyPages.forEach(page => {
    page.classList.remove('active');
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
  
  // Hide all alloy pages
  const alloyPages = document.querySelectorAll('.alloy-page');
  alloyPages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Hide all specific alloy pages
  const specificAlloyPages = document.querySelectorAll('.specific-alloy-page');
  specificAlloyPages.forEach(page => {
    page.classList.remove('active');
  });
}

// Show a specific alloy page
function showAlloyPage(alloyId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page-content');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Hide all subpages
  const subpages = document.querySelectorAll('.subpage');
  subpages.forEach(subpage => {
    subpage.classList.remove('active');
  });
  
  // Show the selected alloy page
  const selectedAlloyPage = document.getElementById(alloyId);
  if (selectedAlloyPage) {
    selectedAlloyPage.classList.add('active');
  }
  
  // Hide all specific alloy pages
  const specificAlloyPages = document.querySelectorAll('.specific-alloy-page');
  specificAlloyPages.forEach(page => {
    page.classList.remove('active');
  });
}

// Show a specific alloy type page
function showSpecificAlloyPage(alloyTypeId) {
  // Hide all pages
  const pages = document.querySelectorAll('.page-content');
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Hide all subpages
  const subpages = document.querySelectorAll('.subpage');
  subpages.forEach(subpage => {
    subpage.classList.remove('active');
  });
  
  // Hide all alloy pages
  const alloyPages = document.querySelectorAll('.alloy-page');
  alloyPages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show the selected specific alloy page
  const selectedSpecificAlloyPage = document.getElementById(alloyTypeId);
  if (selectedSpecificAlloyPage) {
    selectedSpecificAlloyPage.classList.add('active');
  }
}

// Setup button event listeners
function setupButtonListeners() {
  

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
      
      // Check if this is a premium button
      if (this.classList.contains('premium-btn')) {
        window.location.href = 'premium.html';
        return;
      }
      
      const cardTitle = this.closest('.model-card').querySelector('h3').textContent;
      
      // If it's Aluminum 3003, redirect to predict.html
      if (cardTitle === 'Aluminum 3003') {
        window.location.href = '/al_3003.html';
        return;
      }

      if (cardTitle === 'Aluminum 5052') {
        window.location.href = '/al_5052.html';
        return;
      }

      if (cardTitle === 'Aluminum 6061') {
        window.location.href = '/al_6061.html';
        return;
      }

      if (cardTitle === 'Aluminum 3105') {
        window.location.href = '/al_3105.html';
        return;
      }

      if (cardTitle === 'Medium Carbon Steel') {
        window.location.href = '/steel_1045.html';
        return;
      }

      if (cardTitle === 'Stainless Steel') {
        window.location.href = '/stainless_steel.html';
        return;
      }

      if (cardTitle === 'HSLA Steel') {
        window.location.href = '/steel_hstl.html';
        return;
      }
      
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
        background-color: var(--card-background);
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
        color: var(--text-light);
      }
      .modal-body {
        padding: 20px;
        color: var(--text-color);
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



document.addEventListener("DOMContentLoaded", function () {
  const topicCards = document.querySelectorAll('.model-card');
  const allSections = document.querySelectorAll('.page-content');
  const backButtons = document.querySelectorAll('.back-btnn');

  topicCards.forEach(card => {
      card.addEventListener('click', function () {
          const topicId = this.getAttribute('data-topic');
          if (topicId) {
              showTopicPage(topicId);
          }
      });
  });

  function showTopicPage(topicId) {
      allSections.forEach(section => {
          section.classList.remove('active');
      });

      const selectedSection = document.getElementById(topicId);
      if (selectedSection) {
          selectedSection.classList.add('active');
      }
  }

  // Back button event listener
  backButtons.forEach(button => {
      button.addEventListener("click", function () {
          allSections.forEach(section => section.classList.remove("active"));
          document.getElementById("educational-overview").classList.add("active");
      });
  });
});
