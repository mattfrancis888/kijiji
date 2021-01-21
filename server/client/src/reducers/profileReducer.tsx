import { ActionTypes, UserProfileAction } from "../actions";
import { UserProfile } from "../actions";
import _ from "lodash";

export interface UserProfileDataResponse {
    data?: UserProfile | ServerError;
}

const listingReducer = (
    state: UserProfileDataResponse = {},
    action: UserProfileAction
) => {
    switch (action.type) {
        case ActionTypes.FETCH_USER_PROFILE:
            return { ...state, data: action.payload };
        case ActionTypes.FETCH_USER_PROFILE_ERROR:
            return { ...state, data: action.payload };
        default:
            return state;
    }
};

export default listingReducer;
