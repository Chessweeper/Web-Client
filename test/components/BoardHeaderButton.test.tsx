// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import {
  BoardContext,
  BoardContextState,
} from "../../src/components/BoardWrapper";
import { BoardHeaderButton } from "../../src/components/BoardHeaderButton";
import { createMockBoardContext } from "../mocks";

let boardContext: BoardContextState;

describe("BoardHeaderButton tests", () => {
  beforeEach(() => {
    boardContext = createMockBoardContext();
    vi.clearAllMocks();
  });

  it.each([
    [true, "/src/assets/knook.png"],
    [false, "/src/assets/wP.png"],
  ])(
    "should render and display isWin message if gameover is normal result",
    (isWin, expectedSrc) => {
      boardContext.ctx.gameover = { isWin };

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <BoardHeaderButton />
        </BoardContext.Provider>
      );

      const button = container.querySelector("#board-header-button");

      expect(button).toHaveStyle(`background-image: url(${expectedSrc})`);
    }
  );

  it("should call reload on header button clicked", async () => {
    boardContext.ctx.gameover = { isWin: true };

    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <BoardHeaderButton />
      </BoardContext.Provider>
    );

    const button = container.querySelector("#board-header-button");
    if (button) {
      await userEvent.click(button);
    }

    expect(boardContext.reload).toHaveBeenCalledOnce();
  });
});
