/**
 * Building type codes
 * These codes match the 'code' field in building_types table
 */
export const BUILDING_CODES = {
  COOP: 'bld_coop',
  BARN: 'bld_barn',
} as const;

export type BuildingCode = typeof BUILDING_CODES[keyof typeof BUILDING_CODES];

/**
 * Animal type codes
 * These codes match the 'code' field in animal_types table
 */
export const ANIMAL_CODES = {
  CHICKEN: 'anl_chicken',
  COW: 'anl_cow',
  PIG: 'anl_pig',
  SHEEP: 'anl_sheep',
} as const;

export type AnimalCode = typeof ANIMAL_CODES[keyof typeof ANIMAL_CODES];
