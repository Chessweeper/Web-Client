import { useBoardContext } from "./BoardWrapper";

export const BoardReport = (): JSX.Element | null => {
  const { ctx, timer } = useBoardContext();

  let message = "\xa0";

  if (ctx.gameover?.isWin != null) {
    message = ctx.gameover.isWin ? "You won!" : "You lost.";

    const time = timer.getTime();
    const totalSeconds = Math.floor(time / 100);

    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor((totalSeconds % 3600) % 60);
    const ms = (time % 100).toString().padStart(2, "0");

    const hDisplay = h > 0 ? `${h}h, ` : "";
    const mDisplay = m > 0 ? `${m}m, ` : "";

    message += ` ${hDisplay}${mDisplay}${s}.${ms}s`;
  }

  return (
    <div id="board-report">
      <h3>{message}</h3>
    </div>
  );
};
