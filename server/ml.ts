import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as https from "https";

/**
 * ML Model Handler for Display Prediction
 * Loads the scikit-learn model from S3 storage and handles predictions via Python subprocess
 */

let modelPath: string | null = null;
let modelLoaded = false;

const MODEL_URL = "https://manus-storage.s3.us-west-2.amazonaws.com/best_display_model_0bb2b766.pkl";

/**
 * Download model from S3 storage
 */
async function downloadModel(): Promise<string> {
  const tempDir = os.tmpdir();
  const localPath = path.join(tempDir, "best_display_model.pkl");

  // Check if already downloaded
  if (fs.existsSync(localPath)) {
    console.log("[ML] Model already cached locally");
    return localPath;
  }

  return new Promise((resolve, reject) => {
    console.log("[ML] Downloading model from S3...");
    const file = fs.createWriteStream(localPath);

    https
      .get(MODEL_URL, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("[ML] Model downloaded successfully");
          resolve(localPath);
        });
      })
      .on("error", (err) => {
        fs.unlink(localPath, () => {}); // Delete partial file
        reject(err);
      });
  });
}

/**
 * Initialize the ML model by downloading it from S3
 */
export async function initializeModel(): Promise<void> {
  try {
    modelPath = await downloadModel();

    // Verify Python and required packages are available
    await runPythonScript("import pickle; import pandas; import sklearn; print('OK')");
    modelLoaded = true;
    console.log("[ML] Model initialized successfully");
  } catch (error) {
    console.error("[ML] Failed to initialize model:", error);
    throw error;
  }
}

/**
 * Predict display placement for a product
 * Returns prediction (0 or 1) and confidence score
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
  if (!modelLoaded || !modelPath) {
    throw new Error("Model not initialized");
  }

  const pythonCode = `
import pickle
import pandas as pd
import json
import sys

# Load model
with open('${modelPath}', 'rb') as f:
    model = pickle.load(f)

# Create input DataFrame
data = {
    'cor_sales_in_vol': [${input.cor_sales_in_vol}],
    'cor_sales_in_val': [${input.cor_sales_in_val}],
    'CA_mag': [${input.CA_mag}],
    'value': [${input.value}],
    'VenteConv': [${input.VenteConv}],
    'ENSEIGNE': ['${input.ENSEIGNE}'],
    'Feature': ['${input.Feature}']
}

df = pd.DataFrame(data)

# Make prediction
prediction = model.predict(df)[0]
probabilities = model.predict_proba(df)[0]

# Return result
result = {
    'prediction': int(prediction),
    'confidence': float(max(probabilities))
}

print(json.dumps(result))
`;

  try {
    const result = await runPythonScript(pythonCode);
    const parsed = JSON.parse(result);

    // Convert prediction to label
    const label = parsed.prediction === 1 ? "Display" : "No_Display";
    const confidence = Math.round(parsed.confidence * 100) / 100;

    return {
      prediction: label,
      confidence,
    };
  } catch (error) {
    console.error("[ML] Prediction error:", error);
    throw new Error(`Failed to generate prediction: ${error}`);
  }
}

/**
 * Helper function to run Python code and capture output
 */
function runPythonScript(code: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const python = spawn("python3", ["-c", code]);
    let output = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
      output += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python error: ${errorOutput}`));
      } else {
        resolve(output.trim());
      }
    });

    python.on("error", (error) => {
      reject(error);
    });
  });
}
