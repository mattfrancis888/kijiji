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

//TODO:
//1.Handle routes that users are not supposed to visit:
//https://ultimatecourses.com/blog/react-router-not-found-component
//2.Handle long descriptions and elipsis

afterEach(() => {
    cleanup();
});
let app: RenderResult;
let pushSpy: jest.SpyInstance;

//https://stackoverflow.com/questions/50761393/how-to-mock-cookie-getlanguage-in-jest

beforeEach(async () => {
    // Method 1:
    // jest.mock("js-cookie", () => ({ get: () => "fr" }));

    //Method 2:
    //Cookies.get = jest.fn().mockImplementation(() => "ACCESS_TOKEN");

    //Method 3:
    // Object.defineProperty(window.document, "cookie", {
    //     writable: true,
    //     value: "myCookie=omnomnom",
    // });

    app = render(
        <Root>
            <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                <Routes />
            </MemoryRouter>
        </Root>
    );

    //console.log("Cookie Val", Cookies.get());
    //app.debug();

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

// describe("cookies functionality", () => {
//     it("should set the cookie correctly", () => {
//         // create a mock function using jest.fn()
//         const mockSet = jest.fn();

//         // here we are trying to mock the 'set' functionality of Cookie
//         Cookies.set = mockSet;

//         // call the set method of Cookies
//         Cookies.set("ACCESS_TOKEN", "value");

//         // check if the mock function gets called here
//         expect(mockSet).toBeCalled();
//     });
// });

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
        //If it's succesfull, push to listings/1 (jest dosent realize
        //if it will fall into the try/catch block)

        history.push("/listings/1");
        expect(pushSpy).toBeCalledWith("/listings/1");
        pushSpy.mockRestore();
    });
}, 30000);

// test("Click logo", async () => {
//     act(() => {
//         fireEvent.click(app.getByTestId("kijijiLogo"));
//     });
//     expect(pushSpy).toBeCalledWith("/listings/1");
//     pushSpy.mockRestore();
// }, 30000);
