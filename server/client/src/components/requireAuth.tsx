import React, { Component } from "react";
import { connect } from "react-redux";
import { StoreState } from "../reducers";
import { History } from "history";
import { validateToken } from "../actions";

export interface IHoc {
    authStatus?: string | null;
    history: History;
    validateToken(path: string, token: string): void;
    // path: string;
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
                this.props.history.push("/");
            } else {
                //validate access token, if it's not valid, redux's authStatus would be empty
                this.props.validateToken("/post-ad", this.props.authStatus);
            }
        }

        render() {
            return <ChildComponent {...this.props} />;
        }
    }

    function mapStateToProps(state: StoreState) {
        return { authStatus: state.authStatus.authenticated };
    }

    return connect(mapStateToProps, { validateToken })(ComposedComponent);
};

export default hoc;
