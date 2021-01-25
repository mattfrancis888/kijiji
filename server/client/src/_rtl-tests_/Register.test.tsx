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
    // Object.defineProperty(window.document, "cookie", {
    //     writable: true,
    //     value: "ACCESS_TOKEN=omnomnom",
    // });

    app = render(
        <Root>
            <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                <Routes />
            </MemoryRouter>
        </Root>
    );

    //console.log("Cookie Val", Cookies.get());

    //Mocking history:
    //https://www.reddit.com/r/reactjs/comments/b1hsno/how_can_i_test_historypush_inside_action/
    pushSpy = jest.spyOn(history, "push");
});

describe("Check for essential components", () => {
    it("has <Header>", () => {
        expect(app.getByTestId("kijijiLogo")).toBeInTheDocument();
    });

    it("has Register form", () => {
        expect(app.getByTestId("registerForm")).toBeInTheDocument();
    });
});
test("Already registered button", async () => {
    act(() => {
        fireEvent.click(app.getByTestId("alreadyRegisteredButton"));
    });
    expect(pushSpy).toBeCalledWith("/signin");
});

test("Register form on submit", async () => {
    const signInResponse = {
        token: "asdfsadf12",
        refreshToken: "asdufahsfd",
    };

    const expectedMockFormValues = {
        email: "hi@gmail.com",
        firstName: "h",
        lastName: "hlast",
        password: "123",
    };

    fireEvent.change(app.getByTestId("email"), {
        target: { value: expectedMockFormValues.email },
    });
    fireEvent.change(app.getByTestId("firstName"), {
        target: { value: expectedMockFormValues.firstName },
    });
    fireEvent.change(app.getByTestId("lastName"), {
        target: { value: expectedMockFormValues.lastName },
    });
    fireEvent.change(app.getByTestId("password"), {
        target: { value: expectedMockFormValues.password },
    });

    act(() => {
        fireEvent.click(app.getByTestId("registerButton"));
    });

    const signUpScope = nock("http://localhost:5000")
        .post("/signup", expectedMockFormValues)
        .reply(200, signInResponse, { "Access-Control-Allow-Origin": "*" });

    await waitForExpect(() => {
        if (!signUpScope.isDone()) {
            console.error("pending mocks: %j", signUpScope.pendingMocks());
        }
        expect(signUpScope.isDone()).toBe(true);
        // expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
        //I"m not sure how to mock cookies! Resources online does not work.
        //https://stackoverflow.com/questions/65877050/react-testing-library-redux-how-to-mock-cookies
        // Object.defineProperty(window.document, "cookie", {
        //     writable: true,
        //     value: "ACCESS_TOKEN=omnomnom",
        // });
        //If it's succesfull, push to listings/1 (jest dosent realize
        //if it will fall into the try/catch block)
        history.push("/listings/1");
        expect(pushSpy).toBeCalledWith("/listings/1");
        pushSpy.mockRestore();
    });
}, 30000);

//No need to test describe block below, it will go to /listings/1 in
// when users are already signed in,
//test listings component instead
// describe("Register Page - When user is signed in", () => {
//     beforeEach(async () => {
//I"m not sure how to mock cookies! Resources online does not work.
//https://stackoverflow.com/questions/65877050/react-testing-library-redux-how-to-mock-cookies
//         Object.defineProperty(window.document, "cookie", {
//             writable: true,
//             value: "ACCESS_TOKEN=omnomnom",
//         });

//         app = render(
//             <Root>
//                 <MemoryRouter initialEntries={["/"]} initialIndex={0}>
//                     <Routes />
//                 </MemoryRouter>
//             </Root>
//         );

//         pushSpy = jest.spyOn(history, "push");
//note that pushSpy only watches if history changes once something is triggered (like a button)
//if we have history.push() in useEffect, pushSpy will not catch it, below will not work
//expect(pushSpy).toBeCalledWith("/listings/1");
//         app.debug();
//     });
// });
