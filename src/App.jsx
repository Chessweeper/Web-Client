import { Client as BgioClient } from 'boardgame.io/react';
import { Game } from './Game';
import { BoardWrapper } from './components/BoardWrapper';
import { parseUrl } from './Parsing';
import { Footer } from './components/Footer';

export const App = () => {
    const { seed, setupData } = parseUrl();

    console.log(`Loading game: ${setupData.gamemode === 'c' ? "classic" : "puzzle"} gamemode${seed != null ? ` with a seed of \"${seed}\"` : ""}, ${setupData.count} piece${setupData.count > 1 ? "s" : ""}, ${setupData.size}x${setupData.size} grid, piece${Object.keys(setupData.pieces).length > 1 ? "s" : ""} allowed: ${Object.keys(setupData.pieces).map(x => `${x} (x${setupData.pieces[x]})`).join(', ')}`)

    const Client = BgioClient({
        game: { ...Game(setupData), seed },
        board: BoardWrapper,
    });

    return <div className="flex">
        <Client />
        <hr />
        <Footer />
    </div>
}
