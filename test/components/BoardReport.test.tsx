// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import {
  BoardContext,
  BoardContextState,
} from "../../src/components/BoardWrapper";
import { BoardReport } from "../../src/components/BoardReport";
import { createMockBoardContext } from "../mocks";

let boardContext: BoardContextState;

describe("BoardReport tests", () => {
  beforeEach(() => {
    boardContext = createMockBoardContext();
    vi.clearAllMocks();
  });

  it.each([
    [true, "You won!"],
    [false, "You lost."],
  ])(
    "should render and display isWin message if gameover is normal result",
    async (isWin, expectedMsg) => {
      boardContext.ctx.gameover = { isWin };

      render(
        <BoardContext.Provider value={boardContext}>
          <BoardReport />
        </BoardContext.Provider>
      );

      const regex = new RegExp(`^${expectedMsg}`, "i");

      const msg = await screen.findByText(regex);
      //      await screen.findByText(expectedMsg);

      expect(msg).toBeInTheDocument();
    }
  );
});
