// @vitest-environment jsdom
import { setupStore } from "../../src/store";
import reducer, {
  Settings,
  SETTINGS_STORAGE_KEY,
  toggleAttackedCellValuesEnabled,
} from "../../src/store/settings";

const mockGetItem = vi.spyOn(Storage.prototype, "getItem");
const mockSetItem = vi.spyOn(Storage.prototype, "setItem");

describe("settings store", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should set initial settings from localStorage when available", () => {
    const storedSettings: Settings = { isAttackedCellValuesEnabled: false };
    mockGetItem.mockImplementationOnce(() => JSON.stringify(storedSettings));

    const result = reducer(undefined, { type: undefined });

    expect(result).toStrictEqual(storedSettings);
  });

  it("should update state with setIsAttackedCellValuesEnabled action", () => {
    const previousState: Settings = {
      isAttackedCellValuesEnabled: false,
    };
    const expectedState = { isAttackedCellValuesEnabled: true };

    const result = reducer(previousState, toggleAttackedCellValuesEnabled());

    expect(result).toEqual(expectedState);
  });

  it("should update localStorage settings on dispatch", () => {
    const store = setupStore();

    store.dispatch(toggleAttackedCellValuesEnabled());

    expect(mockSetItem).toHaveBeenCalledWith(
      SETTINGS_STORAGE_KEY,
      expect.anything()
    );
  });
});
