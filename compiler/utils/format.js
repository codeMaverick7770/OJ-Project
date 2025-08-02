const fs = require("fs/promises");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");

const JAVA_FORMATTER_PATH = "google-java-format"; 

async function formatCode(language, code) {
  const fileId = uuidv4();
  const tempDir = path.join(process.cwd(), "temp");
  await fs.mkdir(tempDir, { recursive: true });

  let extension;
  let command;

  switch (language.toLowerCase()) {
    case "cpp":
    case "c":
    case "clang":
      extension = "cpp";
      command = `clang-format -i ${fileId}.cpp && cat ${fileId}.cpp`;
      break;

    case "python":
      extension = "py";
      command = `autopep8 --in-place ${fileId}.py && cat ${fileId}.py`;
      break;

    case "javascript":
    case "js":
      extension = "js";
      command = `prettier --write ${fileId}.js && cat ${fileId}.js`;
      break;

    case "java":
      extension = "java";
      command = `${JAVA_FORMATTER_PATH} "${fileId}.java" && cat "${fileId}.java"`;
      break;

    default:
      throw new Error("Unsupported language");
  }

  const fullPath = path.join(tempDir, `${fileId}.${extension}`);
  await fs.writeFile(fullPath, code);

  return new Promise((resolve, reject) => {
    exec(command, { cwd: tempDir }, async (error, stdout, stderr) => {
      try {
        await fs.unlink(fullPath); // delete formatted file
        if (error) {
          console.error(
            `Formatting error for ${language}:`,
            stderr || error.message
          );
          return reject(new Error(stderr || error.message));
        }
        resolve(stdout.trim());
      } catch (cleanupErr) {
        reject(new Error("Cleanup failed: " + cleanupErr.message));
      }
    });
  });
}

module.exports = { formatCode };
