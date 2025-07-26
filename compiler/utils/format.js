const fs = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const JAVA_FORMATTER_PATH = '/usr/local/bin/google-java-format.jar';

async function formatCode(language, code) {
  const fileId = uuidv4();
  const tempDir = path.join(process.cwd(), 'temp');
  await fs.mkdir(tempDir, { recursive: true });

  let extension;
  let command;
  const fileBase = `${fileId}`;
  const filePath = (ext) => path.join(tempDir, `${fileBase}.${ext}`);

switch (language.toLowerCase()) {
  case 'cpp':
  case 'c':
  case 'clang':
    extension = 'cpp';
    command = `clang-format -i ${fileName}.cpp && cat ${fileName}.cpp`;
    break;

  case 'python':
    extension = 'py';
    command = `autopep8 --in-place ${fileName}.py && cat ${fileName}.py`;
    break;

  case 'javascript':
    extension = 'js';
    command = `npx prettier --stdin-filepath ${fileName}.js < ${fileName}.js`;
    break;

  case 'java':
    extension = 'java';
    command = `java -jar /usr/local/bin/google-java-format.jar -i ${fileName}.java && cat ${fileName}.java`;
    break;

  default:
    throw new Error('Unsupported language');
}


  const fullPath = filePath(extension);
  await fs.writeFile(fullPath, code);

  return new Promise((resolve, reject) => {
    exec(command, { cwd: tempDir }, async (error, stdout, stderr) => {
      try {
        await fs.unlink(fullPath);
        if (error) {
          console.error('Formatting error:', stderr || error.message);
          return reject(new Error(stderr || error.message));
        }
        resolve(stdout.trim());
      } catch (cleanupErr) {
        reject(new Error('Cleanup failed: ' + cleanupErr.message));
      }
    });
  });
}

module.exports = { formatCode };
