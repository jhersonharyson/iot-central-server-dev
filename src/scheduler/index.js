import path from "path";
import { readdirSync } from "fs";

export default function(context) {
  readdirSync(path.join(__dirname))
    .filter(fileName => fileName !== "index.js" && !fileName.endsWith(".map"))
    .forEach(fileName => {
      require(path.join(__dirname, path.basename(fileName))).default(context);
    });
}
