import React from "react";
import "./SearchBox.scss"; // Assuming you have a CSS file for styling



const SearchBox = ({ className, placeholder, onChangeHandler }) => (
  <input
    className={`searchbox ${className}`}
    type="search"
    placeholder={placeholder}
    onChange={onChangeHandler}
  />
);

export default SearchBox;
