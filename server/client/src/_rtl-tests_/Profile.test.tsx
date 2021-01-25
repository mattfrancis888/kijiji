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
    //I"m not sure how to mock cookies! Resources online does not work.
    //https://stackoverflow.com/questions/65877050/react-testing-library-redux-how-to-mock-cookies
    Object.defineProperty(window.document, "cookie", {
        writable: true,
        value: "ACCESS_TOKEN=omnomnom",
    });

    mockData = {
        user_id: 2,
        first_name: "Matt",
        last_name: "Smith",
        member_since: "2020-12-15T05:00:00.000Z",
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
            },
            {
                listing_id: 26,
                listing_name: "clear",
                listing_price: "123.00",
                listing_description: "me",
                category_id: 15,
                listing_image:
                    "https://res.cloudinary.com/du8n2aa4p/image/upload/v1609358433/kijiji/fbrxsjcv5dntbqsxrb1d.jpg",
                province: "Manitoba",
                city: "Swan River",
                street: "123",
                listing_date: "2020-12-30T05:00:00.000Z",
            },
            {
                listing_id: 30,
                listing_name: "barbel",
                listing_price: "2000000.00",
                listing_description: "tractor",
                category_id: 12,
                listing_image:
                    "https://res.cloudinary.com/du8n2aa4p/image/upload/v1609370659/kijiji/op5zynuvystrayhfcgp7.jpg",
                province: "British Columbia",
                city: "Lumby",
                street: "ee",
                listing_date: "2020-12-30T05:00:00.000Z",
            },
            {
                listing_id: 32,
                listing_name: "standard barbell",
                listing_price: "300.00",
                listing_description: "bye",
                category_id: 15,
                listing_image: null,
                province: "British Columbia",
                city: "Lumby",
                street: "Street",
                listing_date: "2021-01-11T05:00:00.000Z",
            },
            {
                listing_id: 33,
                listing_name: "standard barbell",
                listing_price: "300.00",
                listing_description: "bye",
                category_id: 15,
                listing_image: null,
                province: "British Columbia",
                city: "Lumby",
                street: "Street",
                listing_date: "2021-01-11T05:00:00.000Z",
            },
        ],
    };

    scope = nock("http://localhost:5000").get("/profile").reply(200, mockData, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
    });
    //Access-Control-Allow-Credentials msut be used so that we can communicate with
    // cookies

    //Mocking history:
    //https://www.reddit.com/r/reactjs/comments/b1hsno/how_can_i_test_historypush_inside_action/
    pushSpy = jest.spyOn(history, "push");
});

test("Profile page, ComponentDidMount() - Fill with listings", async () => {
    // app = render(
    //     <Root>
    //         <MemoryRouter initialEntries={["/profile"]} initialIndex={0}>
    //             <Routes />
    //         </MemoryRouter>
    //     </Root>
    // );
    // await waitForExpect(() => {
    //     if (!scope.isDone()) {
    //         console.error("pending mocks: %j", scope.pendingMocks());
    //     }
    //     expect(scope.isDone()).toBe(true);
    //     expect(app.getByText("Matt")).toBeInTheDocument();
    // });
    // pushSpy.mockRestore();
}, 30000);
