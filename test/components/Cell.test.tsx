/* eslint-disable @typescript-eslint/no-non-null-assertion */
// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import {
  BoardContext,
  BoardContextState,
} from "../../src/components/BoardWrapper";
import { Cell } from "../../src/components/Cell";
import { createMockBoardContext } from "../mocks";

let boardContext: BoardContextState;
const R = "R";
const B = "B";
const N = "N";

describe("Cell tests", () => {
  beforeEach(() => {
    const mockBoardContext = createMockBoardContext();

    boardContext = {
      ...mockBoardContext,
      G: {
        ...mockBoardContext.G,
        // prettier-ignore
        cells: [
          R, 1, 1, 1, 2, 1, 2, 1,
          1, 1, 0, 1, 0, 1, 0, 0,
          1, 0, B, 0, 0, 0, 0, N,
          1, 1, 0, 1, 0, 1, 0, 0,
          2, 0, 0, 0, 1, 0, 1, 0,
          1, 0, 0, 0, 0, 1, 0, 0,
          1, 0, 0, 0, 0, 0, 1, 0,
          1, 0, 0, 0, 0, 0, 0, 1,
        ],
        knownCells: Array(
          mockBoardContext.G.size * mockBoardContext.G.size
        ).fill(false),
      },
    };
    vi.clearAllMocks();
  });

  it("should not initially render with open or black/white className", () => {
    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <table>
          <tbody>
            <tr>
              <Cell id={0} />
            </tr>
          </tbody>
        </table>
      </BoardContext.Provider>
    );

    const cell = container.getElementsByTagName("td")[0];

    expect(cell).not.toHaveClass("open");
    expect(cell).not.toHaveClass("black");
    expect(cell).not.toHaveClass("white");
  });

  it.each([
    [0, "white"],
    [1, "black"],
    [8, "black"],
    [9, "white"],
  ])("should render open cell id %d with %s className", (id, expectedClass) => {
    boardContext.G.knownCells![id] = true;

    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <table>
          <tbody>
            <tr>
              <Cell id={id} />
            </tr>
          </tbody>
        </table>
      </BoardContext.Provider>
    );

    const cell = container.getElementsByTagName("td")[0];

    expect(cell).toHaveClass("open");
    expect(cell).toHaveClass(expectedClass);
  });

  it("should not perform any actions on clicked when the game is over", async () => {
    boardContext.ctx.gameover = { isWin: true };
    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <table>
          <tbody>
            <tr>
              <Cell id={0} />
            </tr>
          </tbody>
        </table>
      </BoardContext.Provider>
    );

    const cell = container.getElementsByTagName("td")[0];
    await userEvent.click(cell);

    expect(boardContext.moves.discoverPiece).not.toHaveBeenCalled();
    expect(boardContext.moves.placeHint).not.toHaveBeenCalled();
    expect(boardContext.moves.removeHint).not.toHaveBeenCalled();
    expect(boardContext.timer.start).not.toHaveBeenCalled();
  });

  describe("moves", () => {
    it("should call discoverPiece move if current action is shovel", async () => {
      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={0} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];
      await userEvent.click(cell);

      expect(boardContext.moves.discoverPiece).toHaveBeenCalledTimes(1);
      expect(boardContext.moves.discoverPiece).toHaveBeenCalledWith(0);
    });

    it("should call placeHint move if current action is not shovel and the cell is not known", async () => {
      boardContext.currAction = "R";
      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={0} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];
      await userEvent.click(cell);

      expect(boardContext.moves.placeHint).toHaveBeenCalledTimes(1);
      expect(boardContext.moves.placeHint).toHaveBeenCalledWith(0, "R");
    });

    it("should call placeHint move if current action is not shovel and the cell contains a different hint", async () => {
      boardContext.G.knownCells![0] = "B";
      boardContext.currAction = "R";

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={0} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];
      await userEvent.click(cell);

      expect(boardContext.moves.placeHint).toHaveBeenCalledTimes(1);
      expect(boardContext.moves.placeHint).toHaveBeenCalledWith(0, "R");
    });

    it("should call removeHint move if current action is equal to known cell", async () => {
      boardContext.G.knownCells![0] = "B";
      boardContext.currAction = "B";
      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={0} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];
      await userEvent.click(cell);

      expect(boardContext.moves.removeHint).toHaveBeenCalledTimes(1);
      expect(boardContext.moves.removeHint).toHaveBeenCalledWith(0);
    });
  });

  describe("timer control", () => {
    it("should start timer when clicked if timer not running", async () => {
      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={0} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];
      await userEvent.click(cell);

      expect(boardContext.timer.start).toHaveBeenCalledTimes(1);
    });

    it("should not call start timer when clicked if timer running", async () => {
      boardContext.timer.isRunning = vi.fn().mockReturnValue(true);
      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={0} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];
      await userEvent.click(cell);

      expect(boardContext.timer.start).not.toHaveBeenCalled();
    });
  });

  describe("value", () => {
    it("should contain an empty string value if cells is null", () => {
      boardContext.G.cells = null;

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={0} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];

      expect(cell.textContent).toBe("");
    });

    it("should contain an empty string value if knownCells is null", () => {
      boardContext.G.knownCells = null;

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={0} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];

      expect(cell.textContent).toBe("");
    });

    it("should contain an empty string value if knownCells is null", () => {
      boardContext.G.cells = null;

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={0} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];

      expect(cell.textContent).toBe("");
    });
  });
});
