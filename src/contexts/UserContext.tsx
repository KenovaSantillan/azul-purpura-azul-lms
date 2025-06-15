import React, { createContext, useContext } from 'react';
import { User } from '@/types/lms';
import { useUserData } from '@/hooks/useUserData';

interface UserContextType {
  users: User[];
  currentUser: User | null;
  loadingCurrentUser: boolean;
  addUser: (user: Omit<User, 'id'>) => void;
  createUser: (userData: { email: string; role: 'student' | 'teacher' | 'tutor' | 'parent' | 'admin'; first_name: string; last_name: string; }) => Promise<User>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
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
