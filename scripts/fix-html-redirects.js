#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * This script fixes the issue where redirect files are generated as .html.html
 * instead of .html when using trailingSlash: false in Docusaurus.
 *
 * It renames all *.html.html files to *.html in the build directory.
 */

const buildDir = path.join(__dirname, '..', 'build');

function renameHtmlHtmlFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      renameHtmlHtmlFiles(filePath);
    } else if (file.endsWith('.html.html')) {
      const newPath = filePath.replace(/\.html\.html$/, '.html');
      console.log(`Renaming: ${filePath} -> ${newPath}`);
      fs.renameSync(filePath, newPath);
    }
  }
}

console.log('Fixing .html.html redirect files...');
renameHtmlHtmlFiles(buildDir);
console.log('Done!');
