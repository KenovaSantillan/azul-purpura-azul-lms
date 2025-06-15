
import { useState, useEffect } from 'react';
import { User } from '@/types/lms';
import { useCurrentUser } from './useCurrentUser';
import { useUserList } from './useUserList';
import { useUserActions } from './useUserActions';

export function useUserData() {
    const [users, setUsers] = useState<User[]>([]);
    const { currentUser, loadingCurrentUser } = useCurrentUser();
    const { data: allUsersFromQuery } = useUserList(currentUser);
    const { createUser, updateUser } = useUserActions(users, setUsers);

    useEffect(() => {
        const sampleUsers: User[] = [
            { id: '1', name: 'Prof. María González', email: 'maria@escuela.edu', role: 'teacher', status: 'active' },
            { id: '2', name: 'Juan Pérez', email: 'juan@estudiante.edu', role: 'student', status: 'active' },
            { id: '3', name: 'Ana Martínez', email: 'ana@estudiante.edu', role: 'student', status: 'active' },
            { id: '4', name: 'Carlos López', email: 'carlos@estudiante.edu', role: 'student', 'status': 'inactive' },
            { id: '5', name: 'Tutor Rodríguez', email: 'tutor@escuela.edu', role: 'tutor', status: 'active' },
        ];
        
        let usersForSetup: User[] = sampleUsers;
        if (currentUser?.role === 'admin' && allUsersFromQuery) {
            usersForSetup = allUsersFromQuery;
        }
        setUsers(usersForSetup);
    }, [currentUser, allUsersFromQuery]);

    const addUser = (user: Omit<User, 'id'>) => {
        const newUser: User = {
            ...user,
            id: Date.now().toString(),
        };
        setUsers(prev => [...prev, newUser]);
    };

    const deleteUser = (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    return {
        users,
        currentUser: currentUser ?? null,
        loadingCurrentUser,
        addUser,
        createUser,
        updateUser,
        deleteUser,
    };
}
