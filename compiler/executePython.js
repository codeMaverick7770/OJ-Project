const { exec } = require("child_process");

const executePython = (filepath) => {
  return new Promise((resolve, reject) => {
    exec(`python "${filepath}"`, (error, stdout, stderr) => {
      if (error || stderr) return reject({ error, stderr });
      resolve(stdout);
    });
  });
};

module.exports = { executePython };
