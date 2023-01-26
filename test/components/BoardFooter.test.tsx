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
import { act, screen } from "@testing-library/react";

const mockDispatch = vi.fn();
vi.spyOn(store, "useAppDispatch").mockImplementation(() => mockDispatch);

let boardContext: BoardContextState;

describe("BoardFooter tests", () => {
  beforeAll(() => {
    // HTML Dialog not supported in jsdom yet, so have to mock it
    // https://github.com/jsdom/jsdom/pull/3403
    HTMLDialogElement.prototype.showModal = vi.fn(function mock(
      this: HTMLDialogElement
    ) {
      this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function mock(
      this: HTMLDialogElement
    ) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    });
  });

  beforeEach(() => {
    boardContext = createMockBoardContext();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("settings", () => {
    it("should initially render with settings panel closed", () => {
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

      const button = await screen.findByTitle("Settings");
      await userEvent.click(button);
      const panel = container.querySelector("#settings-panel");

      expect(panel).toBeInTheDocument();
    });

    it("should close settings panel if open when settings icon is clicked", async () => {
      const { container } = renderWithProviders(
        <BoardContext.Provider value={boardContext}>
          <BoardFooter />
        </BoardContext.Provider>
      );

      const button = await screen.findByTitle("Settings");
      await userEvent.dblClick(button);
      const panel = container.querySelector("#settings-panel");

      expect(panel).not.toBeInTheDocument();
    });

    it("should update settings on checkbox clicked", async () => {
      const { container } = renderWithProviders(
        <BoardContext.Provider value={boardContext}>
          <BoardFooter />
        </BoardContext.Provider>
      );

      const button = await screen.findByTitle("Settings");
      await userEvent.click(button);
      const setting = container.querySelector("#setting-attacked-cell-values");
      if (setting) await userEvent.click(setting);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "settings/toggleAttackedCellValuesEnabled",
        })
      );
    });
  });

  describe("share", () => {
    beforeAll(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(),
        },
      });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should open modal on share icon clicked", async () => {
      renderWithProviders(
        <BoardContext.Provider value={boardContext}>
          <BoardFooter />
        </BoardContext.Provider>
      );

      const shareIcon = await screen.findByTitle("Share this Board");
      await userEvent.click(shareIcon);

      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it("should hide modal on modal X clicked", async () => {
      renderWithProviders(
        <BoardContext.Provider value={boardContext}>
          <BoardFooter />
        </BoardContext.Provider>
      );

      const shareIcon = await screen.findByTitle("Share this Board");
      await userEvent.click(shareIcon);
      const closeIcons = await screen.findAllByTitle("Close");
      await userEvent.click(closeIcons[0]);

      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it("should copy url and show tooltip copy clicked", async () => {
      renderWithProviders(
        <BoardContext.Provider value={boardContext}>
          <BoardFooter />
        </BoardContext.Provider>
      );

      const copyButton = await screen.findByText("Copy");
      await userEvent.click(copyButton);
      const copiedTooltip = await screen.findByText("Copied");

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
      expect(copiedTooltip).toBeInTheDocument();
    });

    it("should hide tooltip after timer expires", async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      renderWithProviders(
        <BoardContext.Provider value={boardContext}>
          <BoardFooter />
        </BoardContext.Provider>
      );

      const copyButton = await screen.findByText("Copy");
      await user.click(copyButton);
      const copiedTooltip = await screen.findByText("Copied");

      act(() => {
        vi.runAllTimers();
      });

      expect(copiedTooltip).not.toBeInTheDocument();
    });

    it("should use native sharing on mobile devices", async () => {
      vi.spyOn(navigator, "userAgent", "get").mockReturnValue("iPhone");

      Object.assign(navigator, {
        share: vi.fn(),
        canShare: vi.fn().mockReturnValue(true),
      });

      renderWithProviders(
        <BoardContext.Provider value={boardContext}>
          <BoardFooter />
        </BoardContext.Provider>
      );

      const shareIcon = await screen.findByTitle("Share this Board");
      await userEvent.click(shareIcon);

      expect(navigator.share).toHaveBeenCalled();
    });
  });
});
