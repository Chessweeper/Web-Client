// @vitest-environment jsdom
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest';
import { BoardContext } from "../../src/components/BoardWrapper"
import { Popup } from '../../src/components/Popup'
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

const mockReload = vi.fn();

let mockBoardContext = {
  ctx: {},
  reload: mockReload
}

describe('Popup tests', () => {
  it('should not render if gameover is undefined', () => {
    const { container } = render(
      <BoardContext.Provider value={mockBoardContext}>
        <Popup />
      </BoardContext.Provider>
    );

    expect(container.querySelector("#popup")).toBeDefined();
  })

  it('should render and display error message if gameover is error', () => {
    mockBoardContext = {
      ...mockBoardContext,
      ctx: { gameover: { error: "Error Msg" } },
    };

    const { container } = render(
      <BoardContext.Provider value={mockBoardContext}>
        <Popup />
      </BoardContext.Provider>
    );

    expect(container.querySelector("#popup-content")).toHaveTextContent("Error Msg");;
  })

  it.each([
    [true, "You won"],
    [false, "You lost"],
  ])(
    "should render and display isWin message if gameover is normal result",
    (isWin, expectedText) => {
      mockBoardContext = {
        ...mockBoardContext,
        ctx: { gameover: { isWin } },
      };

      const { container } = render(
        <BoardContext.Provider value={mockBoardContext}>
          <Popup />
        </BoardContext.Provider>
      );

      expect(container.querySelector("#popup-content")).toHaveTextContent(
        expectedText
      );
    }
  );

  it('should call reload on reload button clicked', async () => {
    mockBoardContext = {
      ...mockBoardContext,
      ctx: { gameover: { isWin: true } },
    };

    const { container } = render(
      <BoardContext.Provider value={mockBoardContext}>
        <Popup />
      </BoardContext.Provider>
    );

    await userEvent.click(container.querySelector("#popup-reload"));

    expect(mockReload).toHaveBeenCalledOnce();
  })
})