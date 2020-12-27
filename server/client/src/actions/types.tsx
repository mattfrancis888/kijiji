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
    FETCH_CATEGORIES_FOR_LISTING,
}
export type Actions = AuthUserAction | AuthErrorAction;
