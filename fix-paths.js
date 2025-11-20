const fs = require('fs');
const path = require('path');

// Configuration
const REPO_NAME = 'P-Harmon-a';
const BASE_PATH = `/${REPO_NAME}/Public`;

// Files to process
const HTML_FILES = [
    'Public/home.html',
    'Public/belleza.html',
    'Public/comunidad.html',
    'Public/finanzas.html',
    'Public/fitness-personalizado.html',
    'Public/moda.html',
    'Public/profile.html',
    'Public/settings.html',
    'Public/login.html',
    'Public/register.html',
    'Public/test-logo.html',
    'index.html'
];

// Function to update paths in a file
function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // Update href attributes
        content = content.replace(/(href=["'])(?!https?:\/\/|#|mailto:|tel:)([^"']*)(["'])/gi, (match, p1, p2, p3) => {
            if (!p2 || p2.startsWith(BASE_PATH)) return match;
            updated = true;
            return `${p1}${p2.startsWith('/') ? BASE_PATH + p2 : BASE_PATH + '/' + p2}${p3}`;
        });

        // Update src attributes
        content = content.replace(/(src=["'])(?!https?:\/\/|data:)([^"']*)(["'])/gi, (match, p1, p2, p3) => {
            if (!p2 || p2.startsWith(BASE_PATH)) return match;
            updated = true;
            return `${p1}${p2.startsWith('/') ? BASE_PATH + p2 : BASE_PATH + '/' + p2}${p3}`;
        });

        // Update fetch URLs
        content = content.replace(/(fetch\(['"])(?!https?:\/\/|\/\/)([^'"]*)(['"])/g, (match, p1, p2, p3) => {
            if (!p2 || p2.startsWith(BASE_PATH)) return match;
            updated = true;
            return `${p1}${p2.startsWith('/') ? BASE_PATH + p2 : BASE_PATH + '/' + p2}${p3}`;
        });

        // Update background images in style attributes
        content = content.replace(/(background[-image]*:\s*url\(['"]?)(?!https?:\/\/|data:)([^'"\)]*)(['"]?\))/gi, (match, p1, p2, p3) => {
            if (!p2 || p2.startsWith(BASE_PATH)) return match;
            updated = true;
            return `${p1}${p2.startsWith('/') ? BASE_PATH + p2 : BASE_PATH + '/' + p2}${p3}`;
        });

        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated: ${filePath}`);
        } else {
            console.log(`✓ No changes needed: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

// Process all HTML files
console.log('Updating file paths for GitHub Pages...');
HTML_FILES.forEach(relativePath => {
    const fullPath = path.join(__dirname, relativePath);
    if (fs.existsSync(fullPath)) {
        updateFile(fullPath);
    } else {
        console.warn(`File not found: ${fullPath}`);
    }
});

console.log('\nPath updates complete! Next steps:');
console.log('1. Test all pages locally');
console.log('2. Commit and push your changes');
console.log('3. Enable GitHub Pages in your repository settings (if not already done)');
console.log('4. Your site will be available at: https://yourusername.github.io/P-Harmon-a/');
