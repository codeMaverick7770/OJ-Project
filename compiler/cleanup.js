const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const folders = ['codes', 'inputs', 'outputs'];

const CLEANUP_INTERVAL_MINUTES = 10; 
cron.schedule(`*/${CLEANUP_INTERVAL_MINUTES} * * * *`, () => {
  console.log(` Running cleanup at ${new Date().toLocaleString()}`);

  folders.forEach(folderName => {
    const folderPath = path.join(__dirname, folderName);

    if (fs.existsSync(folderPath)) {
      fs.readdir(folderPath, (err, files) => {
        if (err) return console.error(`Failed reading ${folderName}:`, err);

        files.forEach(file => {
          const filePath = path.join(folderPath, file);
          fs.unlink(filePath, err => {
            if (err) {
              console.error(`Could not delete file ${filePath}:`, err);
            } else {
              console.log(`Deleted ${filePath}`);
            }
          });
        });
      });
    }
  });
});
