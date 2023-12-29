import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Changelog from '@/components/Changelog';

interface ChangelogHandlerProps {
  children: React.ReactNode;
}

const ChangelogHandler: React.FC<ChangelogHandlerProps> = ({ children }) => {
  const { user } = useUser();
  const [showChangelog, setShowChangelog] = useState(false);

  useEffect(() => {
    const hasClosedChangelog = localStorage.getItem("hasClosedChangelog");
    if (user && !hasClosedChangelog) {
      setShowChangelog(true);
    }
  }, [user]);

  const handleCloseChangelog = () => {
    setShowChangelog(false);
    localStorage.setItem("hasClosedChangelog", "true");
  };

  return (
    <>
      {showChangelog && <Changelog onClose={handleCloseChangelog} />}
      {children}
    </>
  );
}

export default ChangelogHandler;
