//FUTURE ME: Proxy in package.json breaks nock's tests;
//mocking cookies work; didn't fully test the app, but I get the idea :)
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
let listingDetailMockData: any;

beforeEach(async () => {
    listingDetailMockData = {
        first_name: "Matt",
        last_name: "Smith",
        member_since: "2020-12-15T05:00:00.000Z",
        email: "h@gmail.com",
        listing_id: 23,
        listing_name: "barbell",
        listing_price: "20.00",
        listing_description: "20",
        category_name: "Furniture",
        listing_image:
            "https://res.cloudinary.com/du8n2aa4p/image/upload/v1609282699/kijiji/n9oayrypkob3f98iorqx.jpg",
        province: "British Columbia",
        city: "City of Port Moody",
        street: "stree",
        listing_date: "2020-12-29T05:00:00.000Z",
    };

    app = render(
        <Root>
            <MemoryRouter initialEntries={["/listing/23"]} initialIndex={0}>
                <Routes />
            </MemoryRouter>
        </Root>
    );
    //Access-Control-Allow-Credentials msut be used so that we can communicate with
    // cookies

    scope = nock("http://localhost:5000/")
        .get("/listing/23")
        .reply(200, listingDetailMockData, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
        });
});

test("Listing detail", async () => {
    await waitForExpect(() => {
        if (!scope.isDone()) {
            console.error("pending mocks: %j", scope.pendingMocks());
        }
        expect(scope.isDone()).toBe(true);
        expect(
            app.getByText(listingDetailMockData.listing_name)
        ).toBeInTheDocument();
    });
}, 30000);
