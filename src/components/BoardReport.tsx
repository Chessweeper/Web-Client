import { useBoardContext } from "./BoardWrapper";

export const BoardReport = (): JSX.Element | null => {
  const { ctx, timer } = useBoardContext();

  if (ctx.gameover?.isWin == null) return null;

  const message = ctx.gameover.isWin ? "You won!" : "You lost.";
  const time = timer.getTime().toString().padStart(3, "0");
  const timeDisplay =
    time.slice(0, time.length - 2) + ":" + time.slice(time.length - 2);

  return (
    <div id="board-report">
      <h3>
        {message} {timeDisplay}
      </h3>
    </div>
  );
};
