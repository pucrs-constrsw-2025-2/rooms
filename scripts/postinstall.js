// NOTE: resources are served by another microservice. Do not implement here.
const { spawnSync } = require('node:child_process');

const shouldSkip =
  process.env.SKIP_PRISMA_GENERATE === '1' ||
  process.env.npm_config_package_lock_only === 'true';

if (shouldSkip) {
  process.exit(0);
}

const binary = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(binary, ['prisma', 'generate'], {
  stdio: 'inherit',
  shell: false,
});

process.exit(result.status ?? 0);

