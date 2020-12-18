import { ActionTypes, Actions } from "../actions";

export interface AuthStateResponse {
    authenticated?: string | null;
    //it can be null if local storage is empty and dosent contain the token (refer to Root.tsx);
    errorMessage?: string;
}

export const AUTH_STATE: AuthStateResponse = {
    authenticated: "",
    errorMessage: "",
};
const authReducer = (
    state: AuthStateResponse = AUTH_STATE,
    action: Actions
) => {
    switch (action.type) {
        case ActionTypes.AUTH_USER:
            return {
                ...state,
                authenticated: action.payload.token,
                errorMessage: "",
            };
        case ActionTypes.AUTH_ERROR:
            return { ...state, errorMessage: action.payload };
        default:
            return state;
    }
};

export default authReducer;
