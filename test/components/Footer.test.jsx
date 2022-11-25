/* eslint-disable no-global-assign */
// @vitest-environment jsdom
import { MemoryRouter } from "react-router-dom";
import { render, waitFor, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Footer } from "../../src/components/Footer";
import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

console.error = vi.fn();

describe("Footer tests", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the daily puzzle link on successful daily api call", async () => {
    fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => "mockPuzzleSeed",
    });

    const { container } = render(<Footer />, { wrapper: MemoryRouter });

    await screen.findByText("Daily");
    const dailyPuzzleLink = container.querySelector("#daily");

    expect(dailyPuzzleLink).toBeInTheDocument();
  });

  it("should not render the daily puzzle link on unsuccessful daily api call", async () => {
    fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    render(<Footer />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledOnce();
    });

    const dailyPuzzleLink = screen.queryByText("#daily");

    expect(dailyPuzzleLink).not.toBeInTheDocument();
  });

  it("should not render the daily puzzle when daily puzzle api returns string greater than length 20", async () => {
    fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => "longErrorValueOnFetchReturn",
    });

    render(<Footer />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledOnce();
    });

    const dailyPuzzleLink = screen.queryByText("#daily");

    expect(dailyPuzzleLink).not.toBeInTheDocument();
  });
});
