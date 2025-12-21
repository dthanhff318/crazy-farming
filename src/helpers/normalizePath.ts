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
