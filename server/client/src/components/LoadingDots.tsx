import React from "react";
import { StageSpinner } from "react-spinners-kit";
const LoadingDots = (): JSX.Element => {
    return <StageSpinner size={150} color="grey" loading={true} />;
};
export default LoadingDots;
