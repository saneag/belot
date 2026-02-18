import * as fs from "fs";

const paths = ["android/build", "android/app/.cxx", "android/app/build"];

paths.forEach((p) => {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log("Removed:", p);
  }
});
