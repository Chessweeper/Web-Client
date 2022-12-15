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
  getTime: () => number;
}

export const Timer = forwardRef<TimerRefAttributes>((_, ref): JSX.Element => {
  const { ctx } = useBoardContext();
  const [start, setStart] = useState(0);
  const [now, setNow] = useState(0);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      start: () => {
        if (!intervalRef.current) {
          setStart(Date.now());
          setNow(Date.now());
          const intervalID = setInterval(() => {
            setNow(Date.now());
          }, 10);
          intervalRef.current = intervalID;
        }
      },

      isRunning: () => intervalRef.current !== null,

      getTime: () => {
        return Math.floor((now - start) / 10);
      },
    }),
    [now, start]
  );

  useEffect(() => {
    if (ctx.gameover && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [ctx.gameover, intervalRef]);

  const time = Math.floor((now - start) / 1000);

  return <h1 id="timer">{time.toString().padStart(3, "0")}</h1>;
});

Timer.displayName = "Timer";
