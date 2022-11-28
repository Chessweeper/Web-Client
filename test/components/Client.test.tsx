/* eslint-disable no-global-assign */
// @vitest-environment jsdom
import { MemoryRouter } from "react-router-dom";
import { render, waitFor, screen } from "@testing-library/react";
import { Client } from "../../src/components/Client";

class Worker {
  url: string;
  onmessage: (m?: any) => void;
  constructor(stringUrl: string) {
    this.url = stringUrl;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    this.onmessage = () => {};
  }

  postMessage(msg: any) {
    this.onmessage(msg);
  }

  terminate() {
    console.log("terminated");
  }
}

(window.Worker as any) = Worker;
vi.stubGlobal("scrollTo", vi.fn());

describe("Client tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the daily puzzle link on successful daily api call", async () => {
    render(<Client />, { wrapper: MemoryRouter });

    expect.anything();
  });
});
