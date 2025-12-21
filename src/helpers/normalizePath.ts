/**
 * Determines the growth stage of a plant based on elapsed time and returns the asset URL
 * @param cropName - Name of the crop
 * @param plantedAt - ISO timestamp when the plant was planted
 * @param readyAt - ISO timestamp when the plant will be fully grown
 * @returns Full URL to the crop asset at the appropriate growth stage
 */
export const getPlantGrowthStageUrl = (
  cropName: string,
  plantedAt: string,
  readyAt: string
): string => {
  const plantedTime = new Date(plantedAt).getTime();
  const readyTime = new Date(readyAt).getTime();
  const currentTime = new Date().getTime();

  const totalGrowthTime = readyTime - plantedTime;
  const elapsedTime = currentTime - plantedTime;

  const oneThirdGrowthTime = totalGrowthTime / 3;
  const twoThirdsGrowthTime = (totalGrowthTime / 3) * 2;

  let stage = "seedling";

  // If current time < 1/3 of growth time => seedling
  if (elapsedTime < oneThirdGrowthTime) {
    stage = "seedling";
  }
  // If current time >= 1/3 and < 2/3 of growth time => vegetative
  else if (elapsedTime < twoThirdsGrowthTime) {
    stage = "halfway";
  }
  // If current time >= ready time => plant (fully grown)
  else {
    stage = "plant";
  }

  return `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/resources/game-assets/crops/${cropName}/${stage}.png`;
};

export const getCropsAssetUrl = (cropName: string, stage?: string): string => {
  if (stage) {
    return `${
      import.meta.env.VITE_SUPABASE_URL
    }/storage/v1/object/public/resources/game-assets/crops/${cropName}/${stage}.png`;
  }

  return `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/resources/game-assets/crops/${cropName}/${cropName}.png`;
};
