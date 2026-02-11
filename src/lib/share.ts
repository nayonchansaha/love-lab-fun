import { toast } from "sonner";

export const shareResult = async (text: string) => {
  const url = "https://lovelabfun.vercel.app";
  const shareData = { text, url };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch {
      // User cancelled or share failed, fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast.success("Copied to clipboard! 📋");
  } catch {
    toast.error("Couldn't share — try copying manually");
  }
};
