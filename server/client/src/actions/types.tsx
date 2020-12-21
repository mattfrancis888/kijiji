import {
    AuthUserAction,
    AuthErrorAction,
    // ResetAuthErrorAction,
    // DisplaySignInFormAction,
    // DisplayRegisterFormAction,
} from "../actions";
export enum ActionTypes {
    AUTH_USER,
    AUTH_ERROR,
    REFETCHING_ACCESS_TOKEN,
}
export type Actions = AuthUserAction | AuthErrorAction;
