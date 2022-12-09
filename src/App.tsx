import { Provider } from "react-redux";
import { Client } from "./components/Client";
import { Footer } from "./components/Footer";
import { store } from "./store";

export const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <div>
        <div className="flex">
          <Client />
        </div>
        <hr />
        <Footer />
      </div>
    </Provider>
  );
};
