import React from "react";
import { render, screen } from "@testing-library/react";
import Hello from "../src/Hello";

test("renders default greeting", () => {
  render(<Hello />);
  expect(screen.getByText("Hello, World!")).toBeInTheDocument();
});

test("renders custom name", () => {
  render(<Hello name="Alice" />);
  expect(screen.getByText("Hello, Alice!")).toBeInTheDocument();
});
