import * as migration_20260623_163632_baseline from './20260623_163632_baseline';

export const migrations = [
  {
    up: migration_20260623_163632_baseline.up,
    down: migration_20260623_163632_baseline.down,
    name: '20260623_163632_baseline'
  },
];
