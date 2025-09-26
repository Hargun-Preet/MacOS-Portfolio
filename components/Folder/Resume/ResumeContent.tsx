import React from 'react';

export const ResumeContent = () => {
  const resumePath = '/assets/HargunPreet_Singh_Resume.pdf'; // Path to your resume in the /public folder

  return (
    <div className=" text-gray-800 h-full flex flex-col">
      
      {/* The iframe will embed and display the PDF */}
      <div className="flex-grow border border-gray-300 rounded-lg overflow-hidden">
        <iframe 
          src={resumePath} 
          width="100%" 
          height="100%" 
          title="Resume PDF Viewer"
          style={{ border: 'none' }} // Remove default iframe border
        />
      </div>
    </div>
  );
};