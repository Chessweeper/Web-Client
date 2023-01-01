// @vitest-environment jsdom
import reducer, {
  ATTACKED_CELLS_STORAGE_KEY,
  Settings,
  setIsAttackedCellValuesEnabled,
} from "../../src/store/settings";

const mockSetItem = vi.spyOn(Storage.prototype, "setItem");

describe("settings store", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should update state with setIsAttackedCellValuesEnabled action", () => {
    const previousState: Settings = {
      isAttackedCellValuesEnabled: false,
    };

    const result = reducer(previousState, setIsAttackedCellValuesEnabled(true));

    expect(result).toEqual({ isAttackedCellValuesEnabled: true });

    expect(mockSetItem).toHaveBeenCalledWith(
      ATTACKED_CELLS_STORAGE_KEY,
      "true"
    );
  });
});
