import { combineReducers } from "redux";
import { reducer as formReducer, FormStateMap } from "redux-form";

export interface StoreState {
    form: FormStateMap;
}
export default combineReducers<StoreState>({
    form: formReducer,
});
