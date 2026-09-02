const fs = require('fs').promises;
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const SRC_FILES = ['index.html'];

async function build() {
    console.log('Building static site...\n');

    try {
        // Create dist directory
        await fs.mkdir(DIST_DIR, { recursive: true });

        // Copy source files
        for (const file of SRC_FILES) {
            const srcPath = path.join(__dirname, '..', file);
            const distPath = path.join(DIST_DIR, file);

            await fs.copyFile(srcPath, distPath);
            console.log(`✓ Processed ${file}`);
        }

        // Create .nojekyll file for GitHub Pages
        await fs.writeFile(path.join(DIST_DIR, '.nojekyll'), '');
        console.log('✓ Created .nojekyll file');

        // Create CNAME file for custom domain
        await fs.writeFile(path.join(DIST_DIR, 'CNAME'), 'prototyping.ethereum.foundation');
        console.log('✓ Created CNAME file for custom domain');

        console.log('\n✨ Build complete! Output in dist/');

    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    build();
}
