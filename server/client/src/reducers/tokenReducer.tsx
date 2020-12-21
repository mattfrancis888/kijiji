import { ActionTypes, RefetchingAccessTokenAction } from "../actions";

export interface RefetchingAccessTokenStateResponse {
    status: boolean;
}

export const REFETCHING_ACCESS_TOKEN_STATE: RefetchingAccessTokenStateResponse = {
    status: false,
};
const tokenReducer = (
    state: RefetchingAccessTokenStateResponse = REFETCHING_ACCESS_TOKEN_STATE,
    action: RefetchingAccessTokenAction
) => {
    switch (action.type) {
        case ActionTypes.REFETCHING_ACCESS_TOKEN:
            return {
                ...state,
                status: action.payload,
            };
        default:
            return state;
    }
};

export default tokenReducer;
