import React from "react";
import FadeLoader from "react-spinners/FadeLoader";

function Loader() {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-gray-200/50 backdrop-blur-sm z-[10000]">
      <FadeLoader color="#36d7b7" />
    </div>
  );
}

export default Loader;
