import fs from "fs";
import path from "path";

const currentDir = new URL(".", import.meta.url).pathname;
const localesDirectory = path.join(currentDir, "public", "locales"); // Replace with the path to your translation files directory
const availableLanguages = [];

fs.readdirSync(localesDirectory).forEach((folder) => {
  const folderPath = path.join(localesDirectory, folder);
  if (fs.statSync(folderPath).isDirectory()) {
    availableLanguages.push(folder);
  }
});

// // Define the file path for the output JSON file
const outputPath = path.join(
  currentDir,
  "src",
  "data",
  "availableLanguages.json",
);

// Convert the availableLanguages array to JSON
const languagesJSON = JSON.stringify(availableLanguages, null, 2);

// Write the JSON to the file
fs.writeFileSync(outputPath, languagesJSON);
