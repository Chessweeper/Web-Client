import { Client as BgioClient } from 'boardgame.io/react';
import { Game } from './Game';
import { BoardWrapper } from './components/BoardWrapper';
import { parseUrl } from './Parsing';
import { Footer } from './components/Footer';
import { useState } from 'react';

const wrapBoardWithReload = ({ reload, board: RawBoard }) => {
	const Board = (props) => {
    const boardProps = { ...props, reload };
    return <RawBoard {...boardProps} />;
  };
	return Board;
}

export const App = () => {
	const { seed, setupData } = parseUrl();
	const [game, setGame] = useState({...Game(setupData), seed})

	const reload = () => {
		setGame({...Game(setupData), seed});
	}

	const Client = BgioClient({
		game,
		board: wrapBoardWithReload({ reload, board: BoardWrapper }),
		numPlayers: 1
	});

	console.log(`Loading game: ${setupData.gamemode === 'c' ? "classic" : "puzzle"} gamemode${seed != null ? ` with a seed of \"${seed}\"` : ""}, ${setupData.count} piece${setupData.count > 1 ? "s" : ""}, ${setupData.size}x${setupData.size} grid, piece${Object.keys(setupData.pieces).length > 1 ? "s" : ""} allowed: ${Object.keys(setupData.pieces).map(x => `${x} (x${setupData.pieces[x]})`).join(', ')}`)
	
	return (
		<div className="flex">
			<Client />
			<hr />
			<Footer />
		</div>
	);
}
