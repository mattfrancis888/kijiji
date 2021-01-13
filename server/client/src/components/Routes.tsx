import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import Register from "./Register";
import SignIn from "./SignIn";
import PostAd from "./PostAd";
import Listings from "./Listings";
import ListingDetail from "./ListingDetail";
import Profile from "./Profile";
const Routes: React.FC<{}> = () => {
    return (
        <React.Fragment>
            <Header />
            <Switch>
                <Route path="/" exact component={Register} />
                <Route path="/signin" exact component={SignIn} />
                <Route path="/post-ad" exact component={PostAd} />
                <Route path="/listings/:page" exact component={Listings} />
                <Route path="/listing/:id" exact component={ListingDetail} />
                <Route path="/profile/:id" exact component={Profile} />
            </Switch>
        </React.Fragment>
    );
};

export default Routes;
