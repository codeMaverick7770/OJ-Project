const { exec } = require("child_process");
const path = require("path");

const executeJava = (filepath) => {
  const dir = path.dirname(filepath);
  const filename = path.basename(filepath);
  const className = filename.split(".")[0];

  return new Promise((resolve, reject) => {
    exec(
      `javac ${filepath} && cd ${dir} && java ${className}`,
      (error, stdout, stderr) => {
        if (error || stderr) return reject({ error, stderr });
        resolve(stdout);
      }
    );
  });
};

module.exports = { executeJava };
