// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { SettingsPanel } from "../../src/components/SettingsPanel";
import { renderWithProviders } from "../mockStore";
import * as store from "../../src/store";

const mockDispatch = vi.fn();
vi.spyOn(store, "useAppDispatch").mockImplementation(() => mockDispatch);

describe("SettingsPanel tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initially render with switch container closed", () => {
    const { container } = renderWithProviders(<SettingsPanel />);

    const panel = container.querySelector(".switch-container");

    expect(panel).not.toBeInTheDocument();
  });

  it("should open settings panel when settings icon is clicked", async () => {
    const { container } = renderWithProviders(<SettingsPanel />);

    const button = container.querySelector("#settings-button");
    if (button) await userEvent.click(button);
    const panel = container.querySelector(".switch-container");

    expect(panel).toBeInTheDocument();
  });

  it("should close settings panel if open when settings icon is clicked", async () => {
    const { container } = renderWithProviders(<SettingsPanel />);

    const button = container.querySelector("#settings-button");
    if (button) await userEvent.dblClick(button);
    const panel = container.querySelector(".switch-container");

    expect(panel).not.toBeInTheDocument();
  });

  it("should update settings on checkbox clicked", async () => {
    const { container } = renderWithProviders(<SettingsPanel />);

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
