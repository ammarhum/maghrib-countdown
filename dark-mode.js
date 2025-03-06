// Dark mode functionality
function initDarkMode() {
    // Check for saved user preference
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    
    // Set initial state
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode-toggle').checked = true;
    }
    
    // Toggle dark mode when button is clicked
    document.getElementById('dark-mode-toggle').addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

// Initialize dark mode when DOM is loaded
document.addEventListener('DOMContentLoaded', initDarkMode);
