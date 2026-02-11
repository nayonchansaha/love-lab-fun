

## ক্যামেরা কালো স্ক্রিন সমস্যা ঠিক করা

### সমস্যা কী?
ক্যামেরা অ্যাক্সেস দেওয়া হচ্ছে, কিন্তু ভিডিও ফিড দেখা যাচ্ছে না - কালো স্ক্রিন আসছে।

### কারণ
`ProposalPractice.tsx` কোডে একটি race condition আছে। `startCamera` ফাংশনে:
1. প্রথমে stream নেওয়া হচ্ছে
2. তারপর `videoRef.current.srcObject = stream` সেট করা হচ্ছে
3. তারপর `setPhase("recording")` কল হচ্ছে

কিন্তু `<video>` element তো শুধু `phase === "recording"` হলেই render হয়। তাই step 2-তে `videoRef.current` এখনো `null` - কারণ video element তখনো DOM-এ নেই। ফলে stream সেট হচ্ছে না, কালো স্ক্রিন দেখাচ্ছে।

### সমাধান
`src/components/ProposalPractice.tsx` ফাইলে দুটি পরিবর্তন:

1. **`startCamera` ফাংশনে** - আগে phase সেট করো, তারপর stream attach করো না। শুধু stream রেফে রাখো এবং phase চেঞ্জ করো।

2. **একটি `useEffect` যোগ করো** - যখন phase "recording" হবে এবং video element mount হবে, তখন `streamRef.current` থেকে stream নিয়ে video element-এ সেট করো:

```typescript
useEffect(() => {
  if (phase === "recording" && videoRef.current && streamRef.current) {
    videoRef.current.srcObject = streamRef.current;
  }
}, [phase]);
```

### Technical Details
- শুধুমাত্র `src/components/ProposalPractice.tsx` ফাইলে পরিবর্তন হবে
- `startCamera` থেকে `videoRef.current.srcObject = stream` লাইন সরিয়ে দেওয়া হবে, phase আগে সেট করা হবে
- নতুন `useEffect` যোগ হবে যেটা phase change-এ video element-এ stream attach করবে

