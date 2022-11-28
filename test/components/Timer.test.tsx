// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  BoardContext,
  BoardContextState,
} from "../../src/components/BoardWrapper";
import { Timer } from "../../src/components/Timer";
import { createMockBoardContext } from "../mocks";
import { createRef } from "react";

let boardContext: BoardContextState;

describe("Timer tests", () => {
  beforeEach(() => {
    boardContext = createMockBoardContext();
    vi.clearAllMocks();
  });

  it("should", async () => {
    const timerRef = createRef<any>();

    const { container, rerender } = render(
      <BoardContext.Provider value={boardContext}>
        <Timer ref={timerRef} />
      </BoardContext.Provider>
    );

    timerRef.current.start();
    boardContext.ctx.gameover = { isWin: true };
    // await new Promise((r) => setTimeout(r, 2000));

    rerender(
      <BoardContext.Provider value={boardContext}>
        <Timer ref={timerRef} />
      </BoardContext.Provider>
    );

    const timerDiv = container.querySelector("#timer");

    expect.anything();
  });
});
