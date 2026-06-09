import * as migration_20260319_165018_initial from './20260319_165018_initial';
import * as migration_20260323_180330 from './20260323_180330';
import * as migration_20260608_122534_localization from './20260608_122534_localization';
import * as migration_20260608_135223_hero_home from './20260608_135223_hero_home';
import * as migration_20260608_205600_hero_panel_d4 from './20260608_205600_hero_panel_d4';
import * as migration_20260609_090859_promise_block from './20260609_090859_promise_block';
import * as migration_20260609_095221_pillars_block from './20260609_095221_pillars_block';
import * as migration_20260609_105343_method_block from './20260609_105343_method_block';
import * as migration_20260609_122602_lab_block from './20260609_122602_lab_block';
import * as migration_20260609_130934_lab_demos from './20260609_130934_lab_demos';
import * as migration_20260609_141705_lab_sandbox from './20260609_141705_lab_sandbox';
import * as migration_20260609_173235_lab_security_preview from './20260609_173235_lab_security_preview';
import * as migration_20260609_182656_commitments_block from './20260609_182656_commitments_block';

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
    name: '20260608_205600_hero_panel_d4',
  },
  {
    up: migration_20260609_090859_promise_block.up,
    down: migration_20260609_090859_promise_block.down,
    name: '20260609_090859_promise_block',
  },
  {
    up: migration_20260609_095221_pillars_block.up,
    down: migration_20260609_095221_pillars_block.down,
    name: '20260609_095221_pillars_block',
  },
  {
    up: migration_20260609_105343_method_block.up,
    down: migration_20260609_105343_method_block.down,
    name: '20260609_105343_method_block',
  },
  {
    up: migration_20260609_122602_lab_block.up,
    down: migration_20260609_122602_lab_block.down,
    name: '20260609_122602_lab_block',
  },
  {
    up: migration_20260609_130934_lab_demos.up,
    down: migration_20260609_130934_lab_demos.down,
    name: '20260609_130934_lab_demos',
  },
  {
    up: migration_20260609_141705_lab_sandbox.up,
    down: migration_20260609_141705_lab_sandbox.down,
    name: '20260609_141705_lab_sandbox',
  },
  {
    up: migration_20260609_173235_lab_security_preview.up,
    down: migration_20260609_173235_lab_security_preview.down,
    name: '20260609_173235_lab_security_preview',
  },
  {
    up: migration_20260609_182656_commitments_block.up,
    down: migration_20260609_182656_commitments_block.down,
    name: '20260609_182656_commitments_block'
  },
];
