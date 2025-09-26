import React from 'react';

// Replace this with your actual GitHub repository URL
const GITHUB_REPO_URL = "https://github.com/Hargun-Preet/Budgetly";

// StackBlitz URL format: `stackblitz.com/github/{USERNAME}/{REPO_NAME}`
const STACKBLITZ_URL = GITHUB_REPO_URL.replace('github.com', 'stackblitz.com/github');

export const VSCodeWindowContent = () => {
  return (
    <div className="w-full h-full bg-neutral-800">
      <iframe
        src={`${STACKBLITZ_URL}?embed=1&file=app/page.tsx`} // Embed mode, opens a specific file first
        className="w-full h-full border-0"
        title="VSCode Editor"
      />
    </div>
  );
};