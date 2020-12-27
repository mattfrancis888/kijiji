import React from "react";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
const Loading = (): JSX.Element => {
    return <ClipLoader color={"grey"} loading={true} />;
};
export default Loading;
