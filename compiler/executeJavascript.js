const { exec } = require("child_process");

const executeJavascript = (filepath, inputPath) => {
  return new Promise((resolve, reject) => {
    const command = `node ${filepath} < ${inputPath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject({ error, stderr });
      if (stderr) return reject({ stderr });
      resolve(stdout);
    });
  });
};

module.exports = {
  executeJavascript,
};
