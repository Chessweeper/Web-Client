import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaDiscord as DiscordIcon,
  FaGithub as GithubIcon,
} from "react-icons/fa";
import { GamemodeButtonProps } from "./GamemodeButton";
import { GamemodeSection } from "./GamemodeSection";
import "./Home.css";

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

export const Home = (): JSX.Element => {
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

  const puzzleBoards: GamemodeButtonProps[] = useMemo(
    () => [
      {
        title: "Easy",
        line1: "2 pieces",
        line2: "Rook only",
        line3: "6x6",
        query: "?g=p&p=R2&s=6&c=2&d=20",
      },
      {
        title: "Normal",
        line1: "3 pieces",
        line2: "Rook, Bishop, and Knight",
        line3: "8x8",
        query: "?g=p&p=R2B2N2&s=8&c=3&d=30",
      },
      {
        title: "Hard",
        line1: "8 pieces",
        line2: "Rook, Bishop, Knight and King",
        line3: "10x10",
        query: "?g=p&p=R3B3N3K1&s=10&c=8&d=50",
      },
      {
        title: "Extreme",
        line1: "12 pieces",
        line2: "Rook, Bishop, Knight and King",
        line3: "12x12",
        query: "?g=p&p=R4B4N4K1&s=12&c=12&d=60",
      },
      {
        title: "Shogi",
        line1: "5 pieces",
        line2: "Most shogi pieces, facing up",
        line3: "8x8",
        query: "?g=p&p=飛2角2玉2銀2金2&s=8&c=5",
      },
    ],
    []
  );

  const classicBoards: GamemodeButtonProps[] = useMemo(
    () => [
      {
        title: "Easy",
        line1: "2 pieces",
        line2: "Rook only",
        line3: "6x6",
        query: "?g=c&p=R2&s=6&c=2",
      },
      {
        title: "Normal",
        line1: "3 pieces",
        line2: "Rook, Bishop, Queen and Knight",
        line3: "8x8",
        query: "?g=c&p=R2B2Q1N2&s=8&c=3",
      },
      {
        title: "Hard",
        line1: "5 pieces",
        line2: "All pieces",
        line3: "10x10",
        query: "?g=c&p=R2B2Q1N2K1P2&s=10&c=5",
      },
      {
        title: "Extreme",
        line1: "8 pieces",
        line2: "All pieces",
        line3: "10x10",
        query: "?g=c&p=R2B2Q1N2K1P2&s=10&c=8",
      },
    ],
    []
  );

  const variantBoards: GamemodeButtonProps[] = useMemo(
    () => [
      {
        title: "Knook",
        line1: "5 pieces",
        line2: "Knight, Rook and Knook",
        line3: "10x10",
        query: "?g=c&p=R3N3O3&s=10&c=5",
      },
      {
        title: "Shogi",
        line1: "5 pieces",
        line2: "Shogi pieces, facing up",
        line3: "10x10",
        query: "?g=c&p=飛2角2桂2歩2玉2香2銀2金2&s=10&c=5",
      },
      {
        title: "Black Pawn",
        line1: "8 pieces",
        line2: "All pieces + Black Pawn",
        line3: "10x10",
        query: "?g=c&p=R2B2Q1N2K1P2D2&s=10&c=8",
      },
    ],
    []
  );

  return (
    <div className="home">
      <h1 className="home__title">Chessweeper</h1>
      <Link className="home__howtoplay-link" to="/howtoplay">
        How to Play?
      </Link>
      <div className="flex hor footer-icons">
        <a href="https://github.com/Chessweeper/Chessweeper">
          <GithubIcon title="GitHub" size={30} color="black" />
        </a>
        <a
          href="https://discord.gg/VjJ95N2mV9"
          target="_blank"
          rel="noreferrer"
        >
          <DiscordIcon title="Discord" size={30} color="#7289DA" />
        </a>
      </div>
      <GamemodeSection
        title="Puzzle"
        description="You must find where the pieces are without being allowed to dig"
        buttons={puzzleBoards}
      />
      <div className="flex hor">
        {dailyPuzzleSeed && (
          <Link
            className="gamemode button"
            to={`/play?g=p&p=R3B3N3K1&s=10&c=8&r=${dailyPuzzleSeed}`}
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
      </div>

      <GamemodeSection
        title="Classic"
        description="Dig and try to find where the pieces are"
        buttons={classicBoards}
      />
      <GamemodeSection
        title="Variant"
        description="Classic mode with pieces that are normally not in chess"
        buttons={variantBoards}
      />
    </div>
  );
};
