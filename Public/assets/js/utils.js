/**
 * Utility functions for P-Harmonia
 */

/**
 * Show an alert message
 * @param {string} type - Type of alert (success, error, warning, info)
 * @param {string} message - Message to display
 * @param {HTMLElement} container - Container to append the alert to (default: document.body)
 * @param {number} duration - Duration in ms to show the alert (default: 5000)
 */
export function showAlert(type, message, container = document.body, duration = 5000) {
    // Create alert element
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type}`;
    alertEl.setAttribute('role', 'alert');
    
    // Set alert content
    const iconMap = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    alertEl.innerHTML = `
        <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
        <span>${message}</span>
        <button class="close-btn" aria-label="Cerrar">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container or body
    if (container) {
        container.insertBefore(alertEl, container.firstChild);
    } else {
        document.body.appendChild(alertEl);
    }
    
    // Add show class after a small delay for animation
    setTimeout(() => {
        alertEl.classList.add('show');
    }, 10);
    
    // Auto remove after duration
    const timeout = setTimeout(() => {
        hideAlert(alertEl);
    }, duration);
    
    // Close button handler
    const closeBtn = alertEl.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeout);
            hideAlert(alertEl);
        });
    }
    
    return alertEl;
}

/**
 * Hide an alert
 * @param {HTMLElement} alertEl - The alert element to hide
 */
function hideAlert(alertEl) {
    if (!alertEl) return;
    
    alertEl.classList.remove('show');
    alertEl.classList.add('hide');
    
    // Remove from DOM after animation
    setTimeout(() => {
        alertEl.remove();
    }, 300);
}

/**
 * Set loading state for a button
 * @param {HTMLElement} button - The button element
 * @param {boolean} isLoading - Whether to show loading state
 * @param {string} [loadingText='Procesando...'] - Text to show while loading
 */
export function setButtonLoading(button, isLoading, loadingText = 'Procesando...') {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.setAttribute('data-original-text', button.innerHTML);
        button.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <span>${loadingText}</span>
        `;
    } else {
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.innerHTML = originalText;
            button.removeAttribute('data-original-text');
        }
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{valid: boolean, message: string}} - Validation result
 */
export function validatePassword(password) {
    if (!password) {
        return { valid: false, message: 'La contraseña es requerida' };
    }
    
    if (password.length < 8) {
        return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
    }
    
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'La contraseña debe contener al menos una letra mayúscula' };
    }
    
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'La contraseña debe contener al menos un número' };
    }
    
    return { valid: true, message: 'Contraseña válida' };
}

/**
 * Format date to a readable string
 * @param {Date|string} date - Date to format
 * @param {string} [locale='es-ES'] - Locale for formatting
 * @returns {string} - Formatted date string
 */
export function formatDate(date, locale = 'es-ES') {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, options);
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - The element to check
 * @param {number} [offset=0] - Additional offset
 * @returns {boolean} - Whether the element is in the viewport
 */
export function isInViewport(element, offset = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
        rect.bottom >= offset
    );
}

/**
 * Add smooth scroll to an anchor link
 * @param {string} selector - The selector for the anchor links
 * @param {number} [offset=80] - Offset for the scroll position
 */
export function initSmoothScroll(selector = 'a[href^="#"]', offset = 80) {
    document.querySelectorAll(selector).forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - offset,
                behavior: 'smooth'
            });
            
            // Update URL without page jump
            history.pushState(null, null, targetId);
        });
    });
}

/**
 * Toggle password visibility
 * @param {HTMLElement} input - The password input element
 * @param {HTMLElement} toggleBtn - The toggle button element
 */
export function initPasswordToggle(input, toggleBtn) {
    if (!input || !toggleBtn) return;
    
    toggleBtn.addEventListener('click', () => {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // Toggle icon
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        }
    });
}

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} [currency='USD'] - The currency code
 * @param {string} [locale='es-ES'] - The locale to use for formatting
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD', locale = 'es-ES') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} - Whether the text was successfully copied
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
}

/**
 * Get URL parameters
 * @returns {Object} - Object containing URL parameters
 */
export function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    
    return result;
}

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Number of days until the cookie expires
 */
export function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

/**
 * Get a cookie by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    
    return null;
}

/**
 * Remove a cookie
 * @param {string} name - Cookie name
 */
export function eraseCookie(name) {   
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize smooth scroll for anchor links
    initSmoothScroll();
    
    // Initialize password toggles
    document.querySelectorAll('.password-toggle').forEach(toggleBtn => {
        const input = toggleBtn.previousElementSibling;
        if (input && input.type === 'password') {
            initPasswordToggle(input, toggleBtn);
        }
    });
});
