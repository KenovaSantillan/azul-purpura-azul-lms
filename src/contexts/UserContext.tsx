
import React, { createContext, useContext } from 'react';
import { User } from '@/types/lms';
import { useUserData } from '@/hooks/useUserData';

interface UserContextType {
  users: User[];
  loadingUsers: boolean;
  currentUser: User | null;
  loadingCurrentUser: boolean;
  createUser: (userData: { email: string; role: 'student' | 'teacher' | 'tutor' | 'parent' | 'admin'; first_name: string; last_name: string; }) => Promise<User>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const userData = useUserData();

  const value = {
    ...userData,
    loadingUsers: (userData as any).loadingUsers || false,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
