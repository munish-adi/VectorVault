import React from 'react';
import FileUploader from './components/FileUploader';
import SearchBar from './components/SearchBar';
import { useState } from 'react'; // You'll need this for state
function App() {
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (query) => {
    console.log("User searched for:", query);
    setIsSearching(true);
    // Fake a delay to pretend the backend is working
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            VectorVault <span className="text-blue-600">Search</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Local similarity search pipeline. Upload Excel, embed, and query.
          </p>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Upload & Controls */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Data Source</h2>
              {/* We will inject the FileUploader component here later */}
              <FileUploader />
            </div>
          </div>

          {/* Right Column: Search & Results */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              {/* We will inject the SearchBar component here later */}
              <SearchBar onSearch={handleSearch} isSearching={isSearching} />
              
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-700">Results</h3>
                <div className="text-sm text-gray-400 italic">
                  Upload a dataset and run a query to see results.
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;