const fs = require('fs');
const path = require('path');

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (language, content, jobId) => {
    let filename;

    if (language === 'java') {
        filename = `Main.java`; // Java must be Main.java
    } else {
        filename = `${jobId}.${language}`;
    }

    const filePath = path.join(dirCodes, filename);
    fs.writeFileSync(filePath, content);
    return filePath;
};

module.exports = {
    generateFile,
};
