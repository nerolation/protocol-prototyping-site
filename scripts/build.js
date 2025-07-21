const fs = require('fs').promises;
const path = require('path');

const TEAM_WORK_FILE = path.join(__dirname, '..', 'team-work-data.json');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const SRC_FILES = ['index.html', 'styles.css', 'app.js'];

async function generateWorkItemsHTML(workItems) {
    return workItems.map(item => `
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="work-item" data-label="${item.label}">
            <div class="work-header">
                <h3 class="work-title">${escapeHtml(item.title)}</h3>
                <span class="work-label label-${item.label}">${item.label}</span>
            </div>
            <p class="work-description">${escapeHtml(item.description)}</p>
            <div class="work-author">
                <img src="${item.authorAvatar || `https://github.com/${item.author}.png?size=40`}" alt="${item.authorDisplay || item.author}" class="author-avatar">
                <span>${escapeHtml(item.authorDisplay || item.author)}</span>
            </div>
        </a>
    `).join('');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

async function build() {
    console.log('Building static site...\n');
    
    try {
        // Create dist directory
        await fs.mkdir(DIST_DIR, { recursive: true });
        
        // Read team work data
        let teamWork = [];
        try {
            const data = await fs.readFile(TEAM_WORK_FILE, 'utf-8');
            teamWork = JSON.parse(data);
            console.log(`✓ Loaded ${teamWork.length} work items`);
        } catch (error) {
            console.log('⚠ No team work data found. Building empty site.');
        }
        
        // Generate work items HTML
        const workItemsHTML = await generateWorkItemsHTML(teamWork);
        
        // Process and copy files
        for (const file of SRC_FILES) {
            const srcPath = path.join(__dirname, '..', file);
            const distPath = path.join(DIST_DIR, file);
            
            let content = await fs.readFile(srcPath, 'utf-8');
            
            // Inject work items into HTML
            if (file === 'index.html') {
                content = content.replace(
                    '<!-- Work items will be dynamically inserted here -->',
                    workItemsHTML
                );
                
                // Update last updated date
                const date = new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                content = content.replace(
                    '<span id="last-updated"></span>',
                    `<span id="last-updated">${date}</span>`
                );
            }
            
            await fs.writeFile(distPath, content);
            console.log(`✓ Processed ${file}`);
        }
        
        // Create .nojekyll file for GitHub Pages
        await fs.writeFile(path.join(DIST_DIR, '.nojekyll'), '');
        console.log('✓ Created .nojekyll file');
        
        console.log('\n✨ Build complete! Output in dist/');
        
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    build();
}