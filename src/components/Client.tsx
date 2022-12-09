import { BoardProps, Client as BgioClient } from "boardgame.io/react";
import { Game as BgioGame } from "boardgame.io";
import { Game, GameState } from "../Game";
import { generatePuzzleBoard } from "../Algs";
import { BoardWrapper } from "./BoardWrapper";
import { parseUrl } from "../Parsing";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PuzzleGenWorker from "../PuzzleGenWorker?worker";

export interface BoardPropsWithReload extends BoardProps<GameState> {
  reload: () => void;
}

const wrapBoardWithReload = (
  reload: () => void,
  RawBoard: (props: BoardPropsWithReload) => JSX.Element
) => {
  const Board = (props: BoardProps<GameState>) => {
    const boardProps: BoardPropsWithReload = { ...props, reload };
    return <RawBoard {...boardProps} />;
  };
  return Board;
};

export const Client = (): JSX.Element => {
  const [searchParams] = useSearchParams();

  const [game, setGame] = useState<BgioGame | null>(null);
  const [settingNextGame, setSettingNextGame] = useState(false);
  const [worker, setWorker] = useState<Worker | null>();

  const nextGame = useRef<BgioGame | null>(null);

  const setupData = useMemo(() => parseUrl(searchParams), [searchParams]);

  const setupGame = useCallback(() => {
    if (setupData.gamemode === "p") {
      if (worker) {
        setGame(nextGame.current);
        nextGame.current = null;
      } else {
        const { cells, error } = generatePuzzleBoard(
          setupData.seed,
          setupData.pieces,
          setupData.size,
          setupData.count,
          setupData.difficulty
        );

        if (error) {
          console.error(error);
        } else {
          setGame({ ...Game({ ...setupData, cells }) });
        }
      }
    } else {
      setGame({ ...Game(setupData) });
    }
  }, [worker, setupData]);

  // Setup web worker on URL change
  useEffect(() => {
    /* c8 ignore next 7 */
    if (!import.meta.env.VITEST) {
      // prettier-ignore
      console.log(`Loading game: ${setupData.gamemode === "c" ? "classic" : "puzzle"} gamemode${setupData.seed != null ? ` with a seed of "${setupData.seed}"` : ""}, ${setupData.count} piece${setupData.count > 1 ? "s" : ""}, ${setupData.size}x${setupData.size} grid, piece${Object.keys(setupData.pieces).length > 1 ? "s" : ""} allowed: ${Object.keys(setupData.pieces).map((x) => `${x} (x${setupData.pieces[x]})`).join(", ")}`);
    }

    // Firefox does not allow module workers, but PuzzleGenWorker is compiled
    // to a non-module type in production - so don't allow worker in dev with Firefox
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    const isWorkerAvailable =
      (process.env.NODE_ENV === "production" || !isFirefox) &&
      typeof Worker !== "undefined";

    let w: Worker;

    if (isWorkerAvailable) {
      w = new PuzzleGenWorker();
      w.onmessage = (e) => {
        if (typeof e.data === "string") {
          console.error(e.data);
        } else {
          const { cells } = e.data;
          nextGame.current = Game({ ...setupData, cells });
          setSettingNextGame(false);
        }
      };
      setWorker(w);
    } else {
      setWorker(null);
    }

    return () => {
      if (w) {
        w.terminate();
        setWorker(undefined);
      }
    };
  }, [setupData]);

  // On worker creation, create a new game
  useEffect(() => {
    if (worker !== undefined) {
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Use next game generation in puzzle mode
      if (worker && setupData.gamemode === "p") {
        setGame(null);
        setSettingNextGame(false);
        nextGame.current = null;
      } else {
        setupGame();
      }
    }
  }, [setupData, worker, setupGame]);

  // Generate next game in puzzle mode
  useEffect(() => {
    if (setupData.gamemode === "c") return;

    // Set the current game to the next game if the current game is null
    if (game === null && nextGame.current) {
      setGame(nextGame.current);
      nextGame.current = null;
    }

    // When the next game has been consumed, tell the worker to generate a new one
    if (worker && !settingNextGame && nextGame.current === null) {
      setSettingNextGame(true);
      worker.postMessage(setupData);
    }
  }, [game, worker, settingNextGame, setupData]);

  const Client = useMemo(
    () =>
      game
        ? BgioClient({
            game,
            board: wrapBoardWithReload(setupGame, BoardWrapper),
            numPlayers: 1,
            debug: {
              collapseOnLoad: true,
            },
          })
        : () => <div>Generating Board...</div>,
    [game, setupGame]
  );

  return <Client />;
};
