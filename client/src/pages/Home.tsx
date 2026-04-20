import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Target, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-teal-950 to-orange-950">
      {/* Navigation */}
      <nav className="border-b border-cyan-900/30 bg-black/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400">
            DisplayPredictor
          </div>
          <Button
            onClick={() => navigate("/predict")}
            className="bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white font-semibold"
          >
            Start Predicting <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Geometric accent */}
          <div className="mb-8 inline-block">
            <div className="w-20 h-20 border-2 border-cyan-400 rotate-45 mx-auto mb-4 opacity-50"></div>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
            Predict Product <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-orange-400">Display Placement</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Leverage advanced machine learning to optimize retail shelf placement and maximize product visibility. Empower your retail strategy with data-driven insights.
          </p>

          <Button
            onClick={() => navigate("/predict")}
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            Launch Prediction Tool <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black/40 backdrop-blur-sm border-t border-cyan-900/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Why Choose DisplayPredictor?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-400/60 transition-all">
              <Target className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Precision Targeting</h3>
              <p className="text-gray-300">
                Accurately predict which products deserve premium display placement based on sales data and store characteristics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-teal-900/20 to-orange-900/20 border border-orange-500/30 rounded-lg p-6 hover:border-orange-400/60 transition-all">
              <TrendingUp className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Revenue Optimization</h3>
              <p className="text-gray-300">
                Maximize sales by strategically placing high-potential products in premium retail locations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-orange-900/20 to-cyan-900/20 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-400/60 transition-all">
              <Zap className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Real-Time Insights</h3>
              <p className="text-gray-300">
                Get instant predictions with confidence scores to support your retail decision-making process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Retail Strategy?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Input your product data and let our AI model predict the optimal display placement for maximum impact.
        </p>
        <Button
          onClick={() => navigate("/predict")}
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-orange-500 hover:from-cyan-600 hover:to-orange-600 text-white font-bold text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-900/30 bg-black/40 backdrop-blur-sm py-6 text-center text-gray-400">
        <p>© 2026 DisplayPredictor. Powered by Advanced Machine Learning for Retail Excellence.</p>
      </footer>
    </div>
  );
}
