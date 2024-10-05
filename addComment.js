const fs = require("fs");
const path = require("path");
const util = require("util");
const setTimeoutPromise = util.promisify(setTimeout);

// Function to recursively get all .ts and .tsx files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith(".ts") || file.endsWith(".tsx")) {
        arrayOfFiles.push(fullPath);
        console.log(`Found file: ${fullPath}`);
      }
    }
  });
  return arrayOfFiles;
}

// Function to prepend a comment with the relative path and file name
async function prependCommentToFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  const fileName = path.basename(filePath);
  const comment = `// File: ${relativePath}\n\n`;
  const fileContent = fs.readFileSync(filePath, "utf8");
  if (!fileContent.startsWith("// File:")) {
    const newContent = comment + fileContent;
    await setTimeoutPromise(100); // Wait 100ms
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log(`Added comment to ${relativePath}`);
  } else {
    console.log(`Skipped ${relativePath} (already has comment)`);
  }
}

// Define the src directory
const srcDir = path.join(__dirname, "helpers");
console.log(`Source directory: ${srcDir}`);

// Get all .ts and .tsx files in the src directory
const tsFiles = getAllFiles(srcDir);

// Prepend the comment to each file
async function processFiles() {
  for (const file of tsFiles) {
    await prependCommentToFile(file);
  }
  console.log("Done!");
}

processFiles().catch(console.error);
