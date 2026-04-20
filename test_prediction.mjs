import { predictDisplay } from './server/ml.ts';

const testInput = {
  cor_sales_in_vol: 100,
  cor_sales_in_val: 500,
  CA_mag: 50000,
  value: 30,
  VenteConv: 200,
  ENSEIGNE: "Carrefour",
  Feature: "No_Feature",
};

predictDisplay(testInput).then(result => {
  console.log("Result:", result);
}).catch(err => {
  console.error("Error:", err);
});
