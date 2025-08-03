const { exec } = require("child_process");
const path = require("path");

const sanitize = (str) => path.basename(str);

const executeJavascript = (filepath, inputPath) => {
  const jobId = sanitize(filepath).split(".")[0];
  const containerName = `js-${jobId}`;
  const codeFileName = sanitize(filepath);
  const inputFileName = sanitize(inputPath);

  return new Promise((resolve, reject) => {
    const command = `
      docker run --rm --name=${containerName} \
      --cpus="0.5" --memory="128m" --network=none \
      -v ${filepath}:/app/${codeFileName}:ro \
      -v ${inputPath}:/app/${inputFileName}:ro \
      029864682293.dkr.ecr.eu-north-1.amazonaws.com/code-runner bash -c "timeout 4s node /app/${codeFileName} < /app/${inputFileName}"
    `;

    exec(command, { timeout: 7000 }, (error, stdout, stderr) => {
      if (error) return reject({ error, stderr });
      if (stderr) return reject({ stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executeJavascript };
