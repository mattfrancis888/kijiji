import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";

const Routes: React.FC<{}> = () => {
    return (
        <React.Fragment>
            <Header />
            <Switch>{/* <Route path="/" exact component={Body} /> */}</Switch>
        </React.Fragment>
    );
};

export default Routes;
