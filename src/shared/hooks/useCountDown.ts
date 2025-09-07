import { useEffect, useState } from "react";

export const useCountdown = (expireAt: Date | string) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const expiry = new Date(expireAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      if (updated) {
        setTimeLeft(updated);
      } else {
        setTimeLeft(null);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expireAt]);

  return timeLeft;
};
