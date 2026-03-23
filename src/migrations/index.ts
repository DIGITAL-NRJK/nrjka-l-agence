import * as migration_20260319_165018_initial from './20260319_165018_initial';
import * as migration_20260323_180330 from './20260323_180330';

export const migrations = [
  {
    up: migration_20260319_165018_initial.up,
    down: migration_20260319_165018_initial.down,
    name: '20260319_165018_initial',
  },
  {
    up: migration_20260323_180330.up,
    down: migration_20260323_180330.down,
    name: '20260323_180330'
  },
];
