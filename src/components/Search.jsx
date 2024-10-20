import React, { useState } from "react";

function Search({ onSearch }) {
  const [city, setCity] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setCity("");
    }
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold mr-3">Weather Dashboard</h1>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Enter city name"
            className="px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black dark:text-white bg-gray-100 dark:bg-gray-800"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Search;
