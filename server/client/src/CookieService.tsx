import Cookies from "js-cookie";

const ACCESS_TOKEN = "ACCESS_TOKEN";

//Redudant helper class, but still going to use it for future reference regarding refresh tokens being stored in
//http only cookie
const CookieService = (function () {
    let _service;
    function _getService() {
        if (!_service) {
            _service = this;
            return _service;
        }
        return _service;
    }

    function _setToken(tokenObj: any) {
        Cookies.set(ACCESS_TOKEN, tokenObj.ACCESS_TOKEN);
        // Cookies.set(REFRESH_TOKEN, tokenObj.REFRESH_TOKEN);
        //Refresh token needs to be set in headers (as demonstrated in backend's controllers/authentication.ts)
    }
    function _getAccessToken() {
        return Cookies.get(ACCESS_TOKEN);
    }
    // function _getRefreshToken() {
    //Cannot read httponly cookie with JS
    //     return Cookies.get(REFRESH_TOKEN);
    // }
    // function _clearToken() {
    //Removed in backend's controllers/authentication.ts;
    // }
    return {
        getService: _getService,
        setToken: _setToken,
        getAccessToken: _getAccessToken,
        // getRefreshToken: _getRefreshToken,
        //clearToken: _clearToken,
    };
})();

export default CookieService;
