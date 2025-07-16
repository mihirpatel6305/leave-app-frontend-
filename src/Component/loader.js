import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-4">
      <div className="w-20 h-20 border-[6px] border-blue-500 border-dashed rounded-full animate-spin"></div>
      <p className="text-blue-600 text-lg font-medium animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
};

export default Loader;
