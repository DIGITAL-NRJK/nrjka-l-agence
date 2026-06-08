import * as migration_20260319_165018_initial from './20260319_165018_initial';
import * as migration_20260323_180330 from './20260323_180330';
import * as migration_20260608_122534_localization from './20260608_122534_localization';
import * as migration_20260608_135223_hero_home from './20260608_135223_hero_home';
import * as migration_20260608_205600_hero_panel_d4 from './20260608_205600_hero_panel_d4';

export const migrations = [
  {
    up: migration_20260319_165018_initial.up,
    down: migration_20260319_165018_initial.down,
    name: '20260319_165018_initial',
  },
  {
    up: migration_20260323_180330.up,
    down: migration_20260323_180330.down,
    name: '20260323_180330',
  },
  {
    up: migration_20260608_122534_localization.up,
    down: migration_20260608_122534_localization.down,
    name: '20260608_122534_localization',
  },
  {
    up: migration_20260608_135223_hero_home.up,
    down: migration_20260608_135223_hero_home.down,
    name: '20260608_135223_hero_home',
  },
  {
    up: migration_20260608_205600_hero_panel_d4.up,
    down: migration_20260608_205600_hero_panel_d4.down,
    name: '20260608_205600_hero_panel_d4'
  },
];
