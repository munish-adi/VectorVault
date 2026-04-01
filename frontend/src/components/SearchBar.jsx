import React, { useState } from 'react';

export default function SearchBar({ onSearch, isSearching }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div className="relative flex items-center w-full h-12 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 bg-gray-50 dark:bg-gray-800 overflow-hidden border border-gray-300 dark:border-gray-700 transition-all shadow-sm">
        <div className="grid place-items-center h-full w-12 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          className="peer h-full w-full outline-none text-sm text-gray-700 dark:text-gray-200 pr-2 bg-transparent"
          type="text"
          id="search"
          placeholder="Search for a product (e.g., '1/4 inch steel pipe')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSearching}
        />
        <button 
          type="submit"
          disabled={isSearching || !query.trim()}
          className={`h-full px-6 font-medium text-white transition-colors border-l border-transparent ${
            isSearching || !query.trim() 
              ? 'bg-blue-400 dark:bg-blue-500/50 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500'
          }`}
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
}