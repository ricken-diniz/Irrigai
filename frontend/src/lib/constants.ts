/**
 * Constantes compartilhadas derivadas diretamente do backend.
 *
 * crop_type  → src/constants/crop_keys.py  (CropKey enum)
 * labels PT  → src/constants/crop_to_pt.json
 * irrigation → src/constants/efficiency.py  (EFFICIENCY dict)
 */

// ── Crop Types ─────────────────────────────────────────────────────────────
// Keys vêm do CropKey (StrEnum) do backend; labels do crop_to_pt.json.

export const CROP_TYPES: { value: string; label: string }[] = [
  { value: 'broccoli', label: 'Brócolis' },
  { value: 'cabbage', label: 'Repolho' },
  { value: 'carrot', label: 'Cenoura' },
  { value: 'cauliflower', label: 'Couve-flor' },
  { value: 'celery', label: 'Aipo' },
  { value: 'cruciferous_crops', label: 'Crucíferas' },
  { value: 'lettuce', label: 'Alface' },
  { value: 'dry_onion', label: 'Cebola Seca' },
  { value: 'green_onion', label: 'Cebola Verde' },
  { value: 'onion_for_seed', label: 'Cebola para Semente' },
  { value: 'spinach', label: 'Espinafre' },
  { value: 'radish', label: 'Rabanete' },
  { value: 'eggplant', label: 'Berinjela' },
  { value: 'sweet_pepper', label: 'Pimentão' },
  { value: 'tomato', label: 'Tomate' },
  { value: 'melon', label: 'Melão' },
  { value: 'cucumber', label: 'Pepino' },
  { value: 'winter_squash', label: 'Abóbora de Inverno' },
  { value: 'zucchini', label: 'Abobrinha' },
  { value: 'muskmelon', label: 'Melão Doce' },
  { value: 'watermelon', label: 'Melancia' },
  { value: 'table_beet', label: 'Beterraba de Mesa' },
  { value: 'cassava', label: 'Mandioca' },
  { value: 'potato', label: 'Batata' },
  { value: 'sweet_potato', label: 'Batata-doce' },
  { value: 'sugar_beet', label: 'Beterraba Açucareira' },
  { value: 'green_beans', label: 'Feijão-vagem' },
  { value: 'dry_beans', label: 'Feijão Seco' },
  { value: 'dry_fava_beans', label: 'Fava Seca' },
  { value: 'green_fava_beans', label: 'Fava Verde' },
  { value: 'cowpeas', label: 'Feijão-caupi' },
  { value: 'peanut', label: 'Amendoim' },
  { value: 'lentils', label: 'Lentilha' },
  { value: 'peas', label: 'Ervilha' },
  { value: 'soybean', label: 'Soja' },
  { value: 'artichoke', label: 'Alcachofra' },
  { value: 'asparagus', label: 'Aspargo' },
  { value: 'cotton', label: 'Algodão' },
  { value: 'flax', label: 'Linho' },
  { value: 'castor_bean', label: 'Mamona' },
  { value: 'safflower', label: 'Cártamo' },
  { value: 'sesame', label: 'Gergelim' },
  { value: 'sunflower', label: 'Girassol' },
  { value: 'barley_oats_wheat', label: 'Cevada, Aveia e Trigo' },
  { value: 'winter_wheat', label: 'Trigo de Inverno' },
  { value: 'small_grains', label: 'Grãos' },
  { value: 'grain_corn', label: 'Milho para Grão' },
  { value: 'sweet_corn', label: 'Milho Doce' },
  { value: 'millet', label: 'Milheto' },
  { value: 'sorghum', label: 'Sorgo' },
  { value: 'rice', label: 'Arroz' },
  { value: 'alfalfa_full_season', label: 'Alfafa - Temporada Completa' },
  { value: 'alfalfa_first_cutting', label: 'Alfafa - Primeiro Corte' },
  { value: 'alfalfa_subsequent_cuttings', label: 'Alfafa - Cortes Subsequentes' },
  { value: 'bermudagrass_for_seed', label: 'Capim-Bermuda para Semente' },
  { value: 'bermudagrass_hay', label: 'Capim-Bermuda para Feno' },
  { value: 'grasses', label: 'Pastagens' },
  { value: 'sudan_grass_first_cutting', label: 'Capim-Sudão - Primeiro Corte' },
  { value: 'sudan_grass_subsequent_cuttings', label: 'Capim-Sudão - Cortes Subsequentes' },
  { value: 'plant_cane', label: 'Cana-de-açúcar (Plantio)' },
  { value: 'ratoon_cane', label: 'Cana-de-açúcar (Soca)' },
  { value: 'banana_first_year', label: 'Banana - Primeiro Ano' },
  { value: 'banana_second_year', label: 'Banana - Segundo Ano' },
  { value: 'pineapple', label: 'Abacaxi' },
  { value: 'grapes', label: 'Uva' },
  { value: 'hops', label: 'Lúpulo' },
  { value: 'citrus', label: 'Citros' },
  { value: 'deciduous_orchard', label: 'Pomar de Árvores Caducifólias' },
  { value: 'olive_trees', label: 'Oliveiras' },
  { value: 'pistachios', label: 'Pistache' },
]

/**
 * Mapa rápido crop_key → label PT para exibição em detalhes.
 */
export const CROP_LABEL_MAP: Record<string, string> = Object.fromEntries(
  CROP_TYPES.map((c) => [c.value, c.label]),
)

// ── Irrigation Systems ─────────────────────────────────────────────────────
// Keys vêm do EFFICIENCY dict do backend (efficiency.py).

export const IRRIGATION_SYSTEMS: { value: string; label: string; category: string }[] = [
  { value: 'surface_furrow_open', label: 'Sulco Aberto', category: 'Superfície' },
  { value: 'surface_furrow_closed', label: 'Sulco Fechado / Bacia', category: 'Superfície' },
  { value: 'surface_flood', label: 'Inundação', category: 'Superfície' },
  { value: 'subsurface_drip', label: 'Gotejamento Subsuperficial', category: 'Subsuperfície' },
  { value: 'subsurface_water_table', label: 'Subirrigação (Lençol Freático)', category: 'Subsuperfície' },
  { value: 'sprinkler_conventional', label: 'Aspersão Convencional', category: 'Aspersão' },
  { value: 'sprinkler_perforated_hose', label: 'Mangueira Perfurada', category: 'Aspersão' },
  { value: 'sprinkler_traveling_gun', label: 'Canhão Viajante', category: 'Aspersão' },
  { value: 'center_pivot', label: 'Pivô Central', category: 'Aspersão' },
  { value: 'linear_move', label: 'Deslocamento Linear', category: 'Aspersão' },
  { value: 'drip', label: 'Gotejamento', category: 'Localizada' },
  { value: 'micro_sprinkler', label: 'Microaspersão', category: 'Localizada' },
]

/**
 * Mapa rápido irrigation_key → label PT.
 */
export const IRRIGATION_LABEL_MAP: Record<string, string> = Object.fromEntries(
  IRRIGATION_SYSTEMS.map((s) => [s.value, s.label]),
)
