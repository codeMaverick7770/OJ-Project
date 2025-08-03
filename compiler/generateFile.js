const fs = require("fs");
const path = require("path");

const dirCodes = path.join(__dirname, "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

const generateFile = (language, content, jobId) => {
  let filename;

  if (language === "java") {
    // Sanitize jobId to ensure valid Java identifier
    const safeId = jobId.replace(/[^a-zA-Z0-9]/g, "");
    const className = `Main_${safeId}`;
    filename = `${className}.java`;

    // Replace 'public class Main' with 'public class Main_XXXXX'
    content = content.replace(/public\s+class\s+Main/, `public class ${className}`);
  } else {
    filename = `${jobId}.${language}`;
  }

  const filePath = path.join(dirCodes, filename);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`[📝] Code file written: ${filePath}`);
  console.log(`[ℹ️] Code file size: ${fs.statSync(filePath).size} bytes`);

  return filePath;
};

module.exports = {
  generateFile,
};
