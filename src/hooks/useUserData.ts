
import { User } from '@/types/lms';
import { useCurrentUser } from './useCurrentUser';
import { useUserList } from './useUserList';
import { useUserActions } from './useUserActions';

export function useUserData() {
    const { currentUser, loadingCurrentUser } = useCurrentUser();
    const { data: allUsers, isLoading: loadingUsers } = useUserList(currentUser);
    const { createUser, updateUser } = useUserActions();

    return {
        users: allUsers ?? [],
        loadingUsers,
        currentUser: currentUser ?? null,
        loadingCurrentUser,
        createUser,
        updateUser,
    };
}
