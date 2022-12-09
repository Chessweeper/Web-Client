import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import type { PreloadedState } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import { store as AppStore, RootState } from "../src/store";
import { settingsSlice } from "../src/store/settings";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as initialState, store.
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: typeof AppStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = { settings: { isAttackedCellValuesEnabled: true } },
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: { settings: settingsSlice.reducer },
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const Wrapper = ({ children }: PropsWithChildren<unknown>): JSX.Element => (
    <Provider store={store}>{children}</Provider>
  );

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
