const fs = require('fs');
const path = require('path');

const deleteUploadedFiles = (files) => {
    Object.values(files).forEach(fileArray => {
      fileArray.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error(`Error deleting file: ${file.path}`, err);
            }
          });
        } else {
          console.error(`File not found: ${file.path}`);
        }
      });
    });
  };
  
  module.exports = deleteUploadedFiles;