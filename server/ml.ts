/**
 * Ultra-simple prediction function
 * No complex initialization, just pure logic
 */

export async function predictDisplay(input: {
  cor_sales_in_vol: number;
  cor_sales_in_val: number;
  CA_mag: number;
  value: number;
  VenteConv: number;
  ENSEIGNE: string;
  Feature: string;
}): Promise<{ prediction: string; confidence: number }> {
  // Simple rule: if total score >= 2.5, predict Display
  const volumeScore = input.cor_sales_in_vol > 50 ? 1 : 0;
  const valueScore = input.cor_sales_in_val > 300 ? 1 : 0;
  const conversionScore = input.VenteConv > 100 ? 1 : 0;
  const priceScore = input.value > 20 ? 1 : 0;
  const featureBoost = input.Feature !== "No_Feature" ? 0.5 : 0;

  const totalScore = volumeScore + valueScore + conversionScore + priceScore + featureBoost;
  const shouldDisplay = totalScore >= 2.5;

  // Confidence: higher when far from threshold
  const margin = Math.abs(totalScore - 2.5);
  const confidence = Math.min(0.95, Math.max(0.55, 0.65 + margin * 0.1));

  return {
    prediction: shouldDisplay ? "Display" : "No_Display",
    confidence: Math.round(confidence * 100) / 100,
  };
}

// Dummy function for backward compatibility
export async function initializeModel(): Promise<void> {
  // No initialization needed
  return Promise.resolve();
}
