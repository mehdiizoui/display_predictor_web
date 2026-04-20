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
      // In production, this would load the actual pickle model
      // For now, we use a rule-based system
      console.log("[ML] Initializing prediction system...");
      modelLoaded = true;
      console.log("[ML] Prediction system initialized (rule-based fallback)");
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
 * This is a fallback implementation that uses business rules
 * The real ML model can be integrated by replacing this function
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
    // Rule-based prediction logic
    // A product should be displayed if:
    // 1. Sales volume is high (> 50)
    // 2. Sales value is high (> 300)
    // 3. Converted sales are significant (> 100)
    // 4. Product value is reasonable (> 20)

    const volumeScore = input.cor_sales_in_vol > 50 ? 1 : 0;
    const valueScore = input.cor_sales_in_val > 300 ? 1 : 0;
    const conversionScore = input.VenteConv > 100 ? 1 : 0;
    const priceScore = input.value > 20 ? 1 : 0;

    // Feature boost: if product has a promotion feature, increase likelihood
    const featureBoost = input.Feature !== "No_Feature" ? 0.2 : 0;

    // Calculate total score (0-5 scale)
    const totalScore = volumeScore + valueScore + conversionScore + priceScore;

    // Determine prediction: need at least 2.5 points (with feature boost)
    const threshold = 2.5 - featureBoost;
    const shouldDisplay = totalScore >= threshold;

    // Calculate confidence based on how far we are from the threshold
    const margin = Math.abs(totalScore - threshold);
    const baseConfidence = shouldDisplay ? 0.6 + margin * 0.08 : 0.4 + margin * 0.08;
    const confidence = Math.min(0.95, Math.max(0.55, baseConfidence));

    console.log(`[ML] Prediction: ${shouldDisplay ? "Display" : "No_Display"} (confidence: ${confidence})`);

    return {
      prediction: shouldDisplay ? "Display" : "No_Display",
      confidence: Math.round(confidence * 100) / 100,
    };
  } catch (error) {
    console.error("[ML] Prediction error:", error);
    throw new Error(`Failed to generate prediction: ${error}`);
  }
}
