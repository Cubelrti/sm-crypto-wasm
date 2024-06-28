import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import commandExists from 'command-exists';
import { watch } from 'chokidar';
import which from 'which';
import { homedir } from 'os';

const error = (msg) => console.error(msg);
let info = (msg) => console.log(msg);

function findWasmPack() {
  if (process.env['WASM_PACK_PATH'] !== undefined) {
    return process.env['WASM_PACK_PATH'];
  }

  const inPath = which.sync('wasm-pack', { nothrow: true });
  if (inPath) {
    return inPath;
  }

  const inCargo = path.join(homedir(), '.cargo', 'bin', 'wasm-pack');
  if (fs.existsSync(inCargo)) {
    return inCargo;
  }
}

function wasmPackPlugin(options = {}) {
  let ranInitialCompilation = false;
  const crateDirectory = options.crateDirectory || '.';
  const forceWatch = options.forceWatch;
  const forceMode = options.forceMode;
  const args = (options.args || '--verbose').trim().split(' ').filter(x => x);
  const extraArgs = (options.extraArgs || '').trim().split(' ').filter(x => x);
  const outDir = options.outDir || 'pkg';
  const outName = options.outName || 'index';
  const watchDirectories = (options.watchDirectories || []).concat(path.resolve(crateDirectory, 'src'));
  const watchFiles = [path.resolve(crateDirectory, 'Cargo.toml')];

  if (options.pluginLogLevel && options.pluginLogLevel !== 'info') {
    info = () => { };
  }

  let isDebug = true;
  let pluginError = null;

  function makeEmpty() {
    try {
      fs.mkdirSync(outDir, { recursive: true });
    } catch (e) {
      if (e.code !== 'EEXIST') {
        throw e;
      }
    }

    fs.writeFileSync(path.join(outDir, outName + '.js'), '');
  }

  async function checkWasmPack() {
    info('🧐  Checking for wasm-pack...\n');

    const bin = findWasmPack();
    if (bin) {
      info('✅  wasm-pack is installed at ' + bin + '. \n');
      return true;
    }

    info('ℹ️  Installing wasm-pack \n');

    if (commandExists.sync('npm')) {
      return runProcess('npm', ['install', '-g', 'wasm-pack'], { stdio: ['ignore', 'inherit', 'inherit'] }).catch(e => {
        error('⚠️ could not install wasm-pack globally when using npm, you must have permission to do this');
        throw e;
      });
    } else if (commandExists.sync('yarn')) {
      return runProcess('yarn', ['global', 'add', 'wasm-pack'], { stdio: ['ignore', 'inherit', 'inherit'] }).catch(e => {
        error('⚠️ could not install wasm-pack globally when using yarn, you must have permission to do this');
        throw e;
      });
    } else {
      error('⚠️ could not install wasm-pack, you must have yarn or npm installed');
    }
    return false;
  }

  function compile(watching) {
    info(`ℹ️  Compiling your crate in ${isDebug ? 'development' : 'release'} mode...\n`);

    return fs.promises.stat(crateDirectory)
      .then(stats => {
        if (!stats.isDirectory()) {
          throw new Error(`${crateDirectory} is not a directory`);
        }
      })
      .then(() => spawnWasmPack({ outDir, outName, isDebug, cwd: crateDirectory, args, extraArgs }))
      .then(detail => {
        pluginError = null;
        if (detail) {
          info(detail);
        }
        info('✅  Your crate has been correctly compiled\n');
      })
      .catch(e => {
        pluginError = e;
        if (watching) {
          makeEmpty();
        }
      });
  }

  function spawnWasmPack({ outDir, outName, isDebug, cwd, args, extraArgs }) {
    const bin = findWasmPack();

    const allArgs = [
      ...args,
      'build',
      '--out-dir',
      outDir,
      '--out-name',
      outName,
      ...(isDebug ? ['--dev'] : []),
      ...extraArgs,
    ];

    const options = {
      cwd,
      stdio: 'inherit',
    };

    return runProcess(bin, allArgs, options);
  }

  function runProcess(bin, args, options) {
    return new Promise((resolve, reject) => {
      const p = spawn(bin, args, options);

      p.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error('Rust compilation.'));
        }
      });

      p.on('error', reject);
    });
  }

  return {
    name: 'vite-plugin-wasm-pack',
    async buildStart() {
      isDebug = forceMode ? forceMode === 'development' : process.env.NODE_ENV === 'development';

      makeEmpty();

      if (!ranInitialCompilation) {
        ranInitialCompilation = true;
        await checkWasmPack();
        if (forceWatch || (forceWatch === undefined && process.env.WATCH)) {
          const watcher = watch([...watchDirectories, ...watchFiles], {
            persistent: true,
          });

          watcher.on('all', () => {
            compile(true);
          });
        }
        await compile(false);
      }
    },
    generateBundle() {
      if (pluginError != null) {
        this.error(pluginError);
      }
    },
  };
}

export default wasmPackPlugin;
