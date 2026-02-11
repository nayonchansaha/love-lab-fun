import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send } from "lucide-react";

interface Confession {
  id: number;
  text: string;
  crush?: string;
  hearts: number;
  timestamp: Date;
}

const initialConfessions: Confession[] = [
  { id: 1, text: "I've had a crush on my best friend for 3 years and they have no idea 🥺", crush: "Alex", hearts: 24, timestamp: new Date() },
  { id: 2, text: "I write love poems about someone in my class and hide them in my notebook 📓", hearts: 18, timestamp: new Date() },
  { id: 3, text: "I pretend to hate romantic movies but I cry every time 😭", crush: "Nobody specific", hearts: 42, timestamp: new Date() },
  { id: 4, text: "I changed my entire playlist to songs that remind me of them 🎵", hearts: 15, timestamp: new Date() },
];

const ConfessionWall = () => {
  const [confessions, setConfessions] = useState<Confession[]>(initialConfessions);
  const [text, setText] = useState("");
  const [crush, setCrush] = useState("");
  const [showForm, setShowForm] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    setConfessions((prev) => [
      { id: Date.now(), text: text.trim(), crush: crush.trim() || undefined, hearts: 0, timestamp: new Date() },
      ...prev,
    ]);
    setText("");
    setCrush("");
    setShowForm(false);
  };

  const addHeart = (id: number) => {
    setConfessions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, hearts: c.hearts + 1 } : c))
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-display font-bold text-gradient">Confession Wall</h2>
        <p className="text-muted-foreground">Share your secret feelings anonymously 💌</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 rounded-2xl glass-card text-primary font-semibold hover:bg-secondary/50 transition-all border-dashed border-2 border-primary/30"
          >
            ✍️ Write a Confession
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass-card rounded-2xl p-6 space-y-4"
          >
            <textarea
              placeholder="Pour your heart out... 💕"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
            />
            <input
              type="text"
              placeholder="Crush name (optional)"
              value={crush}
              onChange={(e) => setCrush(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <div className="flex gap-3">
              <button
                onClick={submit}
                disabled={!text.trim()}
                className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
              >
                <Send size={18} /> Confess
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
        <AnimatePresence>
          {confessions.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 break-inside-avoid space-y-3"
            >
              <p className="text-foreground leading-relaxed">{c.text}</p>
              {c.crush && (
                <p className="text-sm text-primary font-medium">💘 Crush: {c.crush}</p>
              )}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => addHeart(c.id)}
                  className="flex items-center gap-1.5 text-primary hover:scale-110 transition-transform"
                >
                  <Heart size={16} fill="currentColor" />
                  <span className="text-sm font-medium">{c.hearts}</span>
                </button>
                <span className="text-xs text-muted-foreground">Anonymous</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ConfessionWall;
