import { combineReducers } from "redux";
import { reducer as formReducer, FormStateMap } from "redux-form";
import authReducer from "./authReducer";
import { AuthStateResponse } from "./authReducer";

export interface StoreState {
    authStatus: AuthStateResponse;
    form: FormStateMap;
}
export default combineReducers<StoreState>({
    authStatus: authReducer,
    form: formReducer,
});