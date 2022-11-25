// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { BoardContext } from "../../src/components/BoardWrapper";
import { Board } from "../../src/components/Board";
import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

let mockBoardContext = {
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
};

describe("Board tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render a table with size * size cells", () => {
    render(
      <BoardContext.Provider value={mockBoardContext}>
        <Board />
      </BoardContext.Provider>
    );

    const { size } = mockBoardContext.G;
    const table = screen.getByRole("table");
    const cells = screen.getAllByRole("cell");

    expect(table).not.toHaveClass("small");
    expect(cells).toHaveLength(size * size);
  });

  it("should render small class table when size > 10", () => {
    mockBoardContext = {
      ...mockBoardContext,
      G: {
        ...mockBoardContext.G,
        size: 11,
      },
    };

    render(
      <BoardContext.Provider value={mockBoardContext}>
        <Board />
      </BoardContext.Provider>
    );

    const table = screen.getByRole("table");

    expect(table).toHaveClass("small");
  });
});
