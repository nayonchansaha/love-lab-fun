import { useState, useEffect } from "react";

const NICKNAME_KEY = "lovelab_nickname";

export const useNickname = () => {
  const [nickname, setNicknameState] = useState<string | null>(() => {
    return localStorage.getItem(NICKNAME_KEY);
  });

  const setNickname = (name: string) => {
    localStorage.setItem(NICKNAME_KEY, name);
    setNicknameState(name);
  };

  const clearNickname = () => {
    localStorage.removeItem(NICKNAME_KEY);
    setNicknameState(null);
  };

  return { nickname, setNickname, clearNickname };
};
