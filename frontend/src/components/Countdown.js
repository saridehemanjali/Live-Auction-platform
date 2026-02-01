import { useEffect, useState } from "react";

export default function Countdown({ endTime, serverTime }) {
  const offset = serverTime - Date.now();
  const [timeLeft, setTimeLeft] = useState(
    endTime - Date.now() - offset
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeLeft <= 0) return <span>Ended</span>;

  return <span>{Math.floor(timeLeft / 1000)}s</span>;
}
