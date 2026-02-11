import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Confession {
  id: string;
  text: string;
  crush: string | null;
  hearts: number;
  created_at: string;
}

const ConfessionWall = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [text, setText] = useState("");
  const [crush, setCrush] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfessions();

    const channel = supabase
      .channel("confessions-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "confessions" },
        () => {
          fetchConfessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchConfessions = async () => {
    const { data } = await supabase
      .from("confessions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setConfessions(data);
    setLoading(false);
  };

  const submit = async () => {
    if (!text.trim()) return;
    await supabase.from("confessions").insert({
      text: text.trim(),
      crush: crush.trim() || null,
    });
    setText("");
    setCrush("");
    setShowForm(false);
  };

  const addHeart = async (id: string) => {
    const confession = confessions.find((c) => c.id === id);
    if (!confession) return;
    await supabase
      .from("confessions")
      .update({ hearts: confession.hearts + 1 })
      .eq("id", id);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-display font-bold text-gradient">কনফেশন ওয়াল</h2>
        <p className="text-muted-foreground">তোমার গোপন অনুভূতি বেনামে শেয়ার করো 💌</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 rounded-2xl glass-card text-primary font-semibold hover:bg-secondary/50 transition-all border-dashed border-2 border-primary/30"
          >
            ✍️ একটা কনফেশন লেখো
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="glass-card rounded-2xl p-6 space-y-4"
          >
            <textarea
              placeholder="মনের কথা খুলে বলো... 💕"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
            />
            <input
              type="text"
              placeholder="ক্রাশের নাম (ঐচ্ছিক)"
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
                <Send size={18} /> কনফেস করো
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all"
              >
                বাতিল
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {loading ? (
        <p className="text-center text-muted-foreground">লোড হচ্ছে...</p>
      ) : (
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
                  <p className="text-sm text-primary font-medium">💘 ক্রাশ: {c.crush}</p>
                )}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => addHeart(c.id)}
                    className="flex items-center gap-1.5 text-primary hover:scale-110 transition-transform"
                  >
                    <Heart size={16} fill="currentColor" />
                    <span className="text-sm font-medium">{c.hearts}</span>
                  </button>
                  <span className="text-xs text-muted-foreground">বেনামী</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ConfessionWall;
