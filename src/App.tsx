import { Client } from "./components/Client";
import { Footer } from "./components/Footer";

export const App = (): JSX.Element => {
  return (
    <div>
      <div className="flex">
        <Client />
      </div>
      <hr />
      <Footer />
    </div>
  );
};
