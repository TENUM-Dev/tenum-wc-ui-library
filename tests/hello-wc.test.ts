import { register } from "../src/index";
import { waitFor } from "@testing-library/dom";

beforeAll(() => {
  register();
});

test("web component renders and reflects attribute", async () => {
  const el = document.createElement("x-hello");
  document.body.appendChild(el);
  (el as any).name = "Bob";

  await waitFor(() => {
    expect(document.body.innerHTML).toContain("Hello, Bob!");
  });
});
