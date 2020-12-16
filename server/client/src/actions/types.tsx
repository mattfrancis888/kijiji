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
}
export type Actions = AuthUserAction | AuthErrorAction;
