// filepath: /Users/kamarimoore/Desktop/MERN AI Practice/cost-of-living-fi-calculator/client/src/pages/__tests__/ScenarioComparison.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import ScenarioComparison from "../ScenarioComparison";
// If you are not using Jest, import expect from vitest or another test runner
import { expect, it } from "vitest";

it("renders comparison page and search box", () => {
  render(<ScenarioComparison />);
  expect(screen.getByPlaceholderText(/search by title/i)).toBeInTheDocument();
});

// Test for filtering comparisons by title
it("filters saved comparisons by title", () => {
  // Mock savedComparisons and filterText state if needed
  // For a real test, you may need to refactor ScenarioComparison to accept props or use a mock provider
  render(<ScenarioComparison />);
  const searchBox = screen.getByPlaceholderText(/search by title/i);
  fireEvent.change(searchBox, { target: { value: "Retirement" } });
  // You would check for a comparison with "Retirement" in the title
  // expect(screen.getByText(/Retirement/)).toBeInTheDocument();
});

// Add more tests: selecting scenarios, filtering, displaying comparisons, etc.

/**

What to test:

Rendering of main components (dashboard, comparison table, charts)
Search/filter functionality
Highlighting best/worst values
Navigation buttons (back to dashboard, edit scenario)
Edge cases (empty states, error messages)

  */
