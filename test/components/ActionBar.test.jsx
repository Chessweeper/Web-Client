// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BoardContext } from "../../src/components/BoardWrapper";
import { ActionBar } from "../../src/components/ActionBar";
import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

let mockBoardContext;
const mockSetCurrAction = vi.fn().mockImplementation((action) => {
  mockBoardContext.currAction = action;
});

describe("ActionBar tests", () => {
  beforeEach(() => {
    mockBoardContext = {
      G: {
        pieces: {
          R: Infinity,
          B: Infinity,
          N: Infinity,
          Q: Infinity,
        },
        size: 8,
        count: 3,
        gamemode: "c",
        difficulty: -1,
        cells: null,
        knownCells: null,
      },
      currAction: "",
      setCurrAction: mockSetCurrAction,
    };

    vi.clearAllMocks();
  });

  it("should render buttons for all available pieces in game", () => {
    const { container } = render(
      <BoardContext.Provider value={mockBoardContext}>
        <ActionBar />
      </BoardContext.Provider>
    );

    const buttons = container.querySelector("#action-buttons").childNodes;
    const shovel = screen.getByAltText("Shovel");
    const rook = screen.getByAltText("Rook");
    const bishop = screen.getByAltText("Bishop");
    const knight = screen.getByAltText("Knight");
    const queen = screen.getByAltText("Queen");

    expect(buttons).toHaveLength(5);
    expect(shovel).toBeInTheDocument();
    expect(rook).toBeInTheDocument();
    expect(bishop).toBeInTheDocument();
    expect(knight).toBeInTheDocument();
    expect(queen).toBeInTheDocument();
  });

  describe("shovel rendering", () => {
    it("should render shovel button in classic mode", () => {
      render(
        <BoardContext.Provider value={mockBoardContext}>
          <ActionBar />
        </BoardContext.Provider>
      );

      const shovel = screen.queryByAltText("Shovel");

      expect(shovel).toBeInTheDocument();
    });

    it("should not render shovel button in puzzle mode", () => {
      mockBoardContext = {
        ...mockBoardContext,
        G: {
          ...mockBoardContext.G,
          gamemode: "p",
        },
      };

      render(
        <BoardContext.Provider value={mockBoardContext}>
          <ActionBar />
        </BoardContext.Provider>
      );

      const shovel = screen.queryByAltText("Shovel");

      expect(shovel).not.toBeInTheDocument();
    });
  });

  describe("current action", () => {
    it("should render currAction button with selected className", () => {
      render(
        <BoardContext.Provider value={mockBoardContext}>
          <ActionBar />
        </BoardContext.Provider>
      );

      const shovelButton = screen.getByAltText("Shovel").parentNode;

      expect(mockBoardContext.currAction).toBe("");
      expect(shovelButton).toHaveClass("selected");
    });

    it("setCurrAction should update the class of the currently selected action button", async () => {
      const { rerender } = render(
        <BoardContext.Provider value={mockBoardContext}>
          <ActionBar />
        </BoardContext.Provider>
      );

      let shovelButton = screen.getByAltText("Shovel").parentNode;
      let bishopButton = screen.getByAltText("Bishop").parentNode;
      await userEvent.click(bishopButton);

      rerender(
        <BoardContext.Provider value={mockBoardContext}>
          <ActionBar />
        </BoardContext.Provider>
      );

      expect(shovelButton).not.toHaveClass("selected");
      expect(bishopButton).toHaveClass("selected");
    });

    it("should set current action on action button clicked", async () => {
      render(
        <BoardContext.Provider value={mockBoardContext}>
          <ActionBar />
        </BoardContext.Provider>
      );

      const rookButton = screen.getByAltText("Rook").parentNode;

      await userEvent.click(rookButton);

      expect(mockSetCurrAction).toHaveBeenLastCalledWith("R");
    });

    it("should set current action to first available action on render", () => {
      mockBoardContext = {
        ...mockBoardContext,
        G: {
          ...mockBoardContext.G,
          gamemode: "p",
        },
      };

      render(
        <BoardContext.Provider value={mockBoardContext}>
          <ActionBar />
        </BoardContext.Provider>
      );

      expect(mockSetCurrAction).toHaveBeenLastCalledWith("R");
    });

    it("should set current action with keyboard shortcuts", () => {
      const { container } = render(
        <BoardContext.Provider value={mockBoardContext}>
          <ActionBar />
        </BoardContext.Provider>
      );

      fireEvent.keyDown(container, { keyCode: 49 });
      fireEvent.keyDown(container, { keyCode: 50 });
      fireEvent.keyDown(container, { keyCode: 51 });
      fireEvent.keyDown(container, { keyCode: 52 });
      fireEvent.keyDown(container, { keyCode: 53 });

      // ignored keydowns, over length of buttons
      fireEvent.keyDown(container, { keyCode: 54 });
      fireEvent.keyDown(container, { keyCode: 55 });
      fireEvent.keyDown(container, { keyCode: 56 });

      // +1 call from initial render
      expect(mockSetCurrAction).toHaveBeenCalledTimes(6);
    });
  });
});
