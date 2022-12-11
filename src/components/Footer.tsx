import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaDiscord as DiscordIcon,
  FaGithub as GithubIcon,
} from "react-icons/fa";

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const formatCountdownDistance = (distance: number): string => {
  const hours = Math.floor((distance % day) / hour)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((distance % hour) / minute)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((distance % minute) / second)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

function convertDateToUTC(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

export const Footer = (): JSX.Element => {
  const [dailyPuzzleSeed, setDailyPuzzleSeed] = useState<string | undefined>();
  const [now, setNow] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  async function updateDailyPuzzle() {
    const resp = await fetch("../../api/daily.php");
    if (resp.ok) {
      const text = await resp.text();
      if (text.length > 20) {
        // Somehow launching this in local environment returns index.html?
        console.error("Failed to fetch daily puzzle");
      } else {
        setDailyPuzzleSeed(text);
      }
    } else {
      console.error("Failed to fetch daily puzzle");
    }
  }

  function updateCountdownEnd() {
    const nowUTC = convertDateToUTC(new Date());
    const endUTC = new Date(nowUTC);
    endUTC.setDate(endUTC.getDate() + 1);
    endUTC.setHours(0, 0, 0, 0);
    setEnd(endUTC);
  }

  useEffect(() => {
    updateDailyPuzzle();
  }, []);

  useEffect(() => {
    setNow(convertDateToUTC(new Date()));
    updateCountdownEnd();

    intervalRef.current = setInterval(() => {
      setNow(convertDateToUTC(new Date()));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (now !== null && end !== null) {
      if (now > end) {
        updateCountdownEnd();
        updateDailyPuzzle();
      }
    }
  }, [now, end]);

  let dailyTimeRemaining = "";
  if (now !== null && end !== null) {
    const distance = end.getTime() - now.getTime();
    dailyTimeRemaining = formatCountdownDistance(distance);
  }

  return (
    <div>
      <h1>More boards</h1>
      <h2>Classic</h2>
      <p>Dig and try to find where the pieces are</p>
      <div className="flex hor">
        <Link className="gamemode button" to="?g=c&p=R2&s=6&c=2">
          <h2>Easy</h2>
          2 pieces
          <br />
          Rook only
          <br />
          6x6
        </Link>
        <br />
        <Link className="gamemode button" to="?g=c&p=R2B2Q1N2&s=8&c=3">
          <h2>Normal</h2>
          3 pieces
          <br />
          Rook, Bishop, Queen and Knight
          <br />
          8x8
        </Link>
        <br />
        <Link className="gamemode button" to="?g=c&p=R2B2Q1N2K1P2&s=10&c=5">
          <h2>Hard</h2>
          5 pieces
          <br />
          All pieces
          <br />
          10x10
        </Link>
        <br />
        <Link className="gamemode button" to="?g=c&p=R2B2Q1N2K1P2&s=10&c=8">
          <h2>Extreme</h2>
          8 pieces
          <br />
          All pieces
          <br />
          10x10
        </Link>
      </div>
      <h2>Variant</h2>
      <p>classic mode with pieces that are normally not in chess</p>
      <div className="flex hor">
        <Link className="gamemode button" to="?g=c&p=R3N3O3&s=10&c=5">
          <h2>Knook</h2>
          5 pieces
          <br />
          Knight, Rook and Knook
          <br />
          10x10
        </Link>
        <Link
          className="gamemode button"
          to="?g=c&p=飛2角2桂2歩2玉2香2銀2金2&s=10&c=5"
        >
          <h2>Shogi</h2>
          5 pieces
          <br />
          Shogi pieces, facing up
          <br />
          10x10
        </Link>
        <Link className="gamemode button" to="?g=c&p=R2B2Q1N2K1P2D2&s=10&c=8">
          <h2>Black Pawn</h2>
          8 pieces
          <br />
          All pieces + Black Pawn
          <br />
          10x10
        </Link>
      </div>
      <h2>Puzzle</h2>
      <p>You must find where the pieces are without being allowed to dig</p>
      <div className="flex hor">
        {dailyPuzzleSeed && (
          <Link
            className="gamemode button"
            to={`?g=p&p=R3B3N3K1&s=10&c=8&r=${dailyPuzzleSeed}`}
            id="daily"
          >
            <h2>Daily {dailyTimeRemaining}</h2>
            8 pieces
            <br />
            Rook, Bishop, Knight and King
            <br />
            10x10
          </Link>
        )}
        <Link className="gamemode button" to="?g=p&p=R2&s=6&c=2&d=20">
          <h2>Easy</h2>
          2 pieces
          <br />
          Rook only
          <br />
          6x6
        </Link>
        <br />
        <Link className="gamemode button" to="?g=p&p=R2B2N2&s=8&c=3&d=30">
          <h2>Normal</h2>
          3 pieces
          <br />
          Rook, Bishop and Knight
          <br />
          8x8
        </Link>
        <br />
        <Link className="gamemode button" to="?g=p&p=R3B3N3K1&s=10&c=8&d=50">
          <h2>Hard</h2>
          8 pieces
          <br />
          Rook, Bishop, Knight and King
          <br />
          10x10
        </Link>
        <Link className="gamemode button" to="?g=p&p=R4B4N4K1&s=12&c=12&d=60">
          <h2>Extreme</h2>
          12 pieces
          <br />
          Rook, Bishop, Knight and King
          <br />
          12x12
        </Link>
        <Link className="gamemode button" to="?g=p&p=飛2角2玉2銀2金2&s=8&c=5">
          <h2>Shogi</h2>
          5 pieces
          <br />
          Most shogi pieces, facing up
          <br />
          8x8
        </Link>
      </div>
      <hr />
      <div id="rules">
        <h1>How to play?</h1>
        <h2>Basic Rules</h2>
        <p>
          The goal is to find where and what all the chess pieces are
          <br />
          Numbers on a tile represent the number of pieces that have that tile
          in check
          <br />
          Once you identified a piece, click on the related button under the
          board then click on the tile, click again to remove it
          <br />
          All kinds of pieces can appear many times, except the king that can
          appear only 1 time maximum
          <br />
          The top left number is the number of pieces that need to be placed on
          the board
          <br />
          <br />
          For more information on how the pieces move, please click{" "}
          <a
            href="https://en.wikipedia.org/wiki/Chess#Movement"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
        </p>

        <h2>Classic Mode</h2>
        <p>
          The shovel allows you to dig a tile
          <br />
          You lose if you use your shovel on a chess piece, you win if you find
          all the pieces correctly
        </p>

        <h2>Special pieces</h2>
        <p>
          Knook: Has the same moves as a knight and a rook
          <br />
          Shogi pieces:{" "}
          <a
            href="https://en.wikipedia.org/wiki/Shogi#Movement"
            target="_blank"
            rel="noreferrer"
          >
            Wikipedia
          </a>
        </p>
        <div className="flex hor footer-icons">
          <a href="https://github.com/Xwilarg/Chessweeper">
            <GithubIcon title="GitHub" size={50} color="black" />
          </a>
          <a
            href="https://discord.gg/VjJ95N2mV9"
            target="_blank"
            rel="noreferrer"
          >
            <DiscordIcon title="Discord" size={50} color="#7289DA" />
          </a>
        </div>
      </div>
    </div>
  );
};
