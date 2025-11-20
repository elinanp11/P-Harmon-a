// Utility functions for P-Harmonía

/**
 * Loads the header into the specified element
 * @param {string} currentPage - The current page name (e.g., 'belleza.html')
 */
function loadHeader(currentPage) {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    fetch('/P-Harmon-a/Public/components/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load header');
            }
            return response.text();
        })
        .then(html => {
            headerPlaceholder.innerHTML = html;
            
            // Set active link
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.getAttribute('href').endsWith(currentPage)) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Initialize any header scripts
            const headerScript = document.createElement('script');
            headerScript.src = '/P-Harmon-a/Public/components/header.js';
            document.body.appendChild(headerScript);
        })
        .catch(error => {
            console.error('Error loading header:', error);
            headerPlaceholder.innerHTML = `
                <header class="error-header">
                    <div class="container">
                        <a href="/P-Harmon-a/Public/home.html" class="logo">P-Harmonía</a>
                        <nav>
                            <a href="/P-Harmon-a/Public/home.html">Inicio</a>
                            <a href="/P-Harmon-a/Public/belleza.html">Belleza</a>
                            <a href="/P-Harmon-a/Public/comunidad.html">Comunidad</a>
                            <a href="/P-Harmon-a/Public/fitness-personalizado.html">Fitness</a>
                            <a href="/P-Harmon-a/Public/finanzas.html">Finanzas</a>
                            <a href="/P-Harmon-a/Public/moda.html">Moda</a>
                        </nav>
                    </div>
                </header>
            `;
        });
}

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    const protectedPages = ['/P-Harmon-a/Public/profile.html', '/P-Harmon-a/Public/settings.html'];
    const currentPath = window.location.pathname;

    if (protectedPages.includes(currentPath) && !user) {
        window.location.href = '/P-Harmon-a/Public/login.html';
    }
}

// Initialize page
function initPage(currentPage) {
    document.addEventListener('DOMContentLoaded', function() {
        loadHeader(currentPage);
        checkAuth();
    });
}

// Export functions for use in other scripts
window.PHarmoniaUtils = {
    loadHeader,
    checkAuth,
    initPage
};
