// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import {
  BoardWrapper,
  useBoardContext,
} from "../../src/components/BoardWrapper";
import { createMockBoardPropsWithReload } from "../mocks";
import { BoardPropsWithReload } from "../../src/components/Client";

let boardProps: BoardPropsWithReload;

describe("BoardWrapper tests", () => {
  beforeEach(() => {
    boardProps = createMockBoardPropsWithReload();
    vi.clearAllMocks();
  });

  it("should not render puzzle cover in classic mode", () => {
    const { container } = render(<BoardWrapper {...boardProps} />);

    const puzzleCover = container.querySelector("#board-cover");
    expect(puzzleCover).not.toBeInTheDocument();
  });

  it("should render puzzle cover in puzzle mode", async () => {
    boardProps.G.gamemode = "p";

    const { container } = render(<BoardWrapper {...boardProps} />);

    const puzzleCover = container.querySelector("#board-cover");
    expect(puzzleCover).toBeInTheDocument();
  });

  it("should hide puzzle cover when it is clicked", async () => {
    boardProps.G.gamemode = "p";

    const { container } = render(<BoardWrapper {...boardProps} />);

    const puzzleCover = container.querySelector("#board-cover");
    if (puzzleCover) {
      await userEvent.click(puzzleCover);
    }

    expect(puzzleCover).not.toBeInTheDocument();
  });

  describe("pieces counter", () => {
    it("should show pieces remaining equal to game count if no pieces are placed", async () => {
      render(<BoardWrapper {...boardProps} />);

      const count = await screen.findByText("003");

      expect(count).toBeInTheDocument();
    });

    it("should show pieces remaining if pieces have been placed", async () => {
      boardProps.G.knownCells = ["R", "R"];
      render(<BoardWrapper {...boardProps} />);

      const count = await screen.findByText("001");

      expect(count).toBeInTheDocument();
    });

    it("should show negative pieces remaining if more pieces placed than game count", async () => {
      boardProps.G.knownCells = ["R", "R", "R", "R"];
      render(<BoardWrapper {...boardProps} />);

      const count = await screen.findByText("-01");

      expect(count).toBeInTheDocument();
    });
  });

  describe("default board context", () => {
    it("should use empty object as default board context", () => {
      let context;

      const Child = () => {
        context = useBoardContext();
        return null;
      };
      render(<Child />);

      expect(context).toEqual({});
    });
  });
});
