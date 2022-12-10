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

  it("should display nbsp message on initial render", () => {
    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <BoardReport />
      </BoardContext.Provider>
    );

    const msg =
      container.querySelector("#board-report")?.firstChild?.textContent;

    expect(msg).toBe("\xa0");
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

      expect(msg).toBeInTheDocument();
    }
  );

  it("should display only seconds when hours and minutes is zero", () => {
    boardContext.timer.getTime = vi.fn().mockImplementation(() => 1000);
    boardContext.ctx.gameover = { isWin: true };

    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <BoardReport />
      </BoardContext.Provider>
    );

    const msg =
      container.querySelector("#board-report")?.firstChild?.textContent;

    expect(msg).toContain("s");
    expect(msg).not.toContain("m");
    expect(msg).not.toContain("h");
  });

  it("should display only minutes and seconds when hours is zero", () => {
    boardContext.timer.getTime = vi.fn().mockImplementation(() => 10000);
    boardContext.ctx.gameover = { isWin: true };

    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <BoardReport />
      </BoardContext.Provider>
    );

    const msg =
      container.querySelector("#board-report")?.firstChild?.textContent;

    expect(msg).toContain("s");
    expect(msg).toContain("m");
    expect(msg).not.toContain("h");
  });

  it("should display hours minutes and seconds when all have value", () => {
    boardContext.timer.getTime = vi.fn().mockImplementation(() => 1000000);
    boardContext.ctx.gameover = { isWin: true };

    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <BoardReport />
      </BoardContext.Provider>
    );

    const msg =
      container.querySelector("#board-report")?.firstChild?.textContent;

    expect(msg).toContain("s");
    expect(msg).toContain("m");
    expect(msg).toContain("h");
  });
});
