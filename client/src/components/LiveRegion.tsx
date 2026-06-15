import React from 'react';

export const LiveRegion: React.FC<{ message: string }> = ({ message }) => (
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    {message}
  </div>
);
