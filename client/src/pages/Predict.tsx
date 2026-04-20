import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

const RETAILERS = [
  "Carrefour",
  "Auchan",
  "Leclerc",
  "Casino",
  "Intermarche",
  "Systeme U",
  "Monoprix",
  "Cora",
];

const FEATURES = [
  "No_Feature",
  "Feature_A",
  "Feature_B",
  "Feature_C",
];

export default function Predict() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    cor_sales_in_vol: "",
    cor_sales_in_val: "",
    CA_mag: "",
    value: "",
    VenteConv: "",
    ENSEIGNE: "",
    Feature: "",
  });

  const [result, setResult] = useState<{
    prediction: string;
    confidence: number;
  } | null>(null);

  const predictMutation = trpc.prediction.predict.useMutation({
    onSuccess: (data: any) => {
      if (data.success) {
        setResult({
          prediction: data.prediction as string,
          confidence: data.confidence as number,
        });
        toast.success("Prediction generated successfully!");
      } else {
        toast.error(data.error || "Prediction failed");
      }
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.cor_sales_in_vol ||
      !formData.cor_sales_in_val ||
      !formData.CA_mag ||
      !formData.value ||
      !formData.VenteConv ||
      !formData.ENSEIGNE ||
      !formData.Feature
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    predictMutation.mutate({
      cor_sales_in_vol: parseFloat(formData.cor_sales_in_vol),
      cor_sales_in_val: parseFloat(formData.cor_sales_in_val),
      CA_mag: parseFloat(formData.CA_mag),
      value: parseFloat(formData.value),
      VenteConv: parseFloat(formData.VenteConv),
      ENSEIGNE: formData.ENSEIGNE,
      Feature: formData.Feature,
    });
  };

  const resetForm = () => {
    setFormData({
      cor_sales_in_vol: "",
      cor_sales_in_val: "",
      CA_mag: "",
      value: "",
      VenteConv: "",
      ENSEIGNE: "",
      Feature: "",
    });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-orange-950 py-12 px-4">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-cyan-400 hover:text-cyan-300 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
          Product Display <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">Prediction</span>
        </h1>
        <p className="text-gray-300 text-lg">Enter your product data to predict display placement</p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Product Information</CardTitle>
            <CardDescription className="text-gray-400">
              Fill in the product sales and store data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cor_sales_in_vol" className="text-gray-300">
                    Sales Volume
                  </Label>
                  <Input
                    id="cor_sales_in_vol"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 100"
                    value={formData.cor_sales_in_vol}
                    onChange={(e) =>
                      handleInputChange("cor_sales_in_vol", e.target.value)
                    }
                    className="bg-slate-900/50 border-cyan-500/30 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="cor_sales_in_val" className="text-gray-300">
                    Sales Value
                  </Label>
                  <Input
                    id="cor_sales_in_val"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 500"
                    value={formData.cor_sales_in_val}
                    onChange={(e) =>
                      handleInputChange("cor_sales_in_val", e.target.value)
                    }
                    className="bg-slate-900/50 border-cyan-500/30 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="CA_mag" className="text-gray-300">
                    Store Turnover (CA_mag)
                  </Label>
                  <Input
                    id="CA_mag"
                    type="number"
                    step="1"
                    placeholder="e.g., 50000"
                    value={formData.CA_mag}
                    onChange={(e) => handleInputChange("CA_mag", e.target.value)}
                    className="bg-slate-900/50 border-cyan-500/30 text-white placeholder-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="value" className="text-gray-300">
                    Product Value
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 30"
                    value={formData.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    className="bg-slate-900/50 border-cyan-500/30 text-white placeholder-gray-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="VenteConv" className="text-gray-300">
                  Converted Sales (VenteConv)
                </Label>
                <Input
                  id="VenteConv"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 200"
                  value={formData.VenteConv}
                  onChange={(e) => handleInputChange("VenteConv", e.target.value)}
                  className="bg-slate-900/50 border-cyan-500/30 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="ENSEIGNE" className="text-gray-300">
                  Retailer (ENSEIGNE)
                </Label>
                <Select
                  value={formData.ENSEIGNE}
                  onValueChange={(value) =>
                    handleInputChange("ENSEIGNE", value)
                  }
                >
                  <SelectTrigger className="bg-slate-900/50 border-cyan-500/30 text-white">
                    <SelectValue placeholder="Select a retailer" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-cyan-500/30">
                    {RETAILERS.map((retailer) => (
                      <SelectItem key={retailer} value={retailer}>
                        {retailer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="Feature" className="text-gray-300">
                  Feature (Promotion Type)
                </Label>
                <Select
                  value={formData.Feature}
                  onValueChange={(value) =>
                    handleInputChange("Feature", value)
                  }
                >
                  <SelectTrigger className="bg-slate-900/50 border-cyan-500/30 text-white">
                    <SelectValue placeholder="Select a feature" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-cyan-500/30">
                    {FEATURES.map((feature) => (
                      <SelectItem key={feature} value={feature}>
                        {feature}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={predictMutation.isPending}
                className="w-full bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white font-bold py-2 rounded-lg transition-all mt-6"
              >
                {predictMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  "Generate Prediction"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          {result ? (
            <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm h-full flex flex-col justify-center">
              <CardHeader>
                <CardTitle className="text-white">Prediction Result</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="mb-6">
                  {result.prediction === "Display" ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle className="w-20 h-20 text-green-400 mb-4" />
                      <div className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-full">
                        <span className="text-2xl font-bold text-green-400">
                          {result.prediction}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <XCircle className="w-20 h-20 text-red-400 mb-4" />
                      <div className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-full">
                        <span className="text-2xl font-bold text-red-400">
                          {result.prediction}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center mb-8">
                  <p className="text-gray-400 text-sm mb-2">Confidence Score</p>
                  <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="w-full mb-8">
                  <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center mb-8">
                  <p className="text-gray-300 text-lg">
                    {result.prediction === "Display"
                      ? "This product is recommended for special display placement to maximize visibility and sales."
                      : "This product should remain on standard shelf placement based on current sales metrics."}
                  </p>
                </div>

                <div className="flex gap-4 w-full">
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    New Prediction
                  </Button>
                  <Button
                    onClick={() => navigate("/")}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white font-bold"
                  >
                    Back Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm h-full flex flex-col justify-center">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 border-2 border-cyan-400 rounded-full mb-6 opacity-50"></div>
                <p className="text-gray-400 text-lg">
                  Fill in the form and click "Generate Prediction" to see the result.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
