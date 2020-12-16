import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import Register from "./Register";
import SignIn from "./SignIn";
import PostAd from "./PostAd";
const Routes: React.FC<{}> = () => {
    return (
        <React.Fragment>
            <Header />
            <Switch>
                <Route path="/" exact component={Register} />
                <Route path="/sign-in" exact component={SignIn} />
                <Route path="/post-ad" exact component={PostAd} />
            </Switch>
        </React.Fragment>
    );
};

export default Routes;
