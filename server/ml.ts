/**
 * ML Model Handler for Display Prediction
 * Implements a rule-based prediction system with lazy initialization
 */

let modelLoaded = false;
let initPromise: Promise<void> | null = null;

/**
 * Initialize the ML model (idempotent and lazy)
 */
export async function initializeModel(): Promise<void> {
  // If already initialized, return immediately
  if (modelLoaded) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initPromise) {
    return initPromise;
  }

  // Start initialization
  initPromise = (async () => {
    try {
      console.log("[ML] Initializing prediction system...");
      // Simulate a small delay for initialization
      await new Promise(resolve => setTimeout(resolve, 500));
      modelLoaded = true;
      console.log("[ML] Prediction system initialized successfully");
    } catch (error) {
      console.error("[ML] Failed to initialize model:", error);
      modelLoaded = false;
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Ensure model is loaded before prediction
 */
async function ensureModelLoaded(): Promise<void> {
  if (!modelLoaded) {
    await initializeModel();
  }
}

/**
 * Predict display placement for a product using rule-based logic
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
  // Ensure model is loaded before making prediction
  await ensureModelLoaded();

  try {
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

    console.log(`[ML] Prediction: ${shouldDisplay ? "Display" : "No_Display"} (confidence: ${confidence})`);

    return {
      prediction: shouldDisplay ? "Display" : "No_Display",
      confidence: Math.round(confidence * 100) / 100,
    };
  } catch (error) {
    console.error("[ML] Prediction error:", error);
    throw new Error(`Failed to generate prediction: ${error instanceof Error ? error.message : String(error)}`);
  }
}
