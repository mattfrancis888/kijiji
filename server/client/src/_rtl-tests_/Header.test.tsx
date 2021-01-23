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
import Modal from "components/Modal";
import nock from "nock";
import waitForExpect from "wait-for-expect";

import Cookies from "js-cookie";
import history from "browserHistory";
let pushSpy: jest.SpyInstance;
let app: RenderResult;
afterEach(() => {
    cleanup();
});

describe("Header - When users are not signed in", () => {
    beforeEach(async () => {
        app = render(
            <Root>
                <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                    <Routes />
                </MemoryRouter>
            </Root>
        );

        //Mocking history:
        //https://www.reddit.com/r/reactjs/comments/b1hsno/how_can_i_test_historypush_inside_action/
        pushSpy = jest.spyOn(history, "push");
    });

    test("Click logo", async () => {
        act(() => {
            fireEvent.click(app.getByTestId("kijijiLogo"));
        });
        expect(pushSpy).toBeCalledWith("/listings/1");
        pushSpy.mockRestore();
    });

    test("Click register text", async () => {
        act(() => {
            fireEvent.click(app.getByTestId("headerRegisterText"));
        });
        expect(pushSpy).toBeCalledWith("/signup");
        pushSpy.mockRestore();
    });

    test("Click sign in text", async () => {
        act(() => {
            fireEvent.click(app.getByTestId("headerSignInText"));
        });
        expect(pushSpy).toBeCalledWith("/signin");
        pushSpy.mockRestore();
    });

    test("Click post ad button", async () => {
        //user is not signed in, so they cannot post an ad
        act(() => {
            fireEvent.click(app.getByTestId("postAdButtotn"));
        });
        expect(pushSpy).toBeCalledWith("/post-ad");
        //BUT IF user is not signed in, it should be
        // expect(pushSpy).toBeCalledWith("/");
        pushSpy.mockRestore();
    });

    test("Click search icon", async () => {
        //user is not signed in, so they cannot post an ad
        act(() => {
            fireEvent.click(app.getAllByTestId("searchIcon")[0]);
        });
        expect(pushSpy).toBeCalledWith("/listings/1");
        pushSpy.mockRestore();
    });

    //React's portals (Modal component)
    //It will complain " Target container is not a DOM element."
    //because Modal is created at a different div than "root" div in index.html
    //https://testing-library.com/docs/example-react-modal/
    //I'm not too sure how to test it, Modal still gives errors + no guides online?
    // test("Click filter icon", async () => {
    //     //user is not signed in, so they cannot post an ad
    //     act(() => {
    //         fireEvent.click(app.getAllByTestId("filterIcon")[0]);
    //     });
    //     const handleClose = jest.fn();
    //     const { getByText } = render(
    //         <Modal content={<div></div>} onDismiss={handleClose} title="test">
    //             test
    //         </Modal>
    //     );

    //     expect(getByText("test")).toBeTruthy();
    //     app.debug();
    //     //expect("searchFilterForm").toBeInTheDocument();
    //     // pushSpy.mockRestore();
    // });
});

describe("Header - When users are already signed in", () => {
    let app: RenderResult;
    beforeEach(async () => {
        Object.defineProperty(window.document, "cookie", {
            writable: true,
            value: "ACCESS_TOKEN=omnomnom",
        });

        app = render(
            <Root>
                <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                    <Routes />
                </MemoryRouter>
            </Root>
        );

        pushSpy = jest.spyOn(history, "push");
    });

    test("Check post ad", async () => {
        act(() => {
            fireEvent.click(app.getByTestId("postAdButtotn"));
        });
        expect(pushSpy).toBeCalledWith("/post-ad");
    });
});
