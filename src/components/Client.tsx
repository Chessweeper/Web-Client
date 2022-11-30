import { BoardProps, Client as BgioClient } from "boardgame.io/react";
import { Game as BgioGame } from "boardgame.io";
import { Game, GameState } from "../Game";
import { generatePuzzleBoard } from "../Algs";
import { BoardWrapper } from "./BoardWrapper";
import { parseUrl } from "../Parsing";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [worker, setWorker] = useState<Worker | null>();

  const setupData = useMemo(() => parseUrl(searchParams), [searchParams]);

  const setupGame = useCallback(() => {
    /* c8 ignore next 16 */
    if (!import.meta.env.VITEST) {
      console.log(
        `Loading game: ${
          setupData.gamemode === "c" ? "classic" : "puzzle"
        } gamemode${
          setupData.seed != null ? ` with a seed of "${setupData.seed}"` : ""
        }, ${setupData.count} piece${setupData.count > 1 ? "s" : ""}, ${
          setupData.size
        }x${setupData.size} grid, piece${
          Object.keys(setupData.pieces).length > 1 ? "s" : ""
        } allowed: ${Object.keys(setupData.pieces)
          .map((x) => `${x} (x${setupData.pieces[x]})`)
          .join(", ")}`
      );
    }

    if (setupData.gamemode === "p") {
      if (worker) {
        setGame(null);
        worker.postMessage(setupData);
      } else {
        const { cells, knownCells, error } = generatePuzzleBoard(
          setupData.seed,
          setupData.pieces,
          setupData.size,
          setupData.count,
          setupData.difficulty
        );

        if (error) {
          console.error(error);
        } else {
          setGame({ ...Game({ ...setupData, cells, knownCells }) });
        }
      }
    } else {
      setGame({ ...Game(setupData) });
    }
  }, [worker, setGame, setupData]);

  // Setup web worker
  useEffect(() => {
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
          const { cells, knownCells } = e.data;
          setGame(Game({ ...setupData, cells, knownCells }));
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
  }, [setGame, setupData]);

  // Wait for worker creation to start game
  useEffect(() => {
    if (worker !== undefined) {
      setupGame();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [worker, setupGame]);

  if (!game) {
    return <div>Generating Board...</div>;
  }
  const Client = BgioClient({
    game,
    board: wrapBoardWithReload(setupGame, BoardWrapper),
    numPlayers: 1,
    debug: {
      collapseOnLoad: true,
    },
  });

  return <Client />;
};
