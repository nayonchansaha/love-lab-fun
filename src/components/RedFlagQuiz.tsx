import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface Question {
  question: string;
  options: { text: string; score: number }[];
}

const questions: Question[] = [
  {
    question: "How fast do you reply to texts?",
    options: [
      { text: "Instantly — always 📱", score: 0 },
      { text: "Within an hour ⏰", score: 1 },
      { text: "When I feel like it 😎", score: 2 },
      { text: "Days later, if ever 💀", score: 3 },
    ],
  },
  {
    question: "Your partner likes someone's thirst trap. You?",
    options: [
      { text: "Don't care at all 😌", score: 0 },
      { text: "Notice but say nothing 👀", score: 1 },
      { text: "Bring it up casually 🤨", score: 2 },
      { text: "Full investigation mode 🕵️", score: 3 },
    ],
  },
  {
    question: "How do you feel about meeting their friends?",
    options: [
      { text: "Love it, let's hang! 🎉", score: 0 },
      { text: "Sure, if I have to 😅", score: 1 },
      { text: "I'd rather not 😬", score: 2 },
      { text: "They shouldn't have friends 🚩", score: 3 },
    ],
  },
  {
    question: "Your idea of commitment is...",
    options: [
      { text: "Planning the future together 💍", score: 0 },
      { text: "Being exclusive 🤝", score: 1 },
      { text: "Keeping options open 🤷", score: 2 },
      { text: "What's commitment? 🏃", score: 3 },
    ],
  },
  {
    question: "How do you handle arguments?",
    options: [
      { text: "Talk it out calmly 🗣️", score: 0 },
      { text: "Need space first, then talk 🧘", score: 1 },
      { text: "Silent treatment 🤐", score: 2 },
      { text: "Scoreboard everything 📋", score: 3 },
    ],
  },
];

type FlagResult = {
  flag: string;
  emoji: string;
  color: string;
  title: string;
  description: string;
};

const getResult = (score: number): FlagResult => {
  const maxScore = questions.length * 3;
  const pct = (score / maxScore) * 100;
  if (pct < 25) return { flag: "green", emoji: "💚", color: "text-emerald-500", title: "Green Flag 💚", description: "You're a catch! Healthy communication, trust, and emotional maturity. Your future partner is lucky. Keep being amazing!" };
  if (pct < 50) return { flag: "yellow", emoji: "💛", color: "text-amber-500", title: "Yellow Flag 💛", description: "Mostly good vibes but there's room to grow. A few habits could use some self-reflection. You're aware and that's half the battle!" };
  return { flag: "red", emoji: "🚩", color: "text-red-500", title: "Red Flag 🚩", description: "Uh oh... Some patterns here could cause trouble. Time for a heart-to-heart with yourself. Growth is sexy — start now!" };
};

const RedFlagQuiz = () => {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [result, setResult] = useState<FlagResult | null>(null);
  const [started, setStarted] = useState(false);

  const answer = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      const total = newScores.reduce((a, b) => a + b, 0);
      setResult(getResult(total));
    }
  };

  const restart = () => {
    setCurrent(0);
    setScores([]);
    setResult(null);
    setStarted(false);
  };

  if (!started) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 text-center space-y-6"
        >
          <div className="text-6xl">🚩</div>
          <h2 className="text-3xl font-display font-bold text-gradient">Red Flag Test</h2>
          <p className="text-muted-foreground">Are you a green flag or walking red flag? Take this fun quiz to find out!</p>
          <button
            onClick={() => setStarted(true)}
            className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg glow-primary hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Start Quiz <ChevronRight size={20} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="glass-card rounded-2xl p-8 text-center space-y-6 glow-primary"
        >
          <div className="text-7xl">{result.emoji}</div>
          <h2 className={`text-3xl font-display font-bold ${result.color}`}>{result.title}</h2>
          <p className="text-foreground leading-relaxed">{result.description}</p>
          <button
            onClick={restart}
            className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all"
          >
            Try Again 🔄
          </button>
        </motion.div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        className="glass-card rounded-2xl p-8 space-y-6"
      >
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Question {current + 1}/{questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i <= current ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
        </div>
        <h3 className="text-xl font-display font-semibold text-foreground">{q.question}</h3>
        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => answer(opt.score)}
              className="w-full text-left px-5 py-4 rounded-xl bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary transition-all text-foreground"
            >
              {opt.text}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RedFlagQuiz;
