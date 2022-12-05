/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
// @vitest-environment jsdom
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { Client } from "../../src/components/Client";
import * as Algs from "../../src/Algs";

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
        knownCells: [],
      },
    };
    this.onmessage(mockResponse);
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
  return { cells: [], knownCells: [], error: null };
});

describe("Client tests", () => {
  beforeEach(() => {
    (window.Worker as any) = MockWorker;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should generate classic game", () => {
    const { container } = render(<Client />, { wrapper: MemoryRouter });

    const board = container.querySelector("#board-container");

    expect(board).toBeInTheDocument();
  });

  it("should generate puzzle game with worker when available", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["?g=p"]}>
        <Client />
      </MemoryRouter>
    );

    const board = container.querySelector("#board-container");

    expect(board).toBeInTheDocument();
  });

  it("should handle worker puzzle generation error", () => {
    (window.Worker as any) = MockErrorWorker;
    console.error = vi.fn();

    render(
      <MemoryRouter initialEntries={["?g=p"]}>
        <Client />
      </MemoryRouter>
    );

    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("should generate puzzle game without worker when unavailable", () => {
    (window.Worker as any) = undefined;

    const { container } = render(
      <MemoryRouter initialEntries={["?g=p"]}>
        <Client />
      </MemoryRouter>
    );

    const board = container.querySelector("#board-container");

    expect(board).toBeInTheDocument();
  });

  it("should handle non-worker puzzle generation error", () => {
    (window.Worker as any) = undefined;
    console.error = vi.fn();
    vi.spyOn(Algs, "generatePuzzleBoard").mockImplementation(() => {
      return { cells: [], knownCells: [], error: "mock error" };
    });

    render(
      <MemoryRouter initialEntries={["?g=p"]}>
        <Client />
      </MemoryRouter>
    );

    expect(console.error).toHaveBeenCalledTimes(1);
  });
});
