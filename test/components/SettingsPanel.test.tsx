// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { SettingsPanel } from "../../src/components/SettingsPanel";
import { SettingsContextState } from "../../src/GlobalSettings";

let mockSettings: SettingsContextState;
const mockSetSettings = vi.fn().mockImplementation((callback) => {
  mockSettings = callback(mockSettings);
});

describe("SettingsPanel tests", () => {
  beforeEach(() => {
    mockSettings = {
      isAttackedCellValuesEnabled: true,
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initially render with panel closed", () => {
    const { container } = render(
      <SettingsPanel settings={mockSettings} setSettings={mockSetSettings} />
    );

    const panel = container.querySelector("#settings-panel");

    expect(panel).not.toBeInTheDocument();
  });

  it("should open panel when settings icon is clicked", async () => {
    const { container } = render(
      <SettingsPanel settings={mockSettings} setSettings={mockSetSettings} />
    );

    const button = container.querySelector("#settings-button");
    if (button) await userEvent.click(button);
    const panel = container.querySelector("#settings-panel");

    expect(panel).toBeInTheDocument();
  });

  it("should close panel if open when settings icon is clicked", async () => {
    const { container } = render(
      <SettingsPanel settings={mockSettings} setSettings={mockSetSettings} />
    );

    const button = container.querySelector("#settings-button");
    if (button) await userEvent.dblClick(button);
    const panel = container.querySelector("#settings-panel");

    expect(panel).not.toBeInTheDocument();
  });

  it("should update settings on checkbox clicked", async () => {
    const { container } = render(
      <SettingsPanel settings={mockSettings} setSettings={mockSetSettings} />
    );

    const button = container.querySelector("#settings-button");
    if (button) await userEvent.click(button);
    const setting = container.querySelector("#attacked-cells-checkbox");
    if (setting) await userEvent.click(setting);

    expect(mockSetSettings).toHaveBeenCalledTimes(1);
    expect(mockSettings.isAttackedCellValuesEnabled).toBe(false);
  });
});
