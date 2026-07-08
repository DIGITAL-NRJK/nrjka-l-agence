import * as migration_20260623_163632_baseline from './20260623_163632_baseline';
import * as migration_20260630_103332_slug_localized from './20260630_103332_slug_localized';
import * as migration_20260630_152310_link_labels_localized from './20260630_152310_link_labels_localized';
import * as migration_20260702_132602_theming_palette from './20260702_132602_theming_palette';
import * as migration_20260702_135336_theming_palette_vague2 from './20260702_135336_theming_palette_vague2';
import * as migration_20260702_201244_theming_palettes_saisonnieres from './20260702_201244_theming_palettes_saisonnieres';
import * as migration_20260703_165000_blocks_hidden from './20260703_165000_blocks_hidden';
import * as migration_20260703_175226_megamenu_label_en from './20260703_175226_megamenu_label_en';
import * as migration_20260706_102407_add_chatbot_collections from './20260706_102407_add_chatbot_collections';
import * as migration_20260707_204512_add_nav_subitems from './20260707_204512_add_nav_subitems';
import * as migration_20260708_061934 from './20260708_061934';

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
    name: '20260703_165000_blocks_hidden',
  },
  {
    up: migration_20260703_175226_megamenu_label_en.up,
    down: migration_20260703_175226_megamenu_label_en.down,
    name: '20260703_175226_megamenu_label_en',
  },
  {
    up: migration_20260706_102407_add_chatbot_collections.up,
    down: migration_20260706_102407_add_chatbot_collections.down,
    name: '20260706_102407_add_chatbot_collections',
  },
  {
    up: migration_20260707_204512_add_nav_subitems.up,
    down: migration_20260707_204512_add_nav_subitems.down,
    name: '20260707_204512_add_nav_subitems',
  },
  {
    up: migration_20260708_061934.up,
    down: migration_20260708_061934.down,
    name: '20260708_061934'
  },
];
