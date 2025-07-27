const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const sanitize = (str) => path.basename(str).replace(/[^\w.-]/g, ""); // Remove special chars

const executeJava = (filepath, inputPath) => {
  const rawFilename = sanitize(filepath);
  const jobId = rawFilename.split("_")[0]; // Extract jobId from sanitized filename
  const className = `${jobId}_Main`;       // Match class name with filename
  const containerName = `java-${jobId}`;

  const codeFileName = sanitize(filepath);
  const inputFileName = sanitize(inputPath);

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filepath)) {
      return reject({ stderr: `Code file not found: ${filepath}` });
    }

    const command = `
      docker run --rm --name="${containerName}" \
      --cpus="0.5" --memory="128m" --network=none \
      -v "${filepath}":"/app/${codeFileName}":ro \
      -v "${inputPath}":"/app/${inputFileName}":ro \
      code-runner bash -c "javac /app/${codeFileName} && timeout 4s java -cp /app ${className} < /app/${inputFileName}"
    `;

    exec(command, { timeout: 7000 }, (error, stdout, stderr) => {
      if (error) return reject({ error, stderr });
      if (stderr) return reject({ stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executeJava };
