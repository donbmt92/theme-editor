// Upload Configuration for Production
const fs = require('fs');
const path = require('path');

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
  console.log('Creating upload directory:', uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Upload directory created successfully');
} else {
  console.log('Upload directory already exists:', uploadDir);
}

// Check permissions
try {
  fs.accessSync(uploadDir, fs.constants.W_OK);
  console.log('Upload directory is writable');
} catch (error) {
  console.error('Upload directory is not writable:', error.message);
}

module.exports = {
  uploadDir,
  maxFileSize: 20 * 1024 * 1024, // 20MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
};
