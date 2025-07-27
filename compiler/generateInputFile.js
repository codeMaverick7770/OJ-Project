const fs = require("fs");
const path = require("path");

const dirInputs = path.join(__dirname, "inputs");

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

const generateInputFile = (input, jobId) => {
  const inputFileName = `${jobId}.txt`;
  const inputFilePath = path.join(dirInputs, inputFileName);
  fs.writeFileSync(inputFilePath, input, "utf8");
  console.log(`[📥] Input file written: ${inputFilePath}`);
  console.log(`[ℹ️] Input file size: ${fs.statSync(inputFilePath).size} bytes`);

  return inputFilePath;
};

module.exports = {
  generateInputFile,
};
