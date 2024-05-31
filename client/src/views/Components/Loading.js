import React from "react";
import ReactLoading from "react-loading";
import "../../styles/LoadingPage.scss";

function LoadingWindow() {
  return (
    <div className="loading-page">
      <div className="loading-container">
        <ReactLoading
          type={"spin"}
          color={"#0E46A3"}
          height={"4em"}
          width={"4em"}
        />
      </div>
    </div>
  );
}

export default LoadingWindow;
