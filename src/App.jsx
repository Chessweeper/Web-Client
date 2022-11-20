import { Client as BgioClient } from 'boardgame.io/react';
import { Game } from './Game';
import { BoardWrapper } from './components/BoardWrapper';
import { parseUrl } from './Parsing';
import { Footer } from './components/Footer';
import { useEffect, useState } from 'react';

const wrapBoardWithReload = ({ reload, board: RawBoard }) => {
	const Board = (props) => {
    const boardProps = { ...props, reload };
    return <RawBoard {...boardProps} />;
  };
	return Board;
}

export const App = () => {
	const { seed, setupData } = parseUrl();
	const [game, setGame] = useState(null)

	const reload = () => {
		setGame(null);
	}

	useEffect(() => {
		let w;
		if (game === null) {
			w = new Worker("src/PuzzleGenWebWorker.js", { type: 'module' });
			w.postMessage(setupData);
			w.onmessage = (event) => {
				// todo, handle errors
				const { cells, knownCells } = event.data;
				setGame({...Game({...setupData, cells, knownCells}), seed});
			};	
		}

		return () => { if (w) { w.terminate(); }};
	}, [game, setGame]);

	const Client = game ? BgioClient({
		game,
		board: wrapBoardWithReload({ reload, board: BoardWrapper }),
		numPlayers: 1,
		debug: {
			collapseOnLoad: true,
		}
	}) : () => <div>Generating Board...</div>;

	console.log(`Loading game: ${setupData.gamemode === 'c' ? "classic" : "puzzle"} gamemode${seed != null ? ` with a seed of \"${seed}\"` : ""}, ${setupData.count} piece${setupData.count > 1 ? "s" : ""}, ${setupData.size}x${setupData.size} grid, piece${Object.keys(setupData.pieces).length > 1 ? "s" : ""} allowed: ${Object.keys(setupData.pieces).map(x => `${x} (x${setupData.pieces[x]})`).join(', ')}`)
	
	return (
		<div>
			<div className="flex">
				<Client />
			</div>
			<hr/>
			<Footer />
		</div>
	);
}
