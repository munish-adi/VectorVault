import React, { useState } from 'react';

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false); // Tracks if a file is hovering

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus('');
    }
  };

  // --- NEW DRAG AND DROP BRAINS ---
  const handleDragOver = (e) => {
    e.preventDefault(); // Stops the browser from opening the file in a new tab
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      // Idiot check to make sure you didn't drop a JPEG
      if (droppedFile.name.match(/\.(csv|xlsx|xls)$/i)) {
        setFile(droppedFile);
        setUploadStatus('');
      } else {
        setUploadStatus('Error: Only Excel or CSV files are allowed.');
      }
    }
  };
  // --------------------------------

  const removeFile = () => {
    setFile(null);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(`Success: ${data.message}`);
      } else {
        const errorData = await response.json();
        setUploadStatus(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      setUploadStatus('Failed to connect to the brain (backend). Is it running?');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <label 
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          {/* pointer-events-none stops the text inside from interrupting the drag state */}
          <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
            <svg className={`w-8 h-8 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">Excel (.xlsx, .xls) or CSV</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
            onChange={handleFileChange} 
          />
        </label>
      ) : (
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-center">
          <div className="flex items-center space-x-3 overflow-hidden">
            <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span className="text-sm font-medium text-blue-700 truncate">{file.name}</span>
          </div>
          <button 
            onClick={removeFile} 
            className="text-blue-400 hover:text-blue-600 font-bold px-2 py-1 rounded-md transition-colors"
            title="Remove file"
          >
            ✕
          </button>
        </div>
      )}
      
      <button 
        onClick={handleUpload}
        disabled={!file || isUploading}
        className={`mt-4 w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
          file && !isUploading
            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isUploading ? 'Sending to Brain...' : 'Process & Index Data'}
      </button>

      {uploadStatus && (
        <div className={`mt-3 text-sm text-center font-medium ${uploadStatus.includes('Error') || uploadStatus.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>
          {uploadStatus}
        </div>
      )}
    </div>
  );
}