import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useBoardContext } from "./BoardWrapper";

export const Timer = forwardRef((_, ref) => {
  const { ctx } = useBoardContext();
  const [timer, setTimer] = useState(null);
  const [time, setTime] = useState(0);

  useImperativeHandle(ref, () => ({
    startTimer() {
      if (!timer) {
        setTimer(
          setInterval(() => {
            setTime((prev) => prev + 1);
          }, 10)
        );
      }
    },
  }));

  useEffect(() => {
    if (ctx.gameover && timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [ctx.gameover, timer]);

  const secs = time % 100;

  return (
    <div id="timer">
      {`${Math.floor(time / 100)}:${secs < 10 ? "0" + secs : secs}`}
    </div>
  );
});

Timer.displayName = "Timer";
