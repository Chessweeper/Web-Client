// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { BoardFooter } from "../../src/components/BoardFooter";
import { renderWithProviders } from "../mockStore";
import * as store from "../../src/store";
import { createMockBoardContext } from "../mocks";
import {
  BoardContext,
  BoardContextState,
} from "../../src/components/BoardWrapper";

const mockDispatch = vi.fn();
vi.spyOn(store, "useAppDispatch").mockImplementation(() => mockDispatch);

let boardContext: BoardContextState;

describe("BoardFooter tests", () => {
  beforeEach(() => {
    boardContext = createMockBoardContext();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initially render with switch container closed", () => {
    const { container } = renderWithProviders(
      <BoardContext.Provider value={boardContext}>
        <BoardFooter />
      </BoardContext.Provider>
    );

    const panel = container.querySelector("#settings-panel");

    expect(panel).not.toBeInTheDocument();
  });

  it("should open settings panel when settings icon is clicked", async () => {
    const { container } = renderWithProviders(
      <BoardContext.Provider value={boardContext}>
        <BoardFooter />
      </BoardContext.Provider>
    );
    const button = container.querySelector("#settings-button");
    if (button) await userEvent.click(button);
    const panel = container.querySelector("#settings-panel");

    expect(panel).toBeInTheDocument();
  });

  it("should close settings panel if open when settings icon is clicked", async () => {
    const { container } = renderWithProviders(
      <BoardContext.Provider value={boardContext}>
        <BoardFooter />
      </BoardContext.Provider>
    );

    const button = container.querySelector("#settings-button");
    if (button) await userEvent.dblClick(button);
    const panel = container.querySelector("#settings-panel");

    expect(panel).not.toBeInTheDocument();
  });

  it("should update settings on checkbox clicked", async () => {
    const { container } = renderWithProviders(
      <BoardContext.Provider value={boardContext}>
        <BoardFooter />
      </BoardContext.Provider>
    );

    const button = container.querySelector("#settings-button");
    if (button) await userEvent.click(button);
    const setting = container.querySelector("#setting-attacked-cell-values");
    if (setting) await userEvent.click(setting);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: false })
    );
  });
});
