import { BoardPropsWithReload } from "../src/components/Client";
import { BoardContextState } from "../src/components/BoardWrapper";

export const createMockBoardPropsWithReload = (): BoardPropsWithReload => ({
  G: {
    seed: null,
    size: 8,
    count: 3,
    difficulty: -1,
    gamemode: "c",
    pieces: {
      R: Infinity,
      B: Infinity,
      N: Infinity,
      Q: Infinity,
    },
    cells: null,
  },
  ctx: {
    numPlayers: 1,
    playOrder: ["0"],
    activePlayers: null,
    playOrderPos: 0,
    turn: 0,
    phase: "",
    currentPlayer: "0",
  },
  moves: {
    discoverPiece: vi.fn(),
    placeHint: vi.fn(),
    removeHint: vi.fn(),
  },
  events: {},
  plugins: {},
  playerID: "0",
  isActive: true,
  isConnected: true,
  isMultiplayer: false,
  matchID: "default",
  log: [],
  deltalog: [],
  chatMessages: [],
  sendChatMessage: vi.fn(),
  redo: vi.fn(),
  undo: vi.fn(),
  reset: vi.fn(),
  _stateID: 0,
  _redo: [],
  _undo: [],
  reload: vi.fn(),
});

export const createMockBoardContext = (): BoardContextState => ({
  ...createMockBoardPropsWithReload(),
  currAction: "",
  setCurrAction: vi.fn(),
  timer: {
    isRunning: vi.fn(),
    start: vi.fn(),
    getTime: vi.fn().mockImplementation(() => 100),
  },
});
