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
    <SettingsContext.Provider value={globalSettings}>
      <div>
        <SettingsPanel
          settings={globalSettings}
          setSettings={setGlobalSettings}
        />
        <div className="flex">
          <Client />
        </div>
        <hr />
        <Footer />
      </div>
    </SettingsContext.Provider>
  );
};
