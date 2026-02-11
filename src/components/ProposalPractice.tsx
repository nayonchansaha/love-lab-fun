import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Lock, Star, Timer, Video, VideoOff } from "lucide-react";
import FloatingHearts from "./FloatingHearts";

const PROPOSAL_USED_KEY = "lovelab_proposalUsed";

const feedbackPool = [
  "Your confidence is impressive 💪",
  "Try maintaining more eye contact 👀",
  "Smile more to sound warmer 😊",
  "Speak slightly slower for better emotion ❤️",
  "Great energy! Keep it natural ✨",
];

const pickRandom = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

interface Props {
  nickname: string;
}

const ProposalPractice = ({ nickname }: Props) => {
  const [phase, setPhase] = useState<"idle" | "recording" | "analyzing" | "result" | "used">("idle");
  const [seconds, setSeconds] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  const [result, setResult] = useState<{ confidence: number; stars: number; feedback: string[] } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem(PROPOSAL_USED_KEY) === "true") {
      setPhase("used");
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      setCameraError(false);
      setSeconds(0);
      setPhase("recording");

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 59) {
            finishPractice();
            return 60;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setCameraError(true);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finishPractice = useCallback(() => {
    stopCamera();
    setPhase("analyzing");

    setTimeout(() => {
      const duration = Math.min(seconds, 60);
      const durationBonus = Math.floor((duration / 60) * 15);
      const base = Math.floor(Math.random() * 18) + 65;
      const confidence = Math.min(98, base + durationBonus);
      const starBase = confidence >= 90 ? 5 : confidence >= 80 ? 4 : confidence >= 70 ? 3 : 2;
      const stars = Math.min(5, starBase + (Math.random() > 0.5 ? 1 : 0));
      const feedbackCount = Math.random() > 0.5 ? 3 : 2;
      const feedback = pickRandom(feedbackPool, feedbackCount);

      localStorage.setItem(PROPOSAL_USED_KEY, "true");
      setResult({ confidence, stars: Math.min(5, stars), feedback });
      setPhase("result");
    }, 2500);
  }, [seconds, stopCamera]);


  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Used state
  if (phase === "used") {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 text-center space-y-6 relative overflow-hidden"
        >
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Lock className="mx-auto text-primary" size={56} />
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-gradient">
            তুমি ইতিমধ্যে তোমার প্রোপোজাল অ্যানালাইসিস ব্যবহার করে ফেলেছো 💘
          </h2>
          <p className="text-muted-foreground">
            প্রতিটি ডিভাইসে শুধুমাত্র একবার ব্যবহার করা যায়, {nickname}!
          </p>
        </motion.div>
      </div>
    );
  }

  // Idle
  if (phase === "idle") {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 text-center space-y-6"
        >
          <div className="text-6xl">💍</div>
          <h2 className="text-3xl font-display font-bold text-gradient">Proposal Practice</h2>
          <p className="text-muted-foreground">
            ক্যামেরা চালু করো, প্র্যাক্টিস করো, এবং তোমার confidence score দেখো, {nickname}!
          </p>
          {cameraError && (
            <p className="text-destructive text-sm">ক্যামেরা অ্যাক্সেস প্রত্যাখ্যাত। অনুগ্রহ করে অনুমতি দাও।</p>
          )}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={startCamera}
            className="w-full py-4 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg glow-primary hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Camera size={20} /> Start Practice
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Recording
  if (phase === "recording") {
    return (
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-3xl p-4 sm:p-6 space-y-4"
        >
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
            <video
              ref={videoCallbackRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
              style={{ transform: "scaleX(-1)" }}
            />
            {/* Timer overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-primary-foreground text-sm font-mono">
              <Timer size={14} className="text-red-400" />
              <span>{formatTime(seconds)}</span>
            </div>
            {/* Recording indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-primary-foreground text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse-heart" />
              REC
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={finishPractice}
            className="w-full py-4 rounded-xl gradient-primary text-primary-foreground font-semibold text-lg glow-primary hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <VideoOff size={20} /> Finish Practice
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // Analyzing
  if (phase === "analyzing") {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-8 text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="mx-auto w-16 h-16 rounded-full gradient-primary flex items-center justify-center glow-primary"
          >
            <Video size={28} className="text-primary-foreground" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-gradient">
            Analyzing your proposal...
          </h2>
          <p className="text-muted-foreground animate-pulse">
            Evaluating confidence, expression & emotion ✨
          </p>
        </motion.div>
      </div>
    );
  }

  // Result
  if (phase === "result" && result) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 14 }}
          className="glass-card rounded-2xl p-8 space-y-6 glow-primary"
        >
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-display font-bold text-gradient">
              Proposal Score
            </h2>
            <p className="text-muted-foreground">Great effort, {nickname}! 💕</p>
          </div>

          {/* Confidence */}
          <div className="text-center">
            <div className="text-6xl font-display font-bold text-gradient">{result.confidence}%</div>
            <p className="text-sm text-muted-foreground mt-1">Confidence Score</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.12 }}
              >
                <Star
                  size={32}
                  className={i < result.stars ? "text-gold fill-gold" : "text-border"}
                  fill={i < result.stars ? "currentColor" : "none"}
                />
              </motion.div>
            ))}
          </div>

          {/* Feedback */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">AI Feedback:</p>
            {result.feedback.map((fb, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground text-sm"
              >
                {fb}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default ProposalPractice;
