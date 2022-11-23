import { BoardProps, Client as BgioClient } from "boardgame.io/react";
import { Game as BgioGame } from "boardgame.io";
import { Game, generatePuzzleBoard } from "../Game";
import { BoardWrapper } from "./BoardWrapper";
import { parseUrl } from "../Parsing";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PuzzleGenWorker from "../PuzzleGenWorker?worker";

// todo: after more components are typed, fix this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrapBoardWithReload = (reload: () => void, RawBoard: any) => {
  const Board = (props: BoardProps) => {
    const boardProps = { ...props, reload };
    return <RawBoard {...boardProps} />;
  };
  return Board;
};

export const Client = (): JSX.Element => {
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<BgioGame | null>(null);
  const [worker, setWorker] = useState<Worker | null>();

  // todo: define setupdata types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setupData: any = useMemo(() => parseUrl(searchParams), [searchParams]);

  const setupGame = useCallback(() => {
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

    if (setupData.gamemode === "p") {
      if (worker) {
        setLoading(true);
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
          setLoading(false);
        }
      }
    } else {
      setGame({ ...Game(setupData) });
      setLoading(false);
    }
  }, [worker, setGame, setupData]);

  // Setup web worker
  useEffect(() => {
    // Firefox does not allow module workers, but PuzzleGenWorker is compiled
    // to a non-module type in production - so don't allow worker in dev with Firefox
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    const isWorkerAvailable =
      process.env.NODE_ENV === "production" || !isFirefox;

    let w: Worker;

    if (isWorkerAvailable) {
      w = new PuzzleGenWorker();
      w.onmessage = (e) => {
        if (typeof e.data === "string") {
          console.error(e.data);
        } else {
          const { cells, knownCells } = e.data;
          setGame(Game({ ...setupData, cells, knownCells }));
          setLoading(false);
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

  if (!game || loading) {
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
