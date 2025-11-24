const fs = require('fs');
const path = require('path');

// Function to update HTML files with the new header
function updateHTMLFiles() {
    const publicDir = __dirname;
    const headerPath = path.join(publicDir, 'components', 'header-complete.html');
    
    // Read the header content
    const headerContent = fs.readFileSync(headerPath, 'utf8');
    
    // Get all HTML files in the Public directory
    const files = [
        'home.html',
        'belleza.html',
        'comunidad.html',
        'fitness-personalizado.html',
        'finanzas.html',
        'moda.html',
        'login.html',
        'register.html',
        'profile.html',
        'settings.html'
    ];

    files.forEach(file => {
        const filePath = path.join(publicDir, file);
        
        if (fs.existsSync(filePath)) {
            console.log(`Updating ${file}...`);
            
            // Read the file content
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Replace the header section
            content = content.replace(
                /<header[\s\S]*?<\/header>/, 
                headerContent
            );
            
            // Update the title if it's the home page
            if (file === 'home.html') {
                content = content.replace(
                    /<title>.*?<\/title>/, 
                    '<title>P-Harmonía - Tu espacio de bienestar</title>'
                );
            }
            
            // Ensure proper meta tags
            content = content.replace(
                /<meta charset="UTF-8">/, 
                '<meta charset="UTF-8">\n    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">'
            );
            
            // Save the updated content
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Updated ${file}`);
        } else {
            console.log(`⚠️  File not found: ${file}`);
        }
    });
    
    console.log('\n🎉 All pages have been updated!');
}

// Run the update
updateHTMLFiles();
