import React from "react";
import { render, screen } from "@testing-library/react";
import {App} from "./App";

const data = [{ title: "Test", content: "This is a test." }];

test("renders learn react link", () => {
    render(<App data={data} />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
