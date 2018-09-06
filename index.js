const yargs = require('yargs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const argv = yargs
  .usage('$0 version')
  .option('config', {
    alias: 'c',
    default: './publish.config.js',
    describe: 'path to config file'
  })
  .option('variant', {
    alias: 'v',
    array: true,
    describe: 'Process only selected variant'
  })
  .option('dry-run', {
    alias: 'd',
    boolean: true,
    describe: 'Run all step except for final publish'
  })
  .demandCommand(1, 'version is required')
  .help()
  .argv

const config = require(argv.config);
const version = argv._[0];
const availableVariants = Object.keys(config.variants)
  .filter(val => !argv.v || !argv.v.includes(v))

if (argv['dry-run']) {
  console.info('DRY RUN!!!!')
}
run();

async function run() {
  try {
    for (let key of availableVariants) {
      await processVariant(config.variants[key]);
    }
    // Finish with git-tag and base version
    await execCmd(`npm version ${version} --allow-same-version`);
  } catch (e) {
    if (e.cmd) {
      console.error(`Failed step "${e.cmd}"\n${e.stderr}`);
    } else {
      console.error(e);
    }
  }
}

async function processVariant({ steps = [], suffix = '', tag = 'latest' }) {
  for (let cmd of steps) {
    await execCmd(cmd);
  }
  await execCmd(`npm version ${version}${suffix} --no-git-tag-version --allow-same-version`);

  if (argv['dry-run']) {
    console.info(`npm publish --tag ${tag}`)
  } else {
    await execCmd(`npm publish --tag ${tag}`);
  }
}

async function execCmd(cmd) {
  console.info(`>> ${cmd}`);
  const { stdout, stderr } = await exec(cmd);
  if (argv['dry-run']) {
    console.info(stdout, stderr)
  }
}