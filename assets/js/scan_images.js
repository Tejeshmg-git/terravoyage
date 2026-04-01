const fs = require('fs');
const path = require('path');

function getFiles(dir, files_) {
    files_ = files_ || [];
    const files = fs.readdirSync(dir);
    for (const i in files) {
        const name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            if (name.endsWith('.html')) files_.push(name);
        }
    }
    return files_;
}

const allFiles = getFiles('c:/Users/tejes/Desktop/TerraVoyage');

allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const regex = /<img[^>]+src="([^"]+)"/g;
    let match;
    console.log(`--- FILE: ${file} ---`);
    while ((match = regex.exec(content)) !== null) {
        console.log(match[1]);
    }
});
