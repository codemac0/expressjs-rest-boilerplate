const util = require('util');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const exec = util.promisify(require('child_process').exec);
async function exeCmd(command) {
  try {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  } catch {
    (error) => {
      console.log(error);
    };
  }
}

if (process.argv.length < 3) {
  console.log('Please specify the target project directory.');
  console.log('For example:');
  console.log('    npx create-expressjs-rest-app my-app');
  process.exit(1);
}

const ownPath = process.cwd();
const folderName = process.argv[2];
const appPath = path.join(ownPath, folderName);
const repo = 'https://github.com/codemac0/expressjs-rest-boilerplate.git';

try {
  fs.mkdirSync(appPath);
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log('Directory already exists. Please choose another name.');
  } else {
    console.log(error);
  }
  process.exit(1);
}

async function setup() {
  try {
    console.log(`Downloading files from repo ${repo}`);
    await exeCmd(`git clone --depth 1 ${repo} ${folderName}`);
    console.log('Cloned successfully.');
    console.log('');

    process.chdir(appPath);

    console.log('Installing dependencies...');
    await exeCmd('npm install');
    console.log('Dependencies installed successfully.');
    console.log();

    fs.copyFileSync(path.join(appPath, '.env.example'), path.join(appPath, '.env'));
    console.log('Environment files copied.');

    await exeCmd('npx rimraf ./.git');
    fs.unlinkSync(path.join(appPath, 'bin', 'createApp.js'));
    fs.rmdirSync(path.join(appPath, 'bin'));

    console.log('Installation is now complete!');
    console.log();
  } catch (error) {
    console.log(error);
  }
}

setup();