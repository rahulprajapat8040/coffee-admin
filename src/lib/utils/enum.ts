
export const VariantStatus = {
  AVAILABLE: "AVAILABLE",
  UN_AVAILABLE: "UN_AVAILABLE",
};
export type VariantStatus = typeof VariantStatus[keyof typeof VariantStatus];
