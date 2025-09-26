"use client";

import React, { useState } from 'react';
import Desktop from '@/components/Desktop/Desktop';
import StartupLoader from '@/components/Loader/Apple-Start';

export default function HomePage() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <main>
      {/* 1. Always render the Desktop component in the background */}
      <Desktop />

      {/* 2. Conditionally render the StartupLoader on top.
             It will be removed from the DOM after its animation is finished. */}
      {/* {isBooting && (
        <StartupLoader onFinished={() => setIsBooting(false)} />
      )} */}
    </main>
  );
}