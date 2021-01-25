import Root from "Root";
import React from "react";
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
import nock from "nock";
import waitForExpect from "wait-for-expect";

import Cookies from "js-cookie";
import history from "browserHistory";

afterEach(() => {
    cleanup();
});
let app: RenderResult;
let pushSpy: jest.SpyInstance;

//https://stackoverflow.com/questions/50761393/how-to-mock-cookie-getlanguage-in-jest

beforeEach(async () => {
    app = render(
        <Root>
            <MemoryRouter initialEntries={["/signin"]} initialIndex={0}>
                <Routes />
            </MemoryRouter>
        </Root>
    );
    //Mocking history:
    //https://www.reddit.com/r/reactjs/comments/b1hsno/how_can_i_test_historypush_inside_action/
    pushSpy = jest.spyOn(history, "push");
});

test("Sign in button", async () => {
    act(() => {
        fireEvent.click(app.getByTestId("registerNowButton"));
    });
    expect(pushSpy).toBeCalledWith("/");
});

test("Sign in form on submit", async () => {
    const signInResponse = {
        token: "asdfsadf12",
        refreshToken: "asdufahsfd",
    };

    const expectedMockFormValues = {
        email: "hi@gmail.com",
        password: "123",
    };

    fireEvent.change(app.getByTestId("email"), {
        target: { value: expectedMockFormValues.email },
    });
    fireEvent.change(app.getByTestId("password"), {
        target: { value: expectedMockFormValues.password },
    });

    act(() => {
        fireEvent.click(app.getByTestId("signInButton"));
    });

    const signInScope = nock("http://localhost:5000")
        .post("/signin", expectedMockFormValues)
        .reply(200, signInResponse, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
        });

    await waitForExpect(() => {
        if (!signInScope.isDone()) {
            console.error("pending mocks: %j", signInScope.pendingMocks());
        }
        expect(signInScope.isDone()).toBe(true);
        // expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
        //If it's succesfull, push to listings/1
        //console.log(Cookies.get());
        expect(pushSpy).toBeCalledWith("/listings/1");
        pushSpy.mockRestore();
    });
}, 30000);
