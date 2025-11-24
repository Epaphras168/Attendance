import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value); // update parent immediately
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 pl-10 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default SearchBar;
