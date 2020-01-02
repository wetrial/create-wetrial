const program = require("commander");
const package = require("../package.json");

program
  .version(package.version)
  .usage("<command> [项目名称]")
  .command("init", "创建新项目")
  .parse(process.argv);
