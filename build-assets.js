const fs = require('fs');
const path = require('path');

const dirs = [
  'assets/css',
  'assets/js',
  'assets/images/common',
  'assets/images/home1',
  'assets/images/home2',
  'assets/images/about',
  'assets/images/services',
  'assets/images/portfolio',
  'assets/images/packages',
  'assets/images/blog',
  'assets/images/contact',
  'assets/images/auth'
];

dirs.forEach(d => {
  const fullPath = path.join(__dirname, d);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

console.log('Directories created successfully.');
