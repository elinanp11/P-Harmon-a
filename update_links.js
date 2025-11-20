const fs = require('fs');
const path = require('path');

// Configuration
const REPO_NAME = 'P-Harmon-a';
const BASE_PATH = `/${REPO_NAME}/Public`;

// Files to process (relative to project root)
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
  'Public/components/header.html',
  'Public/components/footer.html',
  'index.html'
];

// Function to update links in HTML content
function updateLinks(html, filePath) {
  // Convert relative paths to absolute paths for GitHub Pages
  let updatedHtml = html;
  
  // Update href attributes
  updatedHtml = updatedHtml.replace(/href=(["'])(?!(https?:\/\/|#|mailto:|tel:))([^"']*)\1/gi, (match, quote, _, p1) => {
    // Skip empty links and anchor links
    if (!p1 || p1.startsWith('#')) return match;
    
    // Skip absolute paths that are already correct
    if (p1.startsWith(BASE_PATH)) return match;
    
    // Convert relative to absolute path
    const absolutePath = p1.startsWith('/') 
      ? `${BASE_PATH}${p1}` 
      : `${BASE_PATH}/${p1}`;
    
    return `href="${absolutePath}"`;
  });
  
  // Update src attributes
  updatedHtml = updatedHtml.replace(/src=(["'])(?!(https?:\/\/|data:))([^"']*)\1/gi, (match, quote, _, p1) => {
    // Skip empty src
    if (!p1) return match;
    
    // Skip absolute paths that are already correct
    if (p1.startsWith(BASE_PATH)) return match;
    
    // Convert relative to absolute path
    const absolutePath = p1.startsWith('/')
      ? `${BASE_PATH}${p1}`
      : `${BASE_PATH}/${p1}`;
    
    return `src="${absolutePath}"`;
  });
  
  // Update fetch URLs in JavaScript
  updatedHtml = updatedHtml.replace(/fetch\(['"]([^'"]*)['"]/g, (match, p1) => {
    // Skip absolute URLs
    if (p1.startsWith('http') || p1.startsWith('//')) return match;
    
    // Skip paths that are already correct
    if (p1.startsWith(BASE_PATH)) return match;
    
    // Convert relative to absolute path
    const absolutePath = p1.startsWith('/')
      ? `${BASE_PATH}${p1}`
      : `${BASE_PATH}/${p1}`;
    
    return `fetch('${absolutePath}'`;
  });
  
  return updatedHtml;
}

// Process all HTML files
function processFiles() {
  console.log('Updating links for GitHub Pages...');
  
  HTML_FILES.forEach(relativePath => {
    const filePath = path.join(__dirname, relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return;
    }
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const updatedContent = updateLinks(content, relativePath);
      
      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`✓ Updated: ${relativePath}`);
      } else {
        console.log(`✓ No changes needed: ${relativePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  });
  
  console.log('\nLink update completed!');
  console.log('\nNext steps:');
  console.log('1. Review the changes in your code editor');
  console.log('2. Commit and push the changes to GitHub');
  console.log(`3. Your site will be available at: https://yourusername.github.io/${REPO_NAME}/Public/home.html`);
}

// Run the script
processFiles();
