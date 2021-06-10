import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

let app;
beforeEach(() => {
  app = render(<App />);
});

test("renders 12 mnemonic words by default", () => {
  const btn = screen.getByTestId("btn-mnemonic");
  fireEvent.click(btn);
  const card = screen.getByTestId("generate-mnemonics");
  const cardTextLength = card.textContent?.trim().split(" ").length;
  expect(cardTextLength).toBe(12);
});

test("renders 24 mnemonic words by when user select 24", () => {
  const selectOptions = screen.getByTestId("select-mnemonic");
  fireEvent.change(selectOptions, { target: { value: 256 } });
  let options: any = screen.getAllByTestId("select-option");

  const btn = screen.getByTestId("btn-mnemonic");
  fireEvent.click(btn);
  const card = screen.getByTestId("generate-mnemonics");
  const cardTextLength = card.textContent?.trim().split(" ").length;

  expect(options[4].selected).toBeTruthy();
  expect(cardTextLength).toBe(24);
});

test("renders a default segwit bitcoin address using the default values", () => {
  const btn = screen.getByTestId("btn-segwit-address");
  fireEvent.click(btn);
  const card = screen.getByTestId("segwit-address-card");
  const cardTextLength = card.textContent?.trim().split(" ").length;
  expect(cardTextLength).toBe(1);
  expect(card.textContent).toBe("bc1qj3epxlzxgd4v4p80q2u24sf0mc6q5dt7fd7p47");
});

test("renders segwit bitcoin address when seed and paths are inputed", () => {
  const seedInput = screen.getByTestId("segwit-address-seed");
  const pathInput = screen.getByTestId("segwit-address-path");

  fireEvent.change(seedInput, {
    target: {
      value:
        "shrug acid involve tell hen require tide alcohol erupt ancient grow various slam dutch prison unique claim flock",
    },
  });
  fireEvent.change(pathInput, { target: { value: "m/44'/1'/1'" } });
  const btn = screen.getByTestId("btn-segwit-address");
  fireEvent.click(btn);
  const card = screen.getByTestId("segwit-address-card");
  const cardTextLength = card.textContent?.trim().split(" ").length;
  expect(cardTextLength).toBe(1);
  // segwit addresses must all start with `bc1`
  expect(card.textContent?.trim().substring(0, 3)).toBe("bc1");
});
