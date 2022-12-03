// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
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

  it("should set current action to shovel on initial render in classic mode", () => {
    const { container } = render(<BoardWrapper {...boardProps} />);

    const firstAction = container.querySelector("#action-buttons")?.firstChild;

    expect(firstAction).toHaveClass("selected");
  });

  it("should set current action to first piece on initial render in puzzle mode", () => {
    boardProps.G.gamemode = "p";

    const { container } = render(<BoardWrapper {...boardProps} />);

    const firstAction = container.querySelector("#action-buttons")?.firstChild;

    expect(firstAction).toHaveClass("selected");
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
