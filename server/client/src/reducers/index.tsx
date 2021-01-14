import { combineReducers } from "redux";
import { reducer as formReducer, FormStateMap } from "redux-form";
import authReducer from "./authReducer";
import { AuthStateResponse } from "./authReducer";
import categoryReducer from "./categoryReducer";
import listingReducer, { ListingDataResponse } from "./listingReducer";
import profileReducer, { UserProfileDataResponse } from "./profileReducer";

export interface StoreState {
    authStatus: AuthStateResponse;
    categories: [];
    listingInfo: ListingDataResponse;
    profileInfo: UserProfileDataResponse;
    form: FormStateMap;
}
export default combineReducers<StoreState>({
    authStatus: authReducer,
    categories: categoryReducer,
    listingInfo: listingReducer,
    profileInfo: profileReducer,
    form: formReducer,
});
