import React from 'react';

// Your GitHub repository URL
const GITHUB_REPO_URL = "https://github.com/Hargun-Preet/MacOS-Portfolio";

// Convert the GitHub URL to the github1s.com format
const GITHUB1S_URL = GITHUB_REPO_URL.replace('github.com', 'github1s.com');

export const VSCodeWindowContent = () => {
  return (
    <div className="w-full h-full bg-[#202020]">
      <iframe
        className="w-full h-full border-0"
        src={GITHUB1S_URL}
        title="VSCode"
      />
    </div>
  );
};
