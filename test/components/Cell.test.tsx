/* eslint-disable @typescript-eslint/no-non-null-assertion */
// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { render, within } from "@testing-library/react";
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
    // prettier-ignore
    const cellsSetup = [
      R, 1, 1, 1, 2, 1, 2, 1,
      1, 1, 0, 1, 0, 1, 0, 0,
      1, 0, B, 0, 0, 0, 0, N,
      1, 1, 0, 1, 0, 1, 0, 0,
      2, 0, 0, 0, 1, 0, 1, 0,
      1, 0, 0, 0, 0, 1, 0, 0,
      1, 0, 0, 0, 0, 0, 1, 0,
      1, 0, 0, 0, 0, 0, 0, 1,
    ]

    boardContext = {
      ...mockBoardContext,
      G: {
        ...mockBoardContext.G,
        // prettier-ignore
        cells: cellsSetup.map(cell => ({
          value: cell,
          known: false,
          attackedValue: 0
        })),
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
    boardContext.G.cells![id].known = true;

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

  it("should not perform any actions on click when the game is over", async () => {
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
      boardContext.G.cells![0].known = "B";
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
      boardContext.G.cells![0].known = "B";
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
    it("should contain an empty string if cell is not revealed", () => {
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

    it("should contain the numerical value when known and present", async () => {
      boardContext.G.cells![1].known = true;

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={1} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];

      expect(cell.textContent).toBe("1");
      expect(cell).toHaveStyle("color: #0001FD");
    });

    it("should fallback to 8's color if numerical value is greater than 8", async () => {
      boardContext.G.cells![1] = {
        value: 9,
        known: true,
        attackedValue: 0,
      };

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={1} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];

      expect(cell.textContent).toBe("9");
      expect(cell).toHaveStyle("color: #808080");
    });

    it("should have no color if value is 0", async () => {
      boardContext.G.cells![1] = {
        value: 0,
        known: true,
        attackedValue: 0,
      };

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={1} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];

      expect(cell.textContent).toBe("");
      expect(cell.style.color).toBe("");
    });

    it("should display a zero if value was originally non-zero but modified to be zero", async () => {
      boardContext.G.cells![1] = {
        value: 1,
        known: true,
        attackedValue: 1,
      };

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={1} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];

      expect(cell.textContent).toBe("0");
      expect(cell.style.color).toBe("");
    });

    it("should display a white negative number if value was originally non-zero but modified to be negative", () => {
      boardContext.G.cells![1] = {
        value: 1,
        known: true,
        attackedValue: 2,
      };

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={1} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];

      expect(cell.textContent).toBe("-1");
      expect(cell).toHaveStyle("color: white");
    });

    it("should display a white negative number if value was originally zero but modified to be negative", () => {
      boardContext.G.cells![1] = {
        value: 0,
        known: true,
        attackedValue: 1,
      };

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <table>
            <tbody>
              <tr>
                <Cell id={1} />
              </tr>
            </tbody>
          </table>
        </BoardContext.Provider>
      );

      const cell = container.getElementsByTagName("td")[0];

      expect(cell.textContent).toBe("-1");
      expect(cell).toHaveStyle("color: white");
    });

    it("should contain the piece with red background after losing", async () => {
      boardContext.ctx.gameover = { isWin: false };

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
      const img = await within(cell).findByRole("img");

      expect(cell).toHaveClass("red");
      expect(img).toBeInTheDocument();
    });

    it("should contain the piece image after placing a hint", async () => {
      boardContext.G.cells![0].known = "B";

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
      const img = await within(cell).findByRole("img");

      expect(cell).not.toHaveClass("red");
      expect(img).toBeInTheDocument();
    });
  });
});
