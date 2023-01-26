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

    act(() => {
      timerRef.current.start();
    });

    expect(timerRef.current.isRunning()).toBe(true);
  });

  it("should stop timer on gameover", async () => {
    const timerRef = createRef() as MutableRefObject<TimerRefAttributes>;

    const { rerender } = render(
      <BoardContext.Provider value={boardContext}>
        <Timer ref={timerRef} />
      </BoardContext.Provider>
    );

    act(() => {
      timerRef.current.start();
    });

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

    act(() => {
      timerRef.current.start();
      vi.advanceTimersByTime(5000);
    });

    const timerDiv = container.querySelector("#timer");

    expect(timerDiv?.textContent).toBe("005");
  });

  it("should return the correct time with getTime", async () => {
    const timerRef = createRef() as MutableRefObject<TimerRefAttributes>;

    render(
      <BoardContext.Provider value={boardContext}>
        <Timer ref={timerRef} />
      </BoardContext.Provider>
    );

    act(() => {
      timerRef.current.start();
      vi.advanceTimersByTime(5000);
    });

    const time = timerRef.current.getTime();

    expect(time).toBe(500);
  });
});
