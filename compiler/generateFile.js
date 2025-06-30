const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

const dirCodes = path.join(__dirname, 'codes');

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (language, content) => {
    const jobID = uuid();
    let filename;

    if (language === 'java') {
        filename = `Main.java`; // Java class must match filename
    } else {
        filename = `${jobID}.${language}`;
    }

    const filePath = path.join(dirCodes, filename);
    fs.writeFileSync(filePath, content);
    return filePath;
};

module.exports = {
    generateFile,
};
