// nav-visibility.js
document.addEventListener('DOMContentLoaded', function() {
    // Obtener la ruta actual
    const currentPath = window.location.pathname;
    const isIndexPage = currentPath.endsWith('index.html') || 
                        currentPath.endsWith('/') || 
                        currentPath.endsWith('/P-Harmon-a/') || 
                        currentPath.endsWith('/P-Harmon-a/index.html');

    // Verificar si el usuario está autenticado
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || 'Usuario';

    // Obtener los elementos de navegación
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.getElementById('userMenu');
    const userNameSpan = document.getElementById('userName');

    // Actualizar la interfaz de usuario según el estado de autenticación
    if (isLoggedIn) {
        // Ocultar botones de autenticación
        if (authButtons) authButtons.style.display = 'none';
        
        // Mostrar menú de usuario
        if (userMenu) {
            userMenu.style.display = 'block';
            if (userNameSpan) userNameSpan.textContent = userName;
        }
    } else {
        // Si no está en index.html, redirigir al login
        if (!isIndexPage) {
            window.location.href = '/P-Harmon-a/Public/login.html';
        }
    }

    // Configurar el menú desplegable del usuario
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
            if (userDropdown) {
                userDropdown.style.display = expanded ? 'none' : 'block';
            }
        });
    }

    // Cerrar el menú al hacer clic fuera
    document.addEventListener('click', function() {
        if (userDropdown && userDropdown.style.display === 'block') {
            userDropdown.style.display = 'none';
            if (userMenuBtn) {
                userMenuBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Prevenir que el menú se cierre al hacer clic dentro de él
    if (userDropdown) {
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Manejar cierre de sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Estás segura de que deseas cerrar sesión?')) {
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('userName');
                window.location.href = '/P-Harmon-a/Public/login.html';
            }
        });
    }
});
