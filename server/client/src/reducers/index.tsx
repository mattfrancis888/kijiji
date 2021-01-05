import { combineReducers } from "redux";
import { reducer as formReducer, FormStateMap } from "redux-form";
import authReducer from "./authReducer";
import { AuthStateResponse } from "./authReducer";
import categoryReducer from "./categoryReducer";
import { FetchListingResponse } from "../actions";
import listingReducer from "./listingReducer";
export interface StoreState {
    authStatus: AuthStateResponse;
    categories: [];
    listingInfo: FetchListingResponse;
    form: FormStateMap;
}
export default combineReducers<StoreState>({
    authStatus: authReducer,
    categories: categoryReducer,
    listingInfo: listingReducer,
    form: formReducer,
});
