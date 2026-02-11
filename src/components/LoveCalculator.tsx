import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const verdicts = [
  { min: 0, max: 20, text: "Friendzone alert 🚨", sub: "Maybe try being funnier?" },
  { min: 20, max: 40, text: "It's complicated 😬", sub: "There's a spark but also a fire extinguisher nearby." },
  { min: 40, max: 60, text: "Situationship vibes 🫠", sub: "Neither of you knows what's going on." },
  { min: 60, max: 75, text: "Cute potential 💕", sub: "Keep this energy going!" },
  { min: 75, max: 90, text: "Marriage loading… 💍", sub: "Start picking wedding colors." },
  { min: 90, max: 101, text: "Soulmates detected 🔥", sub: "The universe shipped you two." },
];

const getVerdict = (score: number) =>
  verdicts.find((v) => score >= v.min && score < v.max) || verdicts[0];

const LoveCalculator = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = () => {
    if (!name1.trim() || !name2.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const seed = (name1 + name2).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const score = ((seed * 7 + 13) % 101);
      setResult(score);
      setLoading(false);
    }, 2000);
  };

  const verdict = result !== null ? getVerdict(result) : null;

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-display font-bold text-gradient">Love Calculator</h2>
          <p className="text-muted-foreground">Discover your love compatibility 💘</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <div className="flex justify-center">
            <Heart className="text-primary animate-pulse-heart" size={24} />
          </div>
          <input
            type="text"
            placeholder="Their name"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <button
          onClick={calculate}
          disabled={loading || !name1.trim() || !name2.trim()}
          className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg glow-primary hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Calculating…" : "Calculate Love ❤️"}
        </button>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-8"
            >
              <div className="relative">
                <Heart className="text-primary animate-pulse-heart" size={64} fill="currentColor" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-bold">...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result !== null && verdict && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 15 }}
              className="glass-card rounded-2xl p-6 text-center space-y-3 glow-primary"
            >
              <div className="text-6xl font-display font-bold text-gradient">{result}%</div>
              <div className="text-xl font-semibold text-foreground">{verdict.text}</div>
              <div className="text-sm text-muted-foreground">{verdict.sub}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoveCalculator;
