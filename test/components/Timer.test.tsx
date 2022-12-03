// @vitest-environment jsdom
import { render } from "@testing-library/react";
import {
  BoardContext,
  BoardContextState,
} from "../../src/components/BoardWrapper";
import { Timer, TimerRefAttributes } from "../../src/components/Timer";
import { createMockBoardContext } from "../mocks";
import { createRef, MutableRefObject } from "react";
import { act } from "react-dom/test-utils";

let boardContext: BoardContextState;

describe("Timer tests", () => {
  beforeEach(() => {
    boardContext = createMockBoardContext();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should start timer with start imperative handle", async () => {
    const timerRef = createRef() as MutableRefObject<TimerRefAttributes>;

    render(
      <BoardContext.Provider value={boardContext}>
        <Timer ref={timerRef} />
      </BoardContext.Provider>
    );

    timerRef.current.start();

    expect(timerRef.current.isRunning()).toBe(true);
  });

  it("should stop timer on gameover", async () => {
    const timerRef = createRef() as MutableRefObject<TimerRefAttributes>;

    const { rerender } = render(
      <BoardContext.Provider value={boardContext}>
        <Timer ref={timerRef} />
      </BoardContext.Provider>
    );

    timerRef.current.start();
    boardContext.ctx.gameover = { isWin: true };

    rerender(
      <BoardContext.Provider value={boardContext}>
        <Timer ref={timerRef} />
      </BoardContext.Provider>
    );

    expect(timerRef.current.isRunning()).toBe(false);
  });

  it("should advance time correctly", async () => {
    const timerRef = createRef() as MutableRefObject<TimerRefAttributes>;

    const { container } = render(
      <BoardContext.Provider value={boardContext}>
        <Timer ref={timerRef} />
      </BoardContext.Provider>
    );

    timerRef.current.start();

    act(() => {
      vi.advanceTimersByTime(150);
    });

    const timerDiv = container.querySelector("#timer");

    expect(timerDiv?.textContent).toBe("0:15");
  });
});
