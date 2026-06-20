export const isAbsoluteMediaUrl = (value: string) => /^https?:\/\//i.test(value);

export const imageSrc = (imageId: string, imageMap: Record<string, string>) => {
  if (isAbsoluteMediaUrl(imageId)) return imageId;
  return imageMap[imageId] || imageId;
};
