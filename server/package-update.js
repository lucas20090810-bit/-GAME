const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const crypto = require('crypto');

/**
 * Package the dist folder into a ZIP for OTA updates
 */
function packageUpdate() {
    return new Promise((resolve, reject) => {
        const distPath = path.join(__dirname, '../dist');
        const outputDir = path.join(__dirname, 'public/updates');
        const outputPath = path.join(outputDir, 'latest.zip');

        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Create zip archive
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`✅ Update bundle created: ${archive.pointer()} bytes`);

            // Generate checksum
            const fileBuffer = fs.readFileSync(outputPath);
            const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

            // Read package.json for version (no cache)
            const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

            // Create manifest
            const manifest = {
                version: packageJson.version,
                ota_version: Date.now().toString(),
                url: 'https://game-xhnj.onrender.com/updates/latest.zip',
                downloadUrl: 'https://game-xhnj.onrender.com/updates/latest.zip',
                checksum: hash,
            };

            fs.writeFileSync(
                path.join(outputDir, 'manifest.json'),
                JSON.stringify(manifest, null, 2)
            );

            console.log('📦 Manifest created:', manifest);
            resolve(manifest);
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);
        archive.directory(distPath, false);
        archive.finalize();
    });
}

// Run if called directly
if (require.main === module) {
    console.log('📦 Packaging update bundle...');
    packageUpdate();
}

module.exports = { packageUpdate };
