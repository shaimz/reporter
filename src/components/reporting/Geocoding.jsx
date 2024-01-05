import React, { useState, useContext } from "react";
import myContext from "../../context/data/myContext";

const GeocodingSearch = () => {
  const context = useContext(myContext);
  const { address } = context;


  return (
    <div className="text-dark">
      {address && <p>Address: {address}</p>}
    </div>
  );
};

export default GeocodingSearch;