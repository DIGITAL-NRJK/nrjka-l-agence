import * as migration_20260623_163632_baseline from './20260623_163632_baseline';
import * as migration_20260630_103332_slug_localized from './20260630_103332_slug_localized';
import * as migration_20260630_152310_link_labels_localized from './20260630_152310_link_labels_localized';
import * as migration_20260702_132602_theming_palette from './20260702_132602_theming_palette';
import * as migration_20260702_135336_theming_palette_vague2 from './20260702_135336_theming_palette_vague2';
import * as migration_20260702_201244_theming_palettes_saisonnieres from './20260702_201244_theming_palettes_saisonnieres';
import * as migration_20260703_165000_blocks_hidden from './20260703_165000_blocks_hidden';

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
    name: '20260702_135336_theming_palette_vague2',
  },
  {
    up: migration_20260702_201244_theming_palettes_saisonnieres.up,
    down: migration_20260702_201244_theming_palettes_saisonnieres.down,
    name: '20260702_201244_theming_palettes_saisonnieres',
  },
  {
    up: migration_20260703_165000_blocks_hidden.up,
    down: migration_20260703_165000_blocks_hidden.down,
    name: '20260703_165000_blocks_hidden'
  },
];
