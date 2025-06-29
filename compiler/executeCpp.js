const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

/*
 * Helper responsible for compiling **and then executing** a C++ program that
 * was previously written to disk (see `generateFile.js`).
 *
 * How it works – high-level overview:
 * 1. Determine a dedicated output directory `outputs/` (created on the fly).
 * 2. Build a unique output filename that shares the UUID with the source file.
 * 3. Run the compilation command using the system's `g++` tool.
 * 4. If compilation succeeds, immediately execute the produced binary and
 *    capture its stdout/stderr so we can relay the result back to the client.
 *
 * The function is OS-aware: Windows expects a `.exe` artifact while Unix-like
 * systems (Linux/macOS) are happy with any executable bit, we simply use `.out`.
 */

const executeCpp = (filepath) => {
    const jobId = path.basename(filepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.exe`);

    return new Promise((resolve, reject) => {
        exec(
            `g++ ${filepath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe`,
            (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stderr });
                }
                if (stderr) {
                    reject(stderr);
                }
                resolve(stdout);
            }
        );
    });
};

module.exports = {
    executeCpp,
};