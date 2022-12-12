// @vitest-environment jsdom
import { screen } from "@testing-library/react";
import {
  BoardContext,
  BoardContextState,
} from "../../src/components/BoardWrapper";
import { Board } from "../../src/components/Board";
import { createMockBoardContext } from "../mocks";
import { renderWithProviders } from "../mockStore";

let boardContext: BoardContextState;

describe("Board tests", () => {
  beforeEach(() => {
    boardContext = createMockBoardContext();
    vi.clearAllMocks();
  });

  it("should render a table with size * size cells", () => {
    renderWithProviders(
      <BoardContext.Provider value={boardContext}>
        <Board />
      </BoardContext.Provider>
    );

    const { size } = boardContext.G;
    const table = screen.getByRole("table");
    const cells = screen.getAllByRole("cell");

    expect(table).not.toHaveClass("small");
    expect(cells).toHaveLength(size * size);
  });
});
