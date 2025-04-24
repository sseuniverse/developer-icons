import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cssnano from "cssnano";
import postcss from "postcss";

import { generateIconCompName } from "../utils";
import { createDeveloperIcon } from "../createDeveloperIcon";
import { createCSS } from "../createCSS";
import { iconsData } from "../iconsData";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const svgDir = path.join(__dirname, "../../");

let exportStatement = "";
let cssExportStatement = "";

cssExportStatement += `.di { width: 1rem;  height: 1rem; object-fit: contain; };\n`;
cssExportStatement += `.di-invert { filter: invert(1); };\n`;
cssExportStatement += `.di-invert-0 { filter: invert(0); };\n`;

iconsData.forEach((icon) => {
  //create exportable icon components
  const iconContent = fs.readFileSync(path.join(svgDir, icon.path), "utf-8");
  const iconName = generateIconCompName(icon.name);

  const component = createDeveloperIcon(
    iconName,
    iconContent,
    path.join(svgDir, icon.path)
  );
  fs.writeFileSync(
    path.join(__dirname, "../icons", `${iconName}.tsx`),
    component
  );

  // Create the css file
  const Css = createCSS(icon.id, iconContent);
  cssExportStatement += Css;

  exportStatement += `export * from './${iconName}.tsx';`;
});
fs.writeFileSync(path.join(__dirname, "../icons/index.ts"), exportStatement);

const cssFolder = path.join(__dirname, "../../css");
if (!fs.existsSync(cssFolder)) {
  fs.mkdirSync(cssFolder, { recursive: true });
  console.log("CSS folder created.");
  fs.writeFileSync(
    path.join(__dirname, "../../css/main.css"),
    cssExportStatement
  );
  console.log("CSS file created.");
} else {
  fs.writeFileSync(
    path.join(__dirname, "../../css/main.css"),
    cssExportStatement
  );
}

postcss([cssnano])
  .process(cssExportStatement, { from: undefined })
  .then((result) => {
    fs.writeFileSync(
      path.join(__dirname, "../../css/main.min.css"),
      result.css
    );
  })
  .catch((err) => {
    console.error("Error minifying CSS:", err);
  });
