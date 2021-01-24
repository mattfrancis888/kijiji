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
import { ORDER_BY_OLDEST_DATE } from "components/Listings";
import Cookies from "js-cookie";
import history from "browserHistory";
let pushSpy: jest.SpyInstance;
let app: RenderResult;
afterEach(() => {
    cleanup();
});
let scope: nock.Scope;
let mockData: any;

beforeEach(async () => {
    app = render(
        <Root>
            <MemoryRouter initialEntries={["/listings/1"]} initialIndex={0}>
                <Routes />
            </MemoryRouter>
        </Root>
    );
    mockData = {
        totalListings: 8,
        page: 1,
        limitPerPage: 3,
        listings: [
            {
                listing_id: 23,
                listing_name: "barbell",
                listing_price: "20.00",
                listing_description: "20",
                category_id: 12,
                listing_image:
                    "https://res.cloudinary.com/du8n2aa4p/image/upload/v1609282699/kijiji/n9oayrypkob3f98iorqx.jpg",
                province: "British Columbia",
                city: "City of Port Moody",
                street: "stree",
                listing_date: "2020-12-29T05:00:00.000Z",
                name_tokens: "'barbel':1",
            },
            {
                listing_id: 22,
                listing_name: "olympic barbell 45lb",
                listing_price: "20.00",
                listing_description: "20",
                category_id: 12,
                listing_image:
                    "https://res.cloudinary.com/du8n2aa4p/image/upload/v1609282189/kijiji/gp1kbzzgdbetn0mwvolh.jpg",
                province: "British Columbia",
                city: "City of Port Moody",
                street: "stree",
                listing_date: "2020-12-29T05:00:00.000Z",
                name_tokens: "'45lb':3 'barbel':2 'olymp':1",
            },
            {
                listing_id: 25,
                listing_name: "cool!!!",
                listing_price: "22.00",
                listing_description: "empty desc",
                category_id: 11,
                listing_image:
                    "https://res.cloudinary.com/du8n2aa4p/image/upload/v1611012719/kijiji/r8hwltafijv0xnigyacp.jpg",
                province: "British Columbia",
                city: "Lumby",
                street: "hye",
                listing_date: "2020-12-29T05:00:00.000Z",
                name_tokens: "'cool':1",
            },
        ],
    };
    scope = nock("http://localhost:5000")
        .get("/listing-oldest-date/1")
        .reply(200, mockData, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
        });
    //Access-Control-Allow-Credentials msut be used so that we can communicate with
    // cookies

    //Mocking history:
    //https://www.reddit.com/r/reactjs/comments/b1hsno/how_can_i_test_historypush_inside_action/
    pushSpy = jest.spyOn(history, "push");
});

test("Listing page, ComponentDidMount() - Fill listing page with listings", async () => {
    await waitForExpect(() => {
        if (!scope.isDone()) {
            console.error("pending mocks: %j", scope.pendingMocks());
        }
        expect(scope.isDone()).toBe(true);
        expect(app.getByText("barbell")).toBeInTheDocument();
    });
}, 30000);

test("Pagination exists", async () => {
    expect(app.getByText("1")).toBeInTheDocument();
}, 30000);

test("Pagination click", async () => {
    // app.debug();
    expect(app.getByText("1")).toBeInTheDocument();
    act(() => {
        fireEvent.click(app.getByText("1"));
    });
    expect(pushSpy).toBeCalledWith({ pathname: "/listings/1", search: "" });
    pushSpy.mockRestore();
}, 30000);

// test("Dropdown value", async () => {
//     // app.debug();
//     console.log(ORDER_BY_OLDEST_DATE);
//     expect(app.getByText(ORDER_BY_OLDEST_DATE)).toBeInTheDocument();
//     act(() => {
//         fireEvent.click(app.getByText(ORDER_BY_OLDEST_DATE));
//     });

//     expect(app.getByText("1")).toBeInTheDocument();
//     act(() => {
//         fireEvent.click(app.getByText("1"));
//     });

//     scope = nock("http://localhost:5000")
//         .get("/listing-oldest-date/1")
//         .reply(200, mockData, {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Credentials": "true",
//         });
//     await waitForExpect(() => {
//         if (!scope.isDone()) {
//             console.error("pending mocks: %j", scope.pendingMocks());
//         }
//         expect(scope.isDone()).toBe(true);
//         expect(app.getByText("barbell")).toBeInTheDocument();
//     });
// }, 30000);
