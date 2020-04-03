const Generator = require('yeoman-generator');
const glob = require('glob');
const { statSync } = require('fs');
const { basename } = require('path');
const debug = require('debug')('create-wetrial:ModulesBaseGenerator');

function noop() {
  return true;
}

class ModulesBaseGenerator extends Generator {
  constructor(opts) {
    super(opts);
    this.opts = opts;
    this.name = opts.name;
  }

  isTsFile(f) {
    return f.endsWith('.ts') || f.endsWith('.tsx') || !!/(tsconfig\.json)/g.test(f);
  }

  writeFiles({ context, filterFiles = noop }) {
    debug(`context: ${JSON.stringify(context)}`);
    glob
      .sync('**/*', {
        cwd: this.templatePath(),
        dot: true,
      })
      .filter(filterFiles)
      //.filter(file => !file.includes('welcomeImgs'))
      .forEach((file) => {
        debug(`copy ${file}`);
        const filePath = this.templatePath(file);
        if (statSync(filePath).isFile()) {
          this.fs.copy(this.templatePath(filePath), this.destinationPath(file.replace(/^_/, '.')));
        }
      });
  }

  prompt(questions) {
    process.send && process.send({ type: 'prompt' });
    process.emit('message', { type: 'prompt' });
    return super.prompt(questions);
  }
}

module.exports = ModulesBaseGenerator;
