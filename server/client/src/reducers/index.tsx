import { combineReducers } from "redux";
import { reducer as formReducer, FormStateMap } from "redux-form";
import authReducer from "./authReducer";
import { AuthStateResponse } from "./authReducer";
import categoriesReducer from "./categoriesReducer";

export interface StoreState {
    authStatus: AuthStateResponse;
    categories: [];
    form: FormStateMap;
}
export default combineReducers<StoreState>({
    authStatus: authReducer,
    categories: categoriesReducer,
    form: formReducer,
});
