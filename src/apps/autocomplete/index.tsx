import AutocompleteComponent from "./AutocompleteComponent";
import { useState, type ChangeEvent } from "react";

export default function Autocomplete() {
  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setVal(e.target.value);
  // };
  // const isOpen = Boolean(val.length);

  return (
    <div>
      <AutocompleteComponent
        currInput={"ab"}
        // onChange={handleChange}
        // isOpen={isOpen}
        URL="https://dummyjson.com/users/search"
      />
    </div>
  );
}
