import { useState } from "react";
import { Client } from "./components/Client";
import { Footer } from "./components/Footer";
import { SettingsPanel } from "./components/SettingsPanel";
import { getLocalStorageSettings, SettingsContext } from "./GlobalSettings";

export const App = (): JSX.Element => {
  const [globalSettings, setGlobalSettings] = useState(
    getLocalStorageSettings()
  );

  return (
    <>
      <SettingsPanel
        settings={globalSettings}
        setSettings={setGlobalSettings}
      />
      <SettingsContext.Provider value={globalSettings}>
        <div>
          <div className="flex">
            <Client />
          </div>
          <hr />
          <Footer />
        </div>
      </SettingsContext.Provider>
    </>
  );
};
