const { exec } = require("child_process");
const path = require("path");

const sanitize = (str) => path.basename(str);

const executePython = (filepath, inputPath) => {
  const jobId = sanitize(filepath).split(".")[0];
  const codeFileName = sanitize(filepath);
  const inputFileName = sanitize(inputPath);

  return new Promise((resolve, reject) => {
    const command = `
      docker run --rm --name=py-${jobId} \
      --cpus="0.5" --memory="128m" --network=none \
      -v ${filepath}:/app/${codeFileName}:ro \
      -v ${inputPath}:/app/${inputFileName}:ro \
      code-runner \
      bash -c "timeout 4s python /app/${codeFileName} < /app/${inputFileName}"
    `;

    exec(command, { timeout: 7000 }, (error, stdout, stderr) => {
      if (error) return reject({ error, stderr });
      if (stderr) return reject({ stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executePython };
