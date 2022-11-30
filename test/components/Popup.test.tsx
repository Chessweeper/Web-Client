// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import {
  BoardContext,
  BoardContextState,
} from "../../src/components/BoardWrapper";
import { Popup } from "../../src/components/Popup";
import { createMockBoardContext } from "../mocks";

let boardContext: BoardContextState;

describe("Popup tests", () => {
  beforeEach(() => {
    boardContext = createMockBoardContext();
    vi.clearAllMocks();
  });

  it("should not render if gameover is undefined", () => {
    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <Popup />
      </BoardContext.Provider>
    );

    expect(container.querySelector("#popup")).toBeNull();
  });

  it("should render and display error message if gameover is error", () => {
    boardContext.ctx.gameover = { error: "Error Msg" };

    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <Popup />
      </BoardContext.Provider>
    );

    expect(container.querySelector("#popup-content")).toHaveTextContent(
      "Error Msg"
    );
  });

  it.each([
    [true, "You won"],
    [false, "You lost"],
  ])(
    "should render and display isWin message if gameover is normal result",
    (isWin, expectedText) => {
      boardContext.ctx.gameover = { isWin };

      const { container } = render(
        <BoardContext.Provider value={boardContext}>
          <Popup />
        </BoardContext.Provider>
      );

      expect(container.querySelector("#popup-content")).toHaveTextContent(
        expectedText
      );
    }
  );

  it("should call reload on reload button clicked", async () => {
    boardContext.ctx.gameover = { isWin: true };

    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <Popup />
      </BoardContext.Provider>
    );

    const reloadButton = container.querySelector("#popup-reload");
    if (reloadButton) {
      await userEvent.click(reloadButton);
    }

    expect(boardContext.reload).toHaveBeenCalledOnce();
  });
});
