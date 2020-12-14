import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import Register from "./Register";
const Routes: React.FC<{}> = () => {
    return (
        <React.Fragment>
            <Header />
            <Switch>
                <Route path="/" exact component={Register} />
            </Switch>
        </React.Fragment>
    );
};

export default Routes;
