const execSync = require("child_process").execSync;

const arg = process.argv.slice(2).join(' ') || "Updates";

execSync('react-scripts build && gh-pages -d build -b build', { stdio: [0, 1, 2] });
execSync(`git add . && git commit -m "${arg}" && git push`, { stdio: [0, 1, 2] });