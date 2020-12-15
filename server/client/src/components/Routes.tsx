import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import Register from "./Register";
import SignIn from "./SignIn";
const Routes: React.FC<{}> = () => {
    return (
        <React.Fragment>
            <Header />
            <Switch>
                <Route path="/" exact component={Register} />
                <Route path="/sign-in" exact component={SignIn} />
            </Switch>
        </React.Fragment>
    );
};

export default Routes;
