const https = require('https');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const TEAM_MEMBERS = process.env.TEAM_MEMBERS ? process.env.TEAM_MEMBERS.split(',') : [];
const OUTPUT_FILE = path.join(__dirname, '..', 'team-work-data.json');

async function fetchGitHubFile(username, repo, filepath) {
    const options = {
        hostname: 'api.github.com',
        path: `/repos/${username}/${repo}/contents/${filepath}`,
        headers: {
            'User-Agent': 'Protocol-Prototyping-Site',
            'Accept': 'application/vnd.github.v3+json'
        }
    };

    if (process.env.GITHUB_TOKEN) {
        options.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    return new Promise((resolve, reject) => {
        https.get(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const response = JSON.parse(data);
                        const content = Buffer.from(response.content, 'base64').toString('utf-8');
                        resolve(JSON.parse(content));
                    } catch (error) {
                        reject(new Error(`Failed to parse content from ${username}: ${error.message}`));
                    }
                } else if (res.statusCode === 404) {
                    resolve(null); // Repository or file not found
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                }
            });
        }).on('error', reject);
    });
}

async function fetchAllTeamWork() {
    console.log('Fetching team work from GitHub...');
    const allWork = [];
    
    for (const member of TEAM_MEMBERS) {
        console.log(`Fetching work from ${member}...`);
        try {
            const data = await fetchGitHubFile(member, 'prototyping_work', 'work.json');
            
            if (data && Array.isArray(data)) {
                const memberWork = data.map(item => ({
                    ...item,
                    author: member
                }));
                allWork.push(...memberWork);
                console.log(`  ✓ Found ${memberWork.length} items from ${member}`);
            } else {
                console.log(`  ⚠ No work found for ${member}`);
            }
        } catch (error) {
            console.error(`  ✗ Error fetching from ${member}: ${error.message}`);
        }
    }
    
    // Sort by most recent (assuming work items might have timestamps in the future)
    // For now, just randomize to mix team members
    allWork.sort(() => Math.random() - 0.5);
    
    console.log(`\nTotal work items collected: ${allWork.length}`);
    return allWork;
}

async function main() {
    try {
        if (TEAM_MEMBERS.length === 0) {
            console.error('No team members specified. Set TEAM_MEMBERS environment variable.');
            process.exit(1);
        }
        
        console.log(`Team members: ${TEAM_MEMBERS.join(', ')}\n`);
        
        const teamWork = await fetchAllTeamWork();
        
        // Save to file
        await fs.writeFile(OUTPUT_FILE, JSON.stringify(teamWork, null, 2));
        console.log(`\nData saved to ${OUTPUT_FILE}`);
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}