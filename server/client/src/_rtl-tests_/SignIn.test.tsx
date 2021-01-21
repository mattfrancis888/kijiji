import Root from "Root";
import React from "react";
import Body from "components/Body";
import Listing from "components/Listing";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router";
import Routes from "components/Routes";
import {
    render,
    cleanup,
    RenderResult,
    fireEvent,
} from "@testing-library/react";
import { act } from "react-dom/test-utils";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import history from "browserHistory";

afterEach(() => {
    cleanup();
});
let app: RenderResult;

beforeEach(async () => {
    app = render(
        <Root>
            <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                <Routes />
            </MemoryRouter>
        </Root>
    );
});

describe("Check for essential components", () => {
    it("has <Header>", () => {
        expect(app.getByTestId("kijijiLogo")).toBeInTheDocument();
    });
});
