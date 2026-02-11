import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import FloatingHearts from "./FloatingHearts";

const presets = [
  { label: "বাবু 💕", value: "বাবু" },
  { label: "শোনা ❤️", value: "শোনা" },
  { label: "জান 💘", value: "জান" },
  { label: "কলিজা 😍", value: "কলিজা" },
];

interface NicknameGateProps {
  onSelect: (nickname: string) => void;
}

const NicknameGate = ({ onSelect }: NicknameGateProps) => {
  const [custom, setCustom] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    const name = selected || custom.trim();
    if (name) onSelect(name);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
      <FloatingHearts />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 14, delay: 0.1 }}
        className="glass-card rounded-3xl p-8 sm:p-10 max-w-md w-full mx-4 z-10 space-y-7 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl"
        >
          💘
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gradient">
            LoveLab
          </h1>
          <p className="text-foreground text-lg font-medium">
            তোমার প্রেমিক/প্রেমিকা তোমাকে কি নামে ডাকে?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {presets.map((p) => (
            <motion.button
              key={p.value}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setSelected(p.value);
                setCustom("");
              }}
              className={`py-3 px-4 rounded-xl font-semibold text-lg transition-all border ${
                selected === p.value
                  ? "gradient-primary text-primary-foreground border-transparent glow-primary"
                  : "bg-secondary/50 border-border text-foreground hover:border-primary/50"
              }`}
            >
              {p.label}
            </motion.button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="অথবা নিজের নাম লেখো..."
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              setSelected(null);
            }}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!selected && !custom.trim()}
          className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold text-lg glow-primary hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Sparkles size={20} /> শুরু করো 💕
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NicknameGate;
