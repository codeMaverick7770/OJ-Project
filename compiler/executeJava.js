const { exec } = require("child_process");
const path = require("path");

const executeJava = (filepath, inputPath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const dir = path.dirname(filepath);

    return new Promise((resolve, reject) => {
        const command = `javac ${filepath} && cd ${dir} && java ${jobId} < ${inputPath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) return reject({ error, stderr });
            if (stderr) return reject({ stderr });
            resolve(stdout);
        });
    });
};

module.exports = {
    executeJava,
};
