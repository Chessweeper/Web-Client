/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import { Client } from "../../src/components/Client";
import * as Algs from "../../src/Algs";
import * as BoardWrapper from "../../src/components/BoardWrapper";

class MockWorker {
  url: string;
  onmessage: (msg?: any) => void;

  constructor(stringUrl: string) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  postMessage() {
    const mockResponse = {
      data: {
        cells: [],
      },
    };

    // Give component time to rerender
    setTimeout(() => {
      this.onmessage(mockResponse);
    }, 0);
  }

  terminate() {}
}

class MockErrorWorker extends MockWorker {
  postMessage(): void {
    const mockResponse = {
      data: "mock error",
    };
    this.onmessage(mockResponse);
  }
}

vi.stubGlobal("scrollTo", vi.fn());

vi.spyOn(Algs, "generatePuzzleBoard").mockImplementation(() => {
  return { cells: [], error: null };
});

describe("Client tests", () => {
  beforeEach(() => {
    vi.spyOn(BoardWrapper, "BoardWrapper").mockImplementation(() => {
      return <div id="mockBoardWrapper" />;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should generate classic game", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["?g=c"]}>
        <Client />
      </MemoryRouter>
    );

    const board = container.querySelector("#mockBoardWrapper");

    expect(board).toBeInTheDocument();
  });

  it("should generate puzzle game without worker when unavailable", () => {
    const { container } = render(<Client />, { wrapper: MemoryRouter });

    const board = container.querySelector("#mockBoardWrapper");

    expect(board).toBeInTheDocument();
  });

  it("should handle non-worker puzzle generation error", () => {
    console.error = vi.fn();
    vi.spyOn(Algs, "generatePuzzleBoard").mockImplementation(() => {
      return { cells: [], error: "mock error" };
    });

    render(<Client />, { wrapper: MemoryRouter });

    expect(console.error).toHaveBeenCalledTimes(1);
  });

  describe("puzzle worker", () => {
    beforeEach(() => {
      (window.Worker as any) = MockWorker;
    });

    it("should generate puzzle game with worker", async () => {
      const { container } = render(<Client />, { wrapper: MemoryRouter });

      await waitFor(() => {
        const board = container.querySelector("#mockBoardWrapper");
        expect(board).toBeInTheDocument();
      });
    });

    it("should create new game on reload with worker", async () => {
      vi.spyOn(BoardWrapper, "BoardWrapper").mockImplementation((props) => {
        return (
          <div id="mockBoardWrapper">
            <button id="popup-reload" onClick={props.reload}></button>
          </div>
        );
      });

      const { container } = render(<Client />, { wrapper: MemoryRouter });

      await waitFor(() => {
        const reloadButton = container.querySelector("#popup-reload");
        expect(reloadButton).toBeInTheDocument();
      });

      const reloadButton = container.querySelector("#popup-reload");
      if (reloadButton) await userEvent.click(reloadButton);

      await waitFor(() => {
        const board = container.querySelector("#mockBoardWrapper");
        expect(board).toBeInTheDocument();
      });
    });

    it("should handle worker puzzle generation error", () => {
      (window.Worker as any) = MockErrorWorker;
      console.error = vi.fn();

      render(<Client />, { wrapper: MemoryRouter });

      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });
});
