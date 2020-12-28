import { combineReducers } from "redux";
import { reducer as formReducer, FormStateMap } from "redux-form";
import authReducer from "./authReducer";
import { AuthStateResponse } from "./authReducer";
import categoryReducer from "./categoryReducer";
import { Listing } from "../actions";
import listingReducer from "./listingReducer";
export interface StoreState {
    authStatus: AuthStateResponse;
    categories: [];
    listings: Listing[];
    form: FormStateMap;
}
export default combineReducers<StoreState>({
    authStatus: authReducer,
    categories: categoryReducer,
    listings: listingReducer,
    form: formReducer,
});
