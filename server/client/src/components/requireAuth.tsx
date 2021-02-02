import React, { Component } from "react";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import { History } from "history";
import { validateToken } from "../actions";
import { useLocation } from "react-router-dom";

import history from "../browserHistory";

export interface IHoc {
    authStatus?: string | null;
    history: History;
    validateToken(path: string, retriedCalling: boolean): void;
}

const hoc = (ChildComponent: any) => {
    class ComposedComponent extends Component<IHoc> {
        // Our component just got rendered
        //Check for redux store's authStatus
        componentDidMount() {
            this.shouldNavigateAway();
        }

        // Our component just got updated
        //If our redux store's authStatus changes
        componentDidUpdate() {
            this.shouldNavigateAway();
        }

        shouldNavigateAway() {
            if (!this.props.authStatus) {
                //if authStatus is empty string
                //history is automatically passed due to React-router
                //If done loading
                this.props.history.push("/");
            } else {
                //When user enter a page,
                //validate access token, if it's not valid, redux's authStatus would be empty

                this.props.validateToken(history.location.pathname, false);
            }
        }

        render() {
            return <ChildComponent {...this.props} />;
        }
    }

    function mapStateToProps(state: StoreState) {
        return {
            authStatus: state.authStatus.authenticated,
        };
    }

    return connect(mapStateToProps, { validateToken })(ComposedComponent);
};

export default hoc;
