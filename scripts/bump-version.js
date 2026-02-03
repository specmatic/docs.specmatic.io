const fs = require('fs')
const path = require('path')

function exitWithError(msg) {
  console.error(`ERROR: ${msg}`);
  process.exit(1);
}

const productName = process.argv[2];
const productVersion = process.argv[3];

if (!productName || !productVersion) {
  exitWithError("Usage: node bump-version.js <product_name> <product_version>");
}

const filePath = path.join("src", "constants", "specmatic-versions.json");


if (!fs.existsSync(filePath)) {
  exitWithError(`File not found: ${filePath}`);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  console.log(`Current contents of ${filePath}:`, data);
} catch (e) {
  exitWithError(`Invalid JSON in ${filePath}`);
}

const configKey = `${productName}-version`;


if (!(configKey in data)) {
  exitWithError(`Key '${configKey}' not found in ${filePath}`);
}

data[configKey] = productVersion;

fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");