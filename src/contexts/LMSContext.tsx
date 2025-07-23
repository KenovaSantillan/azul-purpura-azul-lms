import React, { useEffect } from 'react';
import useLMSStore from '@/store/useLMSStore';
import { useUser } from './UserContext';

export const LMSProvider = ({ children }: { children: React.ReactNode }) => {
  const { users } = useUser();
  const initializeGroups = useLMSStore(state => state.initializeGroups);

  useEffect(() => {
    if (users.length > 0) {
      initializeGroups(users);
    }
  }, [users, initializeGroups]);

  return <>{children}</>;
};

export const useLMS = useLMSStore;
