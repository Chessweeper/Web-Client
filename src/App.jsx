import { Client as BgioClient } from "boardgame.io/react";
import { Game } from "./Game";
import { BoardWrapper } from "./components/BoardWrapper";
import { parseUrl } from "./Parsing";
import { Footer } from "./components/Footer";
import { useCallback, useEffect, useState } from "react";
import PuzzleGenWorker from "./PuzzleGenWorker?worker";

const wrapBoardWithReload = ({ reload, board: RawBoard }) => {
  const Board = (props) => {
    const boardProps = { ...props, reload };
    return <RawBoard {...boardProps} />;
  };
  return Board;
};

export const App = () => {
  const setupData = parseUrl();
  const [game, setGame] = useState(null);
  const [worker, setWorker] = useState();

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
      worker.postMessage(setupData);
    } else {
      setGame({ ...Game(setupData) });
    }
  }, [worker, setGame, setupData]);

  // Setup web worker
  useEffect(() => {
    const w = new PuzzleGenWorker();
    w.onmessage = (e) => {
      if (typeof e.data === "string") {
        console.error(e.data);
      } else {
        const { cells, knownCells } = e.data;
        setGame(Game({ ...setupData, cells, knownCells }));
      }
    };

    setWorker(w);

    return () => {
      w.terminate();
      setWorker(undefined);
    };
  }, [setGame, setupData]);

  // Wait for worker creation to start game
  useEffect(() => {
    if (worker) {
      setupGame();
    }
  }, [worker, setupGame]);

  const Client = game
    ? BgioClient({
        game,
        board: wrapBoardWithReload({ reload: setupGame, board: BoardWrapper }),
        numPlayers: 1,
        debug: {
          collapseOnLoad: true,
        },
      })
    : () => <div>Generating Board...</div>;

  return (
    <div>
      <div className="flex">
        <Client />
      </div>
      <hr />
      <Footer />
    </div>
  );
};
