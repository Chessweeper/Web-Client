import { useEffect, useState } from "react";

export const Timer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setTime(prev => prev + 1);
    }, 10);
  }, [setTime]);

  const secs = time % 100;

  return (
    <div id="timer">
      {`${Math.floor(time / 100)}:${secs < 10 ? ("0" + secs) : secs}`}
    </div>
  );
}