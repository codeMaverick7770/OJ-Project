const fs = require('fs/promises');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

async function formatCode(language, code) {
  const fileId = uuidv4();

  const tempDir = path.join(process.cwd(), 'temp');
  await fs.mkdir(tempDir, { recursive: true });

  let extension;
  let command;

  switch (language) {
    case 'cpp':
      extension = 'cpp';
      command = `clang-format ${fileId}.cpp`;
      break;
    case 'python':
      extension = 'py';
      command = `autopep8 ${fileId}.py`;
      break;
    case 'javascript':
      extension = 'js';
      command = `npx prettier --stdin-filepath ${fileId}.js < ${fileId}.js`;
      break;
    case 'java':
      extension = 'java';
      command = `npx google-java-format -i ${fileId}.java && type ${fileId}.java`;
      break;
    default:
      throw new Error('Unsupported language');
  }

  const filePath = path.join(tempDir, `${fileId}.${extension}`);
  await fs.writeFile(filePath, code);

  return new Promise((resolve, reject) => {
    exec(command, { cwd: tempDir }, async (error, stdout, stderr) => {
      try {
        await fs.unlink(filePath); // cleanup

        if (error) {
          return reject(new Error(stderr || error.message));
        }

        const formatted =
          stdout || (language === 'java'
            ? await fs.readFile(filePath, 'utf8') // java modifies in-place
            : '');

        resolve(formatted.trim());
      } catch (cleanupErr) {
        reject(new Error('Cleanup failed'));
      }
    });
  });
}

module.exports = { formatCode };
