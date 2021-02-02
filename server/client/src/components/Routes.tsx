import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import Register from "./Register";
import SignIn from "./SignIn";
import PostAd from "./PostAd";
import Listings from "./Listings";
import ListingDetail from "./ListingDetail";
import Profile from "./Profile";
import EditAd from "./EditAd";
import NotFound from "./NotFound";
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
                <Route path="/profile" exact component={Profile} />
                <Route path="/listing/:id/edit" exact component={EditAd} />
                <Route component={NotFound} />
            </Switch>
        </React.Fragment>
    );
};

export default Routes;
