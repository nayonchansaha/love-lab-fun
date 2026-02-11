import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircleHeart, Flag, Sparkles } from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";
import LoveCalculator from "@/components/LoveCalculator";
import ConfessionWall from "@/components/ConfessionWall";
import RedFlagQuiz from "@/components/RedFlagQuiz";

type Tab = "calculator" | "confessions" | "quiz";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "calculator", label: "Love Calc", icon: <Heart size={18} /> },
  { id: "confessions", label: "Confessions", icon: <MessageCircleHeart size={18} /> },
  { id: "quiz", label: "Red Flags", icon: <Flag size={18} /> },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("calculator");
  const [showIntro, setShowIntro] = useState(true);

  if (showIntro) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
        <FloatingHearts />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="text-center z-10 px-6 space-y-8"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl"
          >
            💘
          </motion.div>
          <h1 className="text-5xl sm:text-7xl font-display font-bold text-gradient glow-text">
            LoveLab
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Calculate love, confess your feelings, and find out if you're a walking red flag — all in one place 💕
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowIntro(false)}
            className="px-10 py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold text-lg glow-primary flex items-center gap-2 mx-auto hover:opacity-90 transition-all"
          >
            <Sparkles size={20} /> Enter LoveLab
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <FloatingHearts />

      <div className="relative z-10">
        {/* Header */}
        <header className="text-center pt-8 pb-4 px-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold text-gradient"
          >
            💘 LoveLab
          </motion.h1>
        </header>

        {/* Tab Navigation */}
        <nav className="flex justify-center px-4 pb-6">
          <div className="glass-card rounded-2xl p-1.5 flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "gradient-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <main className="px-4 pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "calculator" && <LoveCalculator />}
              {activeTab === "confessions" && <ConfessionWall />}
              {activeTab === "quiz" && <RedFlagQuiz />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Index;
