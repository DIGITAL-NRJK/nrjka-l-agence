import * as migration_20260623_163632_baseline from './20260623_163632_baseline';
import * as migration_20260630_103332_slug_localized from './20260630_103332_slug_localized';
import * as migration_20260630_152310_link_labels_localized from './20260630_152310_link_labels_localized';
import * as migration_20260702_132602_theming_palette from './20260702_132602_theming_palette';
import * as migration_20260702_135336_theming_palette_vague2 from './20260702_135336_theming_palette_vague2';

export const migrations = [
  {
    up: migration_20260623_163632_baseline.up,
    down: migration_20260623_163632_baseline.down,
    name: '20260623_163632_baseline',
  },
  {
    up: migration_20260630_103332_slug_localized.up,
    down: migration_20260630_103332_slug_localized.down,
    name: '20260630_103332_slug_localized',
  },
  {
    up: migration_20260630_152310_link_labels_localized.up,
    down: migration_20260630_152310_link_labels_localized.down,
    name: '20260630_152310_link_labels_localized',
  },
  {
    up: migration_20260702_132602_theming_palette.up,
    down: migration_20260702_132602_theming_palette.down,
    name: '20260702_132602_theming_palette',
  },
  {
    up: migration_20260702_135336_theming_palette_vague2.up,
    down: migration_20260702_135336_theming_palette_vague2.down,
    name: '20260702_135336_theming_palette_vague2'
  },
];
