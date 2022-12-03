import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useBoardContext } from "./BoardWrapper";

export interface TimerRefAttributes {
  start: () => void;
  isRunning: () => boolean;
}

export const Timer = forwardRef<TimerRefAttributes>((_, ref): JSX.Element => {
  const { ctx } = useBoardContext();
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useImperativeHandle(ref, () => ({
    start: () => {
      if (!intervalRef.current) {
        const intervalID = setInterval(() => {
          setTime((prev) => prev + 1);
        }, 10);
        intervalRef.current = intervalID;
      }
    },

    isRunning: () => intervalRef.current !== null,
  }));

  useEffect(() => {
    if (ctx.gameover && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [ctx.gameover, intervalRef]);

  const secs = time % 100;

  return (
    <h1 id="timer" className="board-header-item right">
      {Math.floor(time / 100)}:{secs < 10 ? "0" + secs : secs}
    </h1>
  );
});

Timer.displayName = "Timer";
