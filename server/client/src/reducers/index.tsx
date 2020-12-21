import { combineReducers } from "redux";
import { reducer as formReducer, FormStateMap } from "redux-form";
import authReducer from "./authReducer";
import { AuthStateResponse } from "./authReducer";
import tokenReducer, {
    RefetchingAccessTokenStateResponse,
} from "./tokenReducer";
export interface StoreState {
    authStatus: AuthStateResponse;
    refetchingAccessToken: RefetchingAccessTokenStateResponse;
    form: FormStateMap;
}
export default combineReducers<StoreState>({
    authStatus: authReducer,
    refetchingAccessToken: tokenReducer,
    form: formReducer,
});
